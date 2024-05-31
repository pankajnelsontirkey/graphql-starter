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

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = {
//   hello() {
//     return 'Hello world!';
//   }
// };

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

var root = {
  quoteOfTheDay() {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random() {
    return Math.random();
  },
  rollThreeDice() {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
  },
  rollDice({ numDice, numSides }) {
    var output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides | 6)));
    }
    return output;
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
