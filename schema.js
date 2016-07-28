'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = require('graphql');

let counter  = 42;

let counterObj = {
  id: 55,
  value: 42
};

let counters = [42, 43];

let counterCollection = [{
  id: 550,
  value: 42
}, {
  id: 551,
  value: 43
}];

const counterObjType = new GraphQLObjectType({
  name: 'CounterObj',

  fields: {
    id: {
      type: GraphQLID
    },
    value: {
      type: GraphQLInt
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "World"
    },
    counter: {
      type: GraphQLInt,
      resolve: () => ++counter
    },
    counterObj: {
      type: counterObjType,
      resolve: () => counterObj
    },
    counterCollection: {
      type: new GraphQLList(counterObjType),
      resolve: () => counterCollection
    },
    counters: {
      type: new GraphQLList(GraphQLInt),
      resolve: () => counters
    }

  }
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',

  fields: {
    incrementCounter: {
      type: GraphQLInt,
      resolve: () => ++counter
    }
  }
})

const mySchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports = mySchema;
