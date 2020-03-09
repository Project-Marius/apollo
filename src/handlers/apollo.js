import { ApolloServer } from 'apollo-server-cloudflare'
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo'

import KVCache from '../kv-cache'
import FaunaDB from '../datasources/faunadb'
import resolvers from '../resolvers'
import typeDefs from '../schema'

const kvCache = { cache: new KVCache }

const dataSources = () => ({
  fauna: new FaunaDB(),
})

const createServer = graphQLOptions =>
  new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    dataSources,
    ...(graphQLOptions.kvCache ? kvCache : {}),
    context: async ({ request }) => {
      const auth = request.headers.get('Authorization') || null
      return {
        token: (auth !== null) ? auth.substring(7) : null
      }
    }
  })

const handler = (request, graphQLOptions) => {
  const server = createServer(graphQLOptions)
  return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)
}

export default handler
