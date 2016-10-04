/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 *
 * Provide some error utilities
 */

'use strict';

const error_p = (err) => {
  if (err === null || err === undefined || err === false)
    return false;
  if (typeof err === 'object')
    return !!err.error;
  return true;
};

const generate_make_error = (category, no_errors) => {
  return (tag, err) => {
    if (no_errors.includes(tag))
      return err;
    const original_err = JSON.stringify(err);
    if (typeof err === 'string')
      err = { msg: err };
    if (typeof err !== 'object' || err === null)
      err = { msg: 'unknown error' };
    err.error = true;
    err.original_error = original_err;
    if (!err.error_code)
      err.error_code = ((category << 8) | tag) & 0xffff;
    return err;
  };
};

module.exports = (category, no_errors) => {
  const make_error = generate_make_error(category, no_errors);
  return {
    error: (tag, err, cb) => cb(make_error(tag, err)),
    error_p: error_p,
    make_error: make_error
  };
};
