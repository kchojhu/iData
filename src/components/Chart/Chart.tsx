import React, {useContext, useEffect} from 'react';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import AppContext from "../../context/AppContext";

const Chart: React.FC = () => {
    const { state } = useContext(AppContext);

    useEffect(() => {
        if (state.weights) {
            let chart: any = am4core.create("chartdiv", am4charts.XYChart);
            chart.data = state.weights;

// Create axes
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 50;

            chart.yAxes.push(new am4charts.ValueAxis());

// Create series
            let series: any = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "weight";
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.minBulletDistance = 10;
            series.tooltipText = "{valueY}";
            series.tooltip.pointerOrientation = "vertical";
            series.tooltip.background.cornerRadius = 20;
            series.tooltip.background.fillOpacity = 0.5;
            series.tooltip.label.padding(12, 12, 12, 12)

// Add scrollbar
            chart.scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX.series.push(series);

// Add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = dateAxis;
            chart.cursor.behavior = 'none';
            chart.cursor.snapToSeries = series;

        }
    }, [state.weights]);

    return (
        <div id="chartdiv" style={{width: "100%", height: "500px"}}/>
    );
};

// function generateChartData() {
//     let chartData = [];
//     let firstDate = new Date();
//     firstDate.setDate(firstDate.getDate() - 1000);
//     let visits = 1200;
//     for (var i = 0; i < 500; i++) {
//         // we create date objects here. In your data, you can have date strings
//         // and then set format of your dates using chart.dataDateFormat property,
//         // however when possible, use date objects, as this will speed up chart rendering.
//         let newDate = new Date(firstDate);
//         newDate.setDate(newDate.getDate() + i);
//
//         visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
//
//         chartData.push({
//             date: newDate,
//             visits: visits
//         });
//     }
//     return chartData;
// }

export default Chart;