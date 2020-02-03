module.exports = {
  Query: {
    userByEmail: (obj, args, context, info) => {
      console.log(context.request)
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
      const { email, password} = args
      return  fauna.login(email, password, sessionId)
    },
    checkToken: async (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      const { token } = args
      return fauna.checkToken(token)
    }
  },
}
