const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const csvWriter = require('csv-write-stream');
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
        if(isHammer(row)) {
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

function isHammer(row) {
    // defining these to perform checks later, if required any
    const close = parseFloat(row.close);
    const open = parseFloat(row.open);
    const high = parseFloat(row.high);
    const low = parseFloat(row.low);

    //no body 
    if (open == close) {
        return false;
    }

    // has a upper wick
    if (high != open && high != close) {
        return false;
    }
    value = (Math.abs(close-open) / (high-low));
    // body shouldn't be more than 30 % and should atleast have a 10 % of the candle
    if (0.3 >= value && value >= 0.1) { 
            return true;
            /**
              * need not check the lowerwick because we match high to either close/open  
              * "1.0 > ((Math.min(close,open) - low) / (high-low)) >= 0.7"
              * */

    } 

    /**
     * Alternate formula to check for hammer with below listed constraints
     * 1. Body shouldn't be more than 30 % and should atleast be 10 % of the candle
     * 2. Upper wick shouldn't be more than 25% of the body
     * 3. Lower wick should be atleast double the size of the body 
     * */
    //  if(0.3 >= (Math.abs(close - open) / (high - low)) >= 0.1 && 
    //         (high - Math.max(close, open)) <= (0.25 * Math.abs(close - open)) && 
    //             (Math.min(close, open)) - low >= (2 *  Math.abs(close - open)) 
    // ) {

    //     return true
    //  } 
    
    return false;
}
