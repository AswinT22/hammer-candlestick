const fs = require('fs');
const path = require('path');
const inputFilePath = path.join(__dirname, "src", "data.csv");
const outputFilePath = path.join(__dirname, "output", "hammer.csv");
const chartUtils = require(path.join(__dirname,"utils", "chartUtils"));
const patternUtils = require(path.join(__dirname,"utils", "candlestickPatternUtils"));
function main() {
    if (!fs.existsSync(inputFilePath)) {
        throw "Should contain 'data.csv' under src folder";
    }
    chartUtils.renderChart(inputFilePath, "input-data-chart");

    //prepare for output
    if (fs.existsSync(path.dirname(outputFilePath))) {

        if (fs.existsSync(outputFilePath)) { 
            fs.unlinkSync(outputFilePath);
        }

    } else {
        fs.mkdirSync(path.dirname(outputFilePath));
    }

    patternUtils.filterHammerAndWrite(inputFilePath, outputFilePath, true);
}

main()
