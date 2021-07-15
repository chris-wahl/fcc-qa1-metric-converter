const UNITS = {
  l: 'L', gal: 'gal', // Volume
  km: 'km', mi: 'mi', // Distance
  lbs: 'lbs', kg: 'kg' // Mass
};

const LONG_UNIT = {
  // Volume
  [UNITS.l]: 'liters', [UNITS.gal]: 'gallons',
  // Distance
  [UNITS.km]: 'kilometers', [UNITS.mi]: 'miles',
  // Mass
  [UNITS.kg]: 'kilograms', [UNITS.lbs]: 'pounds'
}

const CONVERT_TO = {
  // Volume
  [UNITS.l]: UNITS.gal, [UNITS.gal]: UNITS.l,
  // Distance
  [UNITS.km]: UNITS.mi,  [UNITS.mi]: UNITS.km,
  // Mass
  [UNITS.kg]: UNITS.lbs,  [UNITS.lbs]: UNITS.kg,
}

function ConvertHandler() {
  const error = this.ERROR = 'error';

  this.getNum = function(input) {
    // Get everything "numeric" (numbers, decimals, and "/"s)
    if (!input ) return 1;

    const result = input.match(/^((-)|\d|\.)([\d.\/]?)+/g);
    if (result !== null) {
      let rawValues = result[0].split('/');
      if (rawValues.length <= 2) { // Only allow one '/'
        // Decompose (at least) the numerator
        const [numerator, denominator] = rawValues;
        // Perform any divisor
        const value = numerator / (denominator || 1);
        // If we didn't divide by 0, return the value.
        if (isFinite(value)) return value;
      }
    } else if (input.replace(/\s*/g, '').length > 0) return 1; // There's a unit attached.
    return error;
  }

  this.getUnit = function(input) {
    const result = input.toLowerCase().match(/[a-z]+$/);

    if (result !== null ) {
      const unit = UNITS[result]; // Lookup in allowed units, also handles `l` -> `L`
      if (!!unit) return unit;
    }

    return error;
  };

  this.getReturnUnit = function(initUnit) {
    return CONVERT_TO[initUnit];
  };

  this.spellOutUnit = function(unit) {
    return LONG_UNIT[unit];
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    switch(initUnit) {
      case UNITS.gal:
        return initNum * galToL;
      case UNITS.l:
        return initNum / galToL;

      case UNITS.lbs:
        return initNum * lbsToKg;
      case UNITS.kg:
        return initNum / lbsToKg;

      case UNITS.mi:
        return initNum * miToKm;
      case UNITS.km:
        return initNum / miToKm;
    }
    return error;
  };
}

module.exports = ConvertHandler;
<!-- 2021 Christopher Wahl -->
