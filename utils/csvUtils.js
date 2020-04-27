const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const csvWriter = require('csv-write-stream');
const patternUtils = require(path.join(__dirname,"candleStickPatternUtils"));
const stringUtils = require(path.join(__dirname,"stringUtils"));
const chartUtils = require(path.join(__dirname,"chartUtils"));

module.exports.filterHammerAndWrite = function (inputFilePath, outputFilePath, render) {
    // using streams to handle large datasets
    var writer = csvWriter();
    writer.pipe(fs.createWriteStream(outputFilePath, {flags: 'a'}));
    
    var map = {};// handle duplicates
    console.log("Identifying hammer candlestick pattern.....");
    fs.createReadStream(inputFilePath)
    .on('error', (err) => {
        console.log(err);
    })
    .pipe(csv())
    .on('data', (row) => {
        var hash = stringUtils.stringToHash(row.Date);
        if (hash in map) {
            // Duplicates
            return
        }
        map[hash] = 1
        if(patternUtils.isHammer(row)) {
                writer.write(row);
        }
    })
    .on('end',  () => {
        writer.end();
        console.log("Find the filtered csv at",  outputFilePath);
        if (render) {
            chartUtils.renderChart(outputFilePath, "filtered-hammer-chart");
        }
    });
}
