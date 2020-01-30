const { DataSource } = require('apollo-datasource')
const faunadb = require('faunadb'), q = faunadb.query
const uuidv4 = require('uuid/v4')

class FaunaDB extends DataSource {
  constructor() {
    super()
    secrets.get('faunadb-apollo-key	')
      .then(key => {
        this.client = new faunadb.Client({ secret: key, scheme: 'https' })
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  // return inserted object on success, null on failure
  async signup(email, password, ...data) {
    const res = await q.Create(
      q.Collection('users'),
      {
        credentials: { password: password },
        data: {
          email: email,
          ...data
        }
      }
    )
    if ('data' in res) {
      return res.data
    } else {
      return null
    }
  }

  // return AuthPayload on success
  // return null on failure
  async login(email, password, sessionId) {
    // check to see if session token exists
    const token = await tokens.get(sessionId)
    if (session) {
      return {
        sessionId,
        token
      }
    }
    // attempt login
    const res = await q.Login(
      q.Match(
        q.Index('users_by_email'),
        email
      ),
      // set TTL to 7 days
      { password: password, ttl: q.TimeAdd(q.Now(), 7, 'days') }
    )
    // if it has a secret field, it's good
    if ('secret' in res) {
      // create and store the session in workers kv
      const token = res.secret
      const sessionId = uuidv4()
      // set TTL option to make the token autoremove itself after a week
      const SECONDS_PER_WEEK = 604800
      tokens.put(sessionId, token, { expirationTtl: SECONDS_PER_WEEK })
      return {
        sessionId,
        token
      }
    } else {
      return null
    }
  }

  async userByEmail(email) {
    const res = await q.Get(
      q.Match(
        q.Index('users_by_email'),
        email
      )
    )
    // on success, return the user data
    if ('data' in res) {
      return {
        ...res.data
      }
    }
  }
}

module.exports = FaunaDB