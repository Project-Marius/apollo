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
    if ('data' in res) {
      return res.data
    } else {
      throw new Error(`could not create new user: ${JSON.stringify(res)}`)
    }
  }

  // return AuthPayload on success
  // return null on failure
  async login(email, password) {
    // attempt login
    if (!client) await this.initClient()
    const res = await client.query(
      q.Login(
        q.Match(
          q.Index('users_by_email'),
          email
        ),
        // set TTL to 7 days
        { password: password, ttl: q.TimeAdd(q.Now(), 7, 'days') }
      )
    )
    // if it has a secret field, it's good
    if ('secret' in res) {
      const token = res.secret
      return {
        token
      }
    } else {
      throw new Error(`could not get token: ${JSON.stringify(res)}`)
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