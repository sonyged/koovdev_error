/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 *
 * Provide some error utilities
 *
 * Copyright (c) 2017 Sony Global Education, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
