// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pulumi from '@pulumi/pulumi'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import { ApolloServer, gql } from 'apollo-server-lambda'
import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  Context as LambdaContext,
} from 'aws-lambda'

function apolloHandler(
  event: APIGatewayProxyEvent,
  context: LambdaContext,
  callback: APIGatewayProxyCallback) {
  const typeDefs = gql`
  type Query {
    hello: String
  }
`
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

  const graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  })

  graphqlHandler(event, context, callback)
}


const endpoint = new awsx.apigateway.API('apollo', {
  routes: [
    {
      path: '/apollo',
      method: 'ANY',
      eventHandler: apolloHandler as any,
    },
  ],
})

export const url = endpoint.url
