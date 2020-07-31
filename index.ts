// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as awsx from '@pulumi/awsx'
import { ApolloServer, gql } from 'apollo-server-lambda'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
})

const graphqlHandler = server.createHandler()

const endpoint = new awsx.apigateway.API('apollo', {
  routes: [
    {
      path: '/apollo',
      method: 'GET',
      eventHandler: graphqlHandler as any,
    },
    {
      path: '/apollo',
      method: 'POST',
      eventHandler: graphqlHandler as any,
    },
  ],
})

// Export the public URL for the HTTP service
export const url = endpoint.url
