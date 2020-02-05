const { ApolloServer } = require('apollo-server-cloudflare')
const { graphqlCloudflare } = require('apollo-server-cloudflare/dist/cloudflareApollo')

const KVCache = require('../kv-cache')
const FaunaDB = require('../datasources/faunadb')
const resolvers = require('../resolvers')
const typeDefs = require('../schema')

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

module.exports = handler
