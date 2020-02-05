module.exports = {
  Query: {
    session: (obj, args, context, info) => {
      const fauna = context.dataSources.fauna
      return fauna.resumeSession(context.token)
    },
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
      const { email, password } = args
      return  fauna.login(email, password)
    }
  },
}
