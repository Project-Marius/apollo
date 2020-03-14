import { ApolloServer } from 'apollo-server-cloudflare'
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo'
import KVCache from '../kv-cache'
import getFaunaSchema from '../subschemas/fauna'

const kvCache = { cache: new KVCache }


const createServer = async graphQLOptions =>
  new ApolloServer({
    schema: await getFaunaSchema(),
    introspection: true,
    ...(graphQLOptions.kvCache ? kvCache : {}),
    context: async ({ request }) => {
      const auth = request.headers.get('Authorization') || null
      return {
        token: (auth !== null) ? auth.substring(7) : null
      }
    }
  })

const handler = async (request, graphQLOptions) => {
  const server = await createServer(graphQLOptions)
  return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)
}

export default handler
