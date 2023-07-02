const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

//  typeDefs and resolvers 
const { typeDefs, resolvers } = require('./Schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Create new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => req
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});