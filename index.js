'use strict';

const pg          = require('pg');
const { graphql } = require('graphql');
const app         = require('express')();
const graphQLHttp = require('express-graphql');
const d           = require('eyes').inspector({ length: -1 });

const mySchema = require('./schema');

const config = {
  database: 'forwardjs'
};

const pool = new pg.Pool(config);

app.get('/', (req, res) => {
  res.send("Hello Express");
})

app.use('/graphql', graphQLHttp({
  schema: mySchema,
  context: { pool },
  graphiql: true
}));

app.listen(3000, () => {
  d('Express is running...');
});
