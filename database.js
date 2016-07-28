'use strict';

const humps = require('humps');

module.exports = pool => ({
  getUsersByIds(userIds) {
    return pool
          .query('select * from spouses where id = ANY($1)', [userIds])
          .then(result => humps.camelizeKeys(result.rows));
  }
  // getAllUsers() {
  //   return pool
  //         .query('select * from spouses', [])
  //         .then(result => humps.camelizeKeys(result.rows));
  // }
});
