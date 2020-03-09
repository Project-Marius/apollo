import { DataSource } from 'apollo-datasource'
import { ApolloError, toApolloError } from 'apollo-server-cloudflare'
const faunadb = require('faunadb'), q = faunadb.query

class FaunaDB extends DataSource {
  constructor() {
    super()
    this.client = null
  }

  initialize({ context }) {
    this.context = context
  }

  // ##### AUTH #####

  async initClient() {
    const key = await secrets.get('faunadb-apollo-key')
    this.client = new faunadb.Client({
      secret: key,
      scheme: 'https',
      fetch: fetch.bind(globalThis)
    })
  }

  // return inserted object on success, null on failure
  async signup(email, password, data) {
    if (!this.client) await this.initClient()
    try {
      const res = await this.client.query(
        q.Create(
          q.Collection('users'),
          {
            credentials: { password: password },
            data: {
              email: email,
              ...data
            }
          }
        )
      )
    } catch (error) {
      // handle case where account already exists
      if (error.code === 'instance not unique') {
        throw new ApolloError('account already exists')
      } else {
        throw new toApolloError(error, 'INTERNAL_SERVER_ERROR')
      }
    }
    // on success, auto-login
    return this.login(email, password)
  }

  async getSession(token) {
    // no token, no session
    if (token === null || token === undefined) {
      return null
    }
    // // try to get it from the cache
    // const user = await userTokens.get(token)
    // if (user) {
    //   return {
    //     token,
    //     user
    //   }
    // }
    // otherwise, go to the database
    if (!this.client) await this.initClient()
    // TODO: document this function somewhere and link here
    const res = await this.client.query(q.Call(q.Function('checkToken')), { secret: token })
    if (res.data !== undefined && res.data !== null) {
      // await userTokens.put(token, JSON.stringify(res.data), { expirationTtl: 3600})
      return {
        token: token,
        user: res.data
      }
    } else {
      return null
    }
  }

  // return AuthPayload on success
  // return null on failure
  async login(email, password) {
    // attempt login
    if (!this.client) await this.initClient()
    // TODO: document this function somewhere and link here
    const res = await this.client.query(q.Call(q.Function('login'), email, password))
    // if it has a secret field, it's good
    if (res.token !== undefined && res.token !== null) {
      // put it into the cache with 1 hour TTL
      // await userTokens.put(res.token, JSON.stringify(res.user), {expirationTtl: 3600 })
      return {
        token: res.token,
        user: res.user
      }
    } else {
      // add more granularity perhaps eventually
      return null
    }
  }

  async userByEmail(email) {
    // check to see if the user is in kv cache
    // const user = await users.get(email, 'json')
    // if (user) return user
    // otherwise go back to the database :(
    if (!this.client) await this.initClient()
    const res = await this.client.query(
      q.Get(
        q.Match(
          q.Index('users_by_email'),
          email
        )
      )
    )
    // on success, return the user data
    if ('data' in res) {
      // put into kv cache
      await users.put(email, JSON.stringify(res.data), { expirationTtl: 6000 })
      return {
        ...res.data
      }
    } else {
      return null
    }
  }

  // ##### ORGS #####

  async createOrg(org, token) {
    if (!this.client) await this.initClient()
    try {
      const res = await this.client.query(
        q.Let(
          {
            ref: q.Identity()
          },
          q.Create(
            q.Collection('orgs'),
            q.Merge(q.Merge({ mainContact: q.Var('ref') }, { members: [ q.Var('ref') ]}), org)
          )
        ), { secret: token }
      )
    } catch (err) {
      // handle case where org already exists
      if (err.code === 'instance not unique') {
        throw new ApolloError('org already exists!')
      }
      throw new toApolloError(err)
    }
    if (res.data !== undefined && res.data !== null) {
      return res
    } else {
      throw new ApolloError('could not create org')
    }
  }
}

export default FaunaDB