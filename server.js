// var { graphql, buildSchema } = require('graphql');

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var rootValue = {
//   hello() {
//     return 'Hello world!';
//   }
// };

// graphql({
//   schema,
//   source: '{ hello }',
//   rootValue
// }).then((response) => {
//   console.log('response', response);
// });

var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');
var { ruruHTML } = require('ruru/server');

const PORT = 4000;

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello() {
    return 'Hello world!';
  }
};

var app = express();

app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root
  })
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.listen(PORT, function () {
  console.log(`Express server running on port: ${PORT}`);
});

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
