'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = require('graphql');

const person = {
  id: 1,
  first_name: 'Derek',
  last_name: 'Ahn',
  email: 'derek@webmocha.com',
  spouse_id: 8
};

const personType = new GraphQLObjectType({
  name: 'Person',

  fields: {
    id: {
      type: GraphQLID
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    spouse_id: {
      type: GraphQLInt
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    person: {
      type: personType,
      resolve: person
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
});

module.exports = mySchema;
