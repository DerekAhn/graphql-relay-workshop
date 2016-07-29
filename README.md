# graphql-relay-workshop

Forward.js summit's workshop with Samer Buna.

## GraphQL

[GraphQL playground](https://www.graphqlhub.com/playground)

[Code Along Reference](https://github.com/reactjscamp/learn-graphql)


> [Fully built app built in react, relay, graphql, express, mongoDB](https://github.com/RGRjs/rgrjs.com http://rgrjs.com/).


Query - GraphQL (subset of JSON if you will)

```
{
  github {
    user(username: "samerbuna") {
      id
      company
      avatar_url
    }
  }
}
```

Response - JSON
```
{
  "data": {
    "github": {
      "user": {
        "id": 75209,
        "company": "AgileLabs",
        "avatar_url": "https://avatars.githubusercontent.com/u/75209?v=3"
      }
    }
  }
}
```

- No shape of query, you'll know the response structure; inverse is true, know response - know query (mental model); 1:1 relationship

- GraphQL is introspective API, which means you can ask the server about it's fields. (types, names)

- GraphQL is statically typed language

- Commas are optional!


3 table requests in a typical api request but a single request in graphQL
- user, repo, commits (tables)
```
{
  github {
    user(username: "samerbuna") {
      id
      company
      avatar_url
    }
    repo(name: "graphql", ownerUsername: "facebook") {
      name
      commits{
        message
      }
    }
  }
}
```

- sampo https://github.com/graphql/swapi-graphql

- query operation is default; can name operation too.
```
query TestGitHub {
  github {
    user(username: "samerbuna") {
      id
      company
      avatar_url
      repos {
        name
        commits(limit: 3) {
          message
        }
      }
    }
  }
```

- mutation is CUD of CRUD operation: create, update, delete.
- subscription is for realtime applications.
- fragments (most exciting for react devs, cause compositional) partial queries/reusable queries.
    - Give every react component a fragment to explain data requirements, data responsibility 1:1
    - Relay's responsibility to handle these fragmented operations

function like
```
query TestGitHub($username: String!) {

  github {
    user(username: $username) {
      id
      company
      avatar_url
      repos {
        name
        commits(limit: 3) {
          message
        }
      }
    }
  }
}

# query var
# { "username": "dhh" }
```



Bad due to duplication, not DRY
```
query TestGitHub($username: String!) {
  github {
    user(username: $username) {
      id
      company
      avatar_url
      repos {
        name
        commits(limit: 3) {
          message
        }
      }
    }
    repo(name: "graphql", ownerUsername: "facebook") {
      name
      commits(limit: 3) {
        message
      }
    }
  }
}
```

- Types is GraphQL runtime, types on fields.

Better, using fragments
```
query TestGitHub($username: String!) {
  github {
    user(username: $username) {
      id
      company
      avatar_url
      repos {
        ...RepoInfo
      }
    }
    repo(name: "graphql", ownerUsername: "facebook") {
      ...RepoInfo
    }
  }
}

fragment RepoInfo on GithubRepo {
  name
  commits {
    message
  }
}

```

- Fragments can have arguments/variables.
- Fragments can include fragments (composition).

Aliases company to company_name
```
query TestGitHub($username: String!) {
  github {
    user(username: $username) {
      id
      company_name: company
      avatar_url
      repos {
        ...RepoInfo
      }
    }
    repo(name: "graphql", ownerUsername: "facebook") {
      ...RepoInfo
    }
  }
}
```


```
query TestGitHub($username: String!, $showAv: Boolean) {
  github {
    user(username: $username) {
      id
      company_name: company
      avatar_url @include(if: $showAv) // directive, that is external
      repos {
        ...RepoInfo
      }
    }
    repo(name: "graphql", ownerUsername: "facebook") {
      ...RepoInfo
    }
  }
}
```

- Relay does a diff comparison with a graphQL query.

- Need a schema is a starting point for graphQL.

- { graphql } is the executor and the golden part. (understand promises too), (will also run parallel)
    * 70% of what makes GraphQL server cool but super hard.


Simple graphQL
```
'use strict';

const {
  graphql
} = require('graphql');

const MySchema = require('./schema');

const query = process.argv[2];


// exec mySchema query => promise
graphql(mySchema, query)
.then(result => console.log(result))
.catch(error => console.log(error));
```

- [Cool psql client](https://eggerapps.at/postico/)

- 4th arg is execution info is known as "info".

BATCH your queries until you recieve all queries
- use dataloader.js

## Relay

> Relay is like a virtualdom for your data! (???)

- node interface represents mutiple types (have to use inline fragments)

> Relay uses inline fragments

-
