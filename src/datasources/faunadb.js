const { DataSource } = require('apollo-datasource')
const faunadb = require('faunadb'), q = faunadb.query

let client = null

class FaunaDB extends DataSource {
  constructor() {
    super()
  }

  initialize({ context }) {
    this.context = context
  }

  async initClient() {
    const key = await secrets.get('faunadb-apollo-key')
    client = new faunadb.Client({
      secret: key,
      scheme: 'https',
      fetch: fetch.bind(globalThis)
    })
  }

  // return inserted object on success, null on failure
  async signup(email, password, data) {
    if (!client) await this.initClient()
    const res = await client.query(
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
    // on success, auto-login
    if (res.data !== undefined && res.data !== null) {
      return this.login(email, password)
    } else {
      // add more granularity perhaps eventually
      return null
    }
  }

  async resumeSession(token) {
    // try to get it from the cache
    const user = await userTokens.get(token)
    if (user) {
      return {
        token,
        user
      }
    }
    // otherwise, go to the database
    if (!client) await this.initClient()
    // TODO: document this function somewhere and link here
    const res = await client.query(q.Call(q.Function('checkToken')), { secret: token })
    if (res.data !== undefined && res.data !== null) {
      await userTokens.put(token, JSON.stringify(res.user))
      return {
        token: res.token,
        user: res.user
      }
    } else {
      return null
    }
  }

  // return AuthPayload on success
  // return null on failure
  async login(email, password) {
    // attempt login
    if (!client) await this.initClient()
    // TODO: document this function somewhere and link here
    const res = await client.query(q.Call(q.Function('login'), email, password))
    // if it has a secret field, it's good
    if (res.token !== undefined && res.token !== null) {
      // put it into the cache with 7 day TTL
      await userTokens.put(res.token, JSON.stringify(res.user), {expirationTtl: 604800 })
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
    const user = await users.get(email, 'json')
    if (user) return user
    // otherwise go back to the database :(
    if (!client) await this.initClient()
    const res = await client.query(
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
}

module.exports = FaunaDB