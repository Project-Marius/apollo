import { AuthenticationError, UserInputError } from 'apollo-server-cloudflare'

import isEmail from 'validator/es/lib/isEmail'

const validate = (value, validatorFn, message) => {
  if (!validatorFn(value)) {
    throw new UserInputError('message')
  }
} 

export default {
  Query: {
    session: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      return fauna.getSession(context.token)
    },
    userByEmail: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      validate(args.email, isEmail, email)
      return fauna.userByEmail(args.email)
    }
  },
  Mutation: {
    signup: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { email, password, firstname, lastname } = args
      validate(email, isEmail, 'not an email')
      return fauna.signup(email, password, {
        firstname,
        lastname,
        verified: false,
        leaderships: [],
        affiliations: []
      })
    },
    login: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { email, password } = args
      validate(email, isEmail, 'not an email')
      return  fauna.login(email, password)
    },
    createOrg: (obj, args, context, info) => {
      if (!context.token) throw new AuthenticationError('must be logged in to create org')
      const fauna = context.dataSources.fauna
      const org = {
        ...args.org,
        pending: true,
        setsHeard: [],
        appearances: []
      }
      return fauna.createOrg(org, context.token)
    }
  },
}
