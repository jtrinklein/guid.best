/*
The MIT License (MIT)

Copyright (c) 2010-2020 Robert Kieffer and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(){
    //-------------
    // taken from https://github.com/uuidjs/uuid/blob/1c849da6e164259e72e18636726345b13a7eddd6/src/stringify.js
    // reverted performance fix that was optimized for server side in favor of browser side performance.

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    const byteToHex = [];

    for (let i = 0; i < 256; ++i) {
        byteToHex.push((i + 0x100).toString(16).substr(1));
    }
    function stringifyUuid(arr) {
        const uuid = [
            byteToHex[arr[0]],
            byteToHex[arr[1]],
            byteToHex[arr[2]],
            byteToHex[arr[3]],
            '-',
            byteToHex[arr[4]],
            byteToHex[arr[5]],
            '-',
            byteToHex[arr[6]],
            byteToHex[arr[7]],
            '-',
            byteToHex[arr[8]],
            byteToHex[arr[9]],
            '-',
            byteToHex[arr[10]],
            byteToHex[arr[11]],
            byteToHex[arr[12]],
            byteToHex[arr[13]],
            byteToHex[arr[14]],
            byteToHex[arr[15]]
        ].join('');
        return uuid;
    }
    //-------- end stringify

    //--------
    // taken from https://github.com/uuidjs/uuid/blob/1c849da6e164259e72e18636726345b13a7eddd6/src/rng-browser.js

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).

    let getRandomValues;

    const rnds8 = new Uint8Array(16);

    function rng() {
        // lazy load so that environments that need to polyfill have a chance to do so
        if (!getRandomValues) {
            // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
            // find the complete implementation of crypto (msCrypto) on IE11.
            getRandomValues =
                (typeof crypto !== 'undefined' &&
                    crypto.getRandomValues &&
                    crypto.getRandomValues.bind(crypto)) ||
                (typeof msCrypto !== 'undefined' &&
                    typeof msCrypto.getRandomValues === 'function' &&
                    msCrypto.getRandomValues.bind(msCrypto));
            if (!getRandomValues) {
                throw new Error(
                    'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
                );
            }
        }

        return getRandomValues(rnds8);
    }
    //---------- end rng

    // taken from https://github.com/uuidjs/uuid/blob/1c849da6e164259e72e18636726345b13a7eddd6/src/v4.js
    function newUuid() {
        let randomNumbers = rng();
        // Per uuid spec 4.4, set bits for version and `clock_seq_hi_and_reserved`
        randomNumbers[6] = (randomNumbers[6] & 0x0f) | 0x40;
        randomNumbers[8] = (randomNumbers[8] & 0x3f) | 0x80;
        const uuid = stringifyUuid(randomNumbers);
        return uuid;
    }

    window.uuid = newUuid;
})()