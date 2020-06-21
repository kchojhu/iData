import React from 'react';
import {AppContextActions} from "./AppContext";
import {AppFile, User, Weights} from "../typings";
import {ActionType} from "./AppReducer";
import moment from 'moment';

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const googleApi = gapi as any;

const getGDriveList = async (): Promise<AppFile[]> => {
    const result = await googleApi.client.drive.files.list({});
    const files: AppFile[] = result.result.files.map((file: any): AppFile => ({
        id: file.id,
        mimeType: file.mimeType,
        name: file.name,
        type: file.mimeType.includes('folder') ? 'folder' : 'file',
    }));

    return files;
}

const createGCreateFolder = async (name: string, rootFolder?: AppFile): Promise<AppFile> => {
    const fileMetadata: any = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
    };

    if (rootFolder) {
        fileMetadata.parents = [rootFolder.id];
    }

    const result = await googleApi.client.drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    });

    return result.result;
}

const getGWeights = async (): Promise<Weights> => {
    const endDate: moment.Moment = moment();
    const startDate = moment().subtract(1, 'years');

    const dataSources = await googleApi.client.fitness.users.dataSources.list({
        "userId": "me",
        "dataTypeName": [
            "com.google.weight"
        ]
    });
    const weightSource = dataSources.result.dataSource.filter((dataSource: any) => dataSource.dataStreamName === 'merge_weight')[0];

    const weights = await googleApi.client.fitness.users.dataSources.datasets.get({
        "userId": "me",
        "dataSourceId": weightSource.dataStreamId,
        "datasetId": `${startDate.valueOf() * 1000000}-${endDate.valueOf() * 1000000}`
    })

    const weightChartdata = weights.result.point.map((point: any) => ({
        date: new Date(point.startTimeNanos / 1000000),
        weight: (point.value[0].fpVal * 2.20462).toFixed(2),
    }));

    return weightChartdata;

}

function dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
}

const generateDispatcher = (dispatch: React.Dispatch<ActionType>): AppContextActions => ({
    setUser: (user: User | null): void => {
        dispatch({
            type: 'SET_USER',
            payload: user,
        });
    },
    getDriveList: async (): Promise<AppFile[]> => {
        return await getGDriveList();
    },
    setRootFolder: async (): Promise<void> => {
        let files: AppFile[] = await getGDriveList();
        files = files.filter(file => file.name === 'iData');
        if (files.length === 0) {
            await createGCreateFolder('iData');
            files = await getGDriveList();
            files = files.filter(file => file.name === 'iData');
        }

        dispatch({
            type: 'SET_ROOT_FOLDER',
            payload: files[0],
        });
    },
    setPhotoFolder: async (rootFolder: AppFile): Promise<void> => {
        let files: AppFile[] = await getGDriveList();
        files = files.filter(file => file.name === 'iDataPhoto');
        if (files.length === 0) {
            await createGCreateFolder('iDataPhoto', rootFolder);
            files = await getGDriveList();
             files = files.filter(file => file.name === 'iDataPhoto');
        }

        dispatch({
             type: 'SET_PHOTO_FOLDER',
             payload: files[0],
        });
    },
    addPhoto: async(photoFolder: AppFile, dataUri: string):Promise<void> => {
        console.log('photoFolder', photoFolder);

        const fileName = moment().format('YYYY_MM_DD_hh_mm_ss.png');

        const metadata = {
            name: fileName,
            mimeType: 'image/png',
            parents: [photoFolder.id]
        };
        let form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', dataURItoBlob(dataUri));

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
            body: form
        })
            .then(res => res.json())
    },
    createFolder: async (name: string): Promise<AppFile> => {
        return await createGCreateFolder(name);
    },
    getWeights: async (): Promise<void> => {
        const weights = await getGWeights();
        dispatch({
            type: 'GET_WEIGHT',
            payload: weights,
        });
    },
    loadGoogleApi: async (): Promise<void> => {
        while (!gapi.client || !gapi.client.load) {
            await timeout(100);
        }

        gapi.client.load("fitness", "v1").then(() => {
            gapi.client.load('drive', "v3").then(() => {
                dispatch({
                    type: 'GOOGLE_API_LOADED',
                });

            });
        });
        // await client.load("fitness", "v1");
        // await client.load('drive', "v3");
        //
        // while (!client.fitness || !client.drive) {
        //     await timeout(100);
        // }
        // dispatch({
        //     type: 'GOOGLE_API_LOADED',
        // });
    }
});

export default generateDispatcher;