const fs = require('fs');
const csv = require('csv-parser');

module.exports.renderChart = function (filePath, chartName) {
    const plotly = require('plotly')("ACCOUNT_NAME", "API_KEY");
    x = [];
    open = [];
    close = [];
    high = [];
    low = [];
    fs.createReadStream(filePath)
    .on('error', (err) => {
        console.log(err);
    })
    .pipe(csv())
    .on('data', (row) => {
        x.push(row.Date);
        open.push( parseFloat(row.open));
        high.push(parseFloat(row.high));
        low.push(parseFloat(row.low));
        close.push( parseFloat(row.close));
    })
    .on('end', () => {
        var data = {
            x: x,   
            close: close,
            low: low,  
            open: open,
            high: high, 
            decreasing: {line: {color: '#FF0000'}}, 
            increasing: {line: {color: '#00FF00'}}, 
            line: {color: 'rgba(31,119,180,1)'}, 
            type: 'candlestick', 
            xaxis: 'Date', 
            yaxis: 'Stock Price'
        };
        var dataset = [data];
        var layout = {
            dragmode: 'zoom',
            showlegend: false,
            xaxis: {
                rangeslider: {
                    visible: false
                }
            }
        };
        var graphOptions = {layout: layout, filename: chartName, fileopt: "overwrite"};
        plotly.plot(
            dataset, 
            graphOptions, 
            function (err, msg) {
                if(err) {
                    console.log(err);
                }
                console.log(msg.filename, "is available at", msg.url);
            }
        );
    });
}
