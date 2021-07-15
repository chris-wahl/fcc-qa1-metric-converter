const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();
const VALID_UNITS = [
    'gal', 'L',
    'km', 'mi',
    'lbs', 'kg'
];

const VALID_NUMBERS = [
    '937', '1', '0', '-1', '-913', // Whole numbers
    '0.123', '-0.321', '-324.98', // Decimals
    '1/2', '-1/2', '0/3', // Integer fractions
    '1.3/3', '-1.3/3', '-13.3/233',  // decimal numerator fractions
    '3/27.0', '-3/27.0', '-867/2.0', // decimal denominator fractions
    '10.231/23.7', '-10.231/23.7', // Full decimal fractions
];
suite('Unit Tests', function () {
    const errorMessage = 'error';

    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    const getNum = convertHandler.getNum
    const getUnit = convertHandler.getUnit
    const getReturnUnit = convertHandler.getReturnUnit
    const spellOutUnit = convertHandler.spellOutUnit
    const convert = convertHandler.convert;

    test('convertHandler should correctly read a whole number input', function () {
        for (let i = 0; i < 20; i++) {
            assert.equal(getNum(i.toString()), i);
        }
    });
    test('convertHandler should correctly read a decimal number input', function () {
        const decimal = 2.33;
        assert.equal(getNum(decimal.toString()), decimal);
    });
    test('convertHandler should correctly read a fractional input', function () {
        const [numerator, denominator] = [12, 24];
        assert.equal(getNum(`${numerator}/${denominator}`), numerator / denominator);
    });
    test('convertHandler should correctly read a fractional input with a decimal', function () {
        const [numerator, denominator] = [1.23, 6];
        assert.equal(getNum(`${numerator}/${denominator}`), numerator / denominator);
        assert.equal(getNum(`${denominator}/${numerator}`), denominator / numerator);
        assert.equal(getNum(`${numerator}/${numerator}`), 1);
    });
    test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', function () {

        assert.equal(getNum('1/2/'), errorMessage);
        assert.equal(getNum('1/2/3'), errorMessage);
        assert.equal(getNum('1//2'), errorMessage);
    });
    test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function () {
        assert.equal(getNum('kg'), 1);
    });
    test('convertHandler should correctly read each valid input unit', function () {

        VALID_UNITS.forEach(u => {
            const UPPER = u.toUpperCase();
            const LOWER = u.toLowerCase();
            const MIXED = u[0].toUpperCase() + u.slice(1).toLowerCase();
            VALID_NUMBERS.forEach(n => {
                assert.equal(getUnit(`${n}${UPPER}`), u, `${n}${UPPER}`);
                assert.equal(getUnit(`${n}${LOWER}`), u, `${n}${LOWER}`);
                assert.equal(getUnit(`${n}${MIXED}`), u, `${n}${MIXED}`);
            })
        })
    });
    test('convertHandler should correctly return an error for an invalid input unit', function () {
        assert.equal(getUnit('12'), errorMessage);
        assert.equal(getUnit('0f'), errorMessage);
        assert.equal(getUnit('-1Opp'), errorMessage);
        assert.equal(getUnit(''), errorMessage); // No input
        assert.equal(getUnit('km '), errorMessage); // Note the extra whitespace at the end
    });
    test('convertHandler should return the correct return unit for each valid input unit', function () {
        const unitCounter = new Set([...VALID_UNITS]);

        [ // Pair off the conversions to be tested
            ['L', 'gal'],
            ['km', 'mi'],
            ['kg', 'lbs']
        ].forEach(([unit1, unit2]) => {
            assert.isTrue(unitCounter.delete(unit1), `${unit1} is not an expected valid unit!`);
            assert.isTrue(unitCounter.delete(unit2), `${unit2} is not an expected valid unit!`);
            assert.equal(getReturnUnit(unit1), unit2, `${unit1} did not return ${unit2}`);
            assert.equal(getReturnUnit(unit2), unit1, `${unit2} did not return ${unit1}`);
        });

        assert.equal(unitCounter.size, 0,
            'Units remain to be checked: ' + [...unitCounter].sort().join(', ')
        );
    });
    test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function () {
        const unitCounter = new Set([...VALID_UNITS]);

        [
            ['L', 'liters'], ['gal', 'gallons'],
            ['km', 'kilometers'], ['mi', 'miles'],
            ['kg', 'kilograms'], ['lbs', 'pounds']
        ].forEach(([unit, name]) => {
            assert.isTrue(unitCounter.delete(unit), `${unit} is not an expected valid unit!`);
            assert.equal(spellOutUnit(unit), name, unit + ' does not return ' + name);
        })
    });

    const UnitConversionTest = (usUnit, usToMetric) => {
        assert.equal(convert(1, usUnit), usToMetric, `input 1 ${usUnit}, should get conversion rate back`);
        assert.equal(convert(0, usUnit), 0, `input 0 ${usUnit}, should get 0 back`);
        assert.equal(convert(-1 / usToMetric, usUnit), -1, `input -1/conversion rate, should get -1 back`);
        assert.approximately(
            convert(25.658, usUnit), 25.658 * usToMetric, 1e-5,
            `input 25 ${usUnit}, should get 25.658*conversion rate back`
        );
        // Need this as fCC's verification method requires some kind of "assert" to be in the body of the test.
        // The above can still fail, though.
        return true;
    };


    test('convertHandler should correctly convert gal to L', function () {
        assert.isTrue(UnitConversionTest('gal', galToL));

    });
    test('convertHandler should correctly convert L to gal', function () {
        assert.isTrue(UnitConversionTest('L', 1/galToL));
    });
    test('convertHandler should correctly convert mi to km', function () {
        assert.isTrue(UnitConversionTest('mi', miToKm));
    });
    test('convertHandler should correctly convert km to mi', function () {
        assert.isTrue(UnitConversionTest('km', 1/miToKm));
    });
    test('convertHandler should correctly convert lbs to kg', function () {
        assert.isTrue(UnitConversionTest('lbs', lbsToKg));
    });
    test('convertHandler should correctly convert kg to lbs', function () {
        assert.isTrue(UnitConversionTest('kg', 1/lbsToKg));
    });
});
<!-- 2021 Christopher Wahl -->
