module.exports = {
  Query: {
    userByEmail: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      return fauna.userByEmail(args.email)
    }
  },
  Mutation: {
    signup: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { email, password, ...data } = args
      return fauna.signup(email, password, data)
    },
    login: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { email, password, sessionId } = args
      return  fauna.login(email, password, sessionId)
    }
  },
}
