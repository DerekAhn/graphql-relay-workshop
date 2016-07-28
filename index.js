'use strict';

const pg          = require('pg');
const { graphql } = require('graphql');
const express     = require('express');
const app         = express();
const graphQLHttp = require('express-graphql');
const d           = require('eyes').inspector({ length: -1 });
const DataLoader  = require('dataloader');

const config = {
  database: 'forwardjs'
};
const pool   = new pg.Pool(config);

const mySchema = require('./schema');
const db       = require('./database')(pool)

app.use(express.static('public'));

app.use('/graphql', (req, res) => {
  const userLoader = new DataLoader(keys => myBatchGetUsers(keys));

  const loaders = {
    usersByIds: new DataLoader(db.getUsersByIds)
  };

  return graphQLHttp({
    schema: mySchema,
    context: { pool, loaders },
    graphiql: true
  })(req, res);
});

app.listen(3000, () => {
  d('Express is running...');
});
