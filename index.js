const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream')
const path = require('path')
const reorder = require('csv-reorder')

function main() {
    const inputFilePath = path.join(__dirname, "src", "data.csv")
    const outputFilePath = path.join(__dirname, "output", "hammer.csv")

    if (!fs.existsSync(inputFilePath)) throw "Should contain 'data.csv' under src folder"

    //prepare for output
    if (fs.existsSync(path.dirname(outputFilePath))) {

        if (fs.existsSync(outputFilePath)) { 
            fs.unlinkSync(outputFilePath)
        }

    } else {
        fs.mkdirSync(path.dirname(outputFilePath))
    }

    // using streams to handle large datasets
    var writer = csvWriter()
    writer.pipe(fs.createWriteStream(outputFilePath, {flags: 'a'}))

    console.log("Identifying hammer candlestick pattern.....")
    fs.createReadStream(inputFilePath)
    .on('error', (err) => {
        console.log(err)
    })
    .pipe(csv())
    .on('data', (row) => {
       if(isHammer(row)) {
            writer.write(row)
        }
    })
    .on('end', () => {
        writer.end()
    })

    //sort and remove duplicates
    console.log("Sorting and removing duplicates......")
    reorder({
        input: outputFilePath,
        output: outputFilePath,
        sort: 'Date',
        type: 'string',
        remove: true,
        "remove-duplicates": true,
        metadata: false
      })
      .then(metadata => {
          if (metadata.removed > 0) {
            console.log(`removed ${metadata.removed} duplicates`)
          }
          var totalHammers = metadata.rows - metadata.removed
          console.log(`There are total ${totalHammers} hammer candlestick pattern identified in the given dataset`)
      })
      .catch(error => {
        console.log(error)
      })

}

function isHammer(row) {
    // defining these to perform checks later, if required any
    const close = row.close
    const open = row.open
    const high = row.high
    const low = row.low

    //no body 
    if (open == close) {
        return false
    }

    // has a upper wick
    if (high != open && high != close) {
        return false
    }

    // body shouldn't be more than 30 % and should atleast have a 10 % of the candle
    if (0.3 >= (Math.abs(close-open) / (high-low)) >= 0.1) { 
            return true
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
    
    return false
}
main()

// Difference between two formulas, where the second formula produces below extra data from the supplied csv 
// 2012-07-27,540.500000,541.000000,527.325012,537.161987,402.296936,4931244
// 2015-04-27,1000.000000,1001.000000,974.049988,992.325012,892.963989,9911320
// 2016-05-24,1191.050049,1191.750000,1177.599976,1187.750000,1128.331055,1742530
// 2016-07-12,1180.000000,1180.349976,1168.000000,1176.550049,1130.705444,3098684
// 2016-11-08,986.900024,987.750000,970.599976,982.599976,954.440308,2630554
// 2005-05-18,257.500000,257.737000,249.136993,255.281006,118.744957,11085672
// 2005-12-28,374.875000,375.000000,370.250000,373.580994,183.468109,3432264
// 2009-04-09,358.750000,359.225006,349.000000,356.750000,223.571716,7530844