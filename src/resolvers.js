module.exports = {
  Query: {
    session: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      return fauna.getSession(context.token)
    },
    userByEmail: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      return fauna.userByEmail(args.email)
    }
  },
  Mutation: {
    signup: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { email, password, firstname, lastname } = args
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
      return  fauna.login(email, password)
    },
    createOrg: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const org = {
        ...args.org,
        pending: true,
        setsHeard: [],
        appearances: []
      }
    }
  },
}
