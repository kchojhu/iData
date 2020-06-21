import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";

const HomePage: React.FC = () => {
    return (
        <Grid container justify='center' alignItems='center' style={{
            height: '100%'
        }}>
            <Button component={Link} to='/addphoto' startIcon={<AddPhotoIcon /> }>
                Take A Picture Fatty!
            </Button>
        </Grid>
    )
}

export default HomePage;