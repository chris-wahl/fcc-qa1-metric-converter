'use strict';
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

    let convertHandler = new ConvertHandler();
    app.get('/api/convert', (req, res) => {
        // Strip any whitespace
        const initNum = convertHandler.getNum(req.query.input);
        const initUnit = convertHandler.getUnit(req.query.input);

        if (initNum === convertHandler.ERROR && initUnit === convertHandler.ERROR)
            return res.send('invalid number and unit');
        else if (initNum === convertHandler.ERROR) return res.send('invalid number');
        else if (initUnit === convertHandler.ERROR) return res.send('invalid unit');

        const returnNum = parseFloat(convertHandler.convert(initNum, initUnit).toFixed(5));
        const returnUnit = convertHandler.getReturnUnit(initUnit);

        const initLong = convertHandler.spellOutUnit(initUnit);
        const returnLong = convertHandler.spellOutUnit(returnUnit);

        return res.json({
            initNum, initUnit, returnNum, returnUnit,
            string: `${initNum} ${initLong} converts to ${returnNum} ${returnLong}`
        });
    })

};
<!-- 2021 Christopher Wahl -->
