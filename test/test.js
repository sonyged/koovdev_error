/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 */

'use strict';
const koovdev_error = require('..'),
      assert = require('assert');

const TEST_ERROR = 0xff;

const TEST_NO_ERROR = 0x00;
const TEST_UNKNOWN_REQUEST = 0x01; // no matching request found.
const TEST_MISC_ERROR = 0x02;

const TEST_NO_ERROR2 = 0xf0;

const { error, error_p, make_error } = koovdev_error(TEST_ERROR, [
  TEST_NO_ERROR,
  TEST_NO_ERROR2
]);

describe('error predicate', () => {
  it('should treat null as success', () => {
    assert.equal(error_p(null), false);
  });
  it('should treat undefined as success', () => {
    assert.equal(error_p(undefined), false);
  });
  it('should treat false as success', () => {
    assert.equal(error_p(false), false);
  });
  it('should treat object without error property as success', () => {
    assert.equal(error_p({}), false);
  });
  it('should treat object with null error property as success', () => {
    assert.equal(error_p({ error: null }), false);
  });
  it('should treat object with false error property as success', () => {
    assert.equal(error_p({ error: null }), false);
  });
  it('should treat object with true error property as error', () => {
    assert.equal(error_p({ error: true }), true);
  });
  it('should treat zero as error', () => {
    assert.equal(error_p(0), true);
  });
  it('should treat non zero number as error', () => {
    assert.equal(error_p(10), true);
  });
  it('should treat null string as error', () => {
    assert.equal(error_p(''), true);
  });
  it('should treat non-null string as error', () => {
    assert.equal(error_p('abc'), true);
  });
});

describe('error constructor', () => {
  it('should make error object', () => {
    assert.deepEqual(make_error(TEST_MISC_ERROR, 0), {
      error: true,
      error_code: 65282,
      msg: "unknown error",
      original_error: "0",
    });

    assert.deepEqual(make_error(TEST_MISC_ERROR, null), {
      error: true,
      error_code: 65282,
      msg: "unknown error",
      original_error: "null",
    });

    assert.deepEqual(make_error(TEST_MISC_ERROR, {}), {
      error: true,
      error_code: 65282,
      original_error: "{}",
    });

    assert.deepEqual(make_error(TEST_MISC_ERROR, { msg: 'some error' }), {
      error: true,
      error_code: 65282,
      msg: 'some error',
      original_error: "{\"msg\":\"some error\"}",
    });

    assert.deepEqual(make_error(TEST_MISC_ERROR, 'error occurred'), {
      error: true,
      error_code: 65282,
      msg: "error occurred",
      original_error: "\"error occurred\"",
    });
  });
});
