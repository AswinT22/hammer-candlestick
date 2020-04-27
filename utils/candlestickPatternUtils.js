module.exports.isHammer= function (row) {
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
