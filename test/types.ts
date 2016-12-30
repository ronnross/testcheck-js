import { check, property, gen } from '../'

// Test: single arg Error
check(property(
  gen.boolean,
  value =>
    // $ExpectError The operand of an arithmetic operation must be a number.
    value * 2 === 2
))

// Test: single arg ok
check(property(
  gen.number,
  value =>
    value * 2 === 2
))

// Test: multiple args Error
check(property(
  gen.string, gen.int,
  (aString, anInt) => {
    // $ExpectError cannot multiply a number and string
    return aString * anInt === 123
  }
))

// Test: multple args Ok
check(property(
  gen.number, gen.int,
  (aNumber, anInt) => {
    return aNumber * anInt === 123
  }
))

// Test: tuples Error
check(property(
  gen.shape([ gen.string, gen.int ]),
  ([ aString, anInt ]) => {
    // $ExpectError cannot multiply a number and string
    return aString * anInt === 123
  }
))

// Test: tuples Ok
check(property(
  gen.shape([ gen.number, gen.int ]),
  ([ aNumber, anInt ]) => {
    // Numbers can be multiplied
    return aNumber * anInt === 123
  }
))

// Test: normal arg + tuple arg Error
check(property(
  gen.number, gen.shape([ gen.string, gen.int ]),
  (aNumber, [aString, anInt]) =>
    // $ExpectError cannot multiply a number and string
    aNumber * aString === 123
))

// Test: normal arg + tuple arg OK
check(property(
  gen.number, gen.shape([ gen.string, gen.int ]),
  (number, array) =>
    // However numbers can be multiplied
    number * array[1] === 123
))

// Test: normal arg + tuple arg OK
check(property(
  gen.string, gen.shape([ gen.string, gen.int ]),
  (string, array) =>
    // Strings can be uppercased and added
    string.toUpperCase() + array[0].toUpperCase() === 'ABCABC'
))

// Test: Object records Error (TODO, Typescript currently treats this as "any")
check(property(
  gen.shape({ aString: gen.string, aNumber: gen.number }),
  ({ aString, aNumber }) =>
    // $ExpectError cannot multiply a number and string
    aString * aNumber === 123
))

// Test: Object records Ok
check(property(
  gen.shape({ anInt: gen.int, aNumber: gen.number }),
  ({ anInt, aNumber }) =>
    // However numbers can be multiplied
    anInt * aNumber === 123
))

// Test: Options OK
check(
  property(
    gen.string,
    string => string + string === 'abcabc'
  ),
  // Ok to provide options to check
  { numTests: 1000 }
)

// Test: Options Typo
check(
  property(
    gen.string,
    string => string + string === 'abcabc'
  ),
  // $ExpectError catches mistyped options
  { numTimes: 1000 }
)
