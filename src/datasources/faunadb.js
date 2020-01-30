const { RESTDataSource } = require('apollo-datasource-rest')
const faunadb = require('faunadb'), q = faunadb.query

class FaunaDB extends RESTDataSource {
  constructor() {
    super()
    secrets.get('faunadb-client-key')
      .then(key => {
        this.client = new faunadb.Client({ secret: key, scheme: 'https' })
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  signup(email, password, ...data) {
    return q.Create(
      q.Collection('users'),
      {
        credentials: { password: password },
        data: {
          email: email,
          ...data
        }
      }
    )
  }

  login(email, password) {

  }

}