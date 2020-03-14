import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloError } from 'apollo-server-cloudflare'
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

const getFaunaToken = async (): Promise<string> => {
  const res: string | null = await secrets.get('FAUNADB_KEY')
  // will throw an error if it can't connect to fauna
  if (!res) {
    throw new ApolloError('cannot get fauna key')
  }
  return res
}

const getFaunaSchema = async (): Promise<GraphQLSchema> => {
  // initiate a link to fauna graphql endpoint
  const http = new HttpLink({ uri: 'https://graphql.fauna.com/graphql', fetch })
  // wrap that link in one that adds the auth header
  const link = setContext(async (request, previousContext) => {
    // if the previous context has one, use its token
    if (previousContext && previousContext.graphqlContext && previousContext.token) {
      return {
        headers: {
          Authorization: `Bearer ${previousContext.graphqlContext.token}`
        }
      }
    }
    const faunaToken: string = await getFaunaToken()
    return {
        headers: {
          Authorization: `Bearer ${faunaToken}`
      }
    }
  }).concat(http)
  const schema = await introspectSchema(link)
  return makeRemoteExecutableSchema({
    schema,
    link,
  });
}

export default getFaunaSchema