const { gql } = require('apollo-server-cloudflare')

const typeDefs = gql`
  type Query {
    session(token: String!): AuthPayload
    userByEmail(email: String!): User
  }

  type Mutation {
    signup(email: String!, password: String!, firstname: String!, lastname: String!): AuthPayload
    # if sessionID is non-null, it just resumes the session
    login(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    firstname: String!
    lastname: String!
    email: String!
    phoneNumber: String
    # affiliations: [Org!]!
  }

  # input OrgInput {
  #   name: String!
  #   type: OrgType!
  #   country: String!
  #   state: String!
  #   status: OrgStatus!
  #   mainContact: ID!
  # }

  # type Org {
  #   id: ID!
  #   name: String!
  #   type: OrgType!
  #   country: Int!
  #   state: String!
  #   status: OrgStatus!
  #   mainContact: User!
  #   members: [User!]!
  #   setsHeard: [Set!]!
  #   appearances: [Team!]!
  # }

  # input TournamentInput {
  #   name: String!
  #   date: String!
  #   address: String!
  #   host: ID!
  #   hasPowers: Boolean!
  #   hasNegs: Boolean!
  #   hasBB: Boolean!
  #   set: ID!
  #   hardCap: Int!
  #   softCap: Int!
  #   tiebreaker: TiebreakerType!
  # }

  # input RoomInput {
  #   name: String!
  #   location: String!
  #   buzzer: ID
  #   tournament: ID
  # }

  # input BuzzerInput {
  #   owner: ID!
  #   room: ID
  # }

  # input PhaseInput {
  #   name: String!
  #   nRounds: Int!
  #   tournament: ID!
  #   type: PhaseType!
  # }

  # input DivisionInput {
  #   name: String!
  #   phase: ID!
  # }

  # input TeamInput {
  #   id: ID!
  #   org: ID!
  #   name: String!
  #   tournament: ID!
  #   division: ID!
  # }

  # input PlayerInput {
  #   name: String!
  #   user: ID
  #   team: ID!
  #   tournament: ID!
  # }

  # input GameInput {
  #   status: GameStatus!
  #   team1: ID!
  #   team2: ID!
  #   team1Score: Int!
  #   team2Score: Int!
  #   updatedAt: String!
  #   division: ID!
  #   round: Int!
  #   tuh: Int!
  # }

  # input BuzzInput {
  #   #advancedStats: Boolean!
  #   result: BuzzResult!
  #   player: ID!
  #   tossup: ID!
  #   #buzzPct: Float
  # }

  # input TBCycleInput {
  #   buzzes: [BuzzInput!]!
  #   tossup: ID!
  #   bonus: ID
  #   bonusPoints: Int
  # }

  # input TossupInput {
  #   advancedStats: Boolean!
  #   partInPower: String
  #   partNotPower: String!
  #   answerline: String!
  #   packet: ID!
  #   category: String!
  #   subcategory: String!
  # }

  # input BonusInput {
  #   advancedStats: Boolean!
  #   parts: [String!]!
  #   answerlines: [String!]!
  #   packet: ID!
  #   category: String!
  #   subcategory: String!
  # }

  # input PacketInput {
  #   advancedStats: Boolean!
  #   name: String!
  #   tossups: [TossupInput!]!
  #   bonuses: [BonusInput!]!
  #   set: ID!
  # }

  # input SetInput {
  #   name: String!
  #   contact: ID! # userID
  #   description: String!
  #   # some way to allow people to set their own pricing for stripe
  # }

  # type Tournament {
  #   id: ID!
  #   name: String!
  #   date: String!
  #   address: String!
  #   host: Org!
  #   powerVal: Int
  #   negVal: Int
  #   bbVal: Int
  #   set: Set!
  #   fieldCap: Int!
  #   field: [Team!]!
  #   standby: [Team!]!
  #   unpaid: [Team!]!
  #   staff: [User!]!
  #   rooms: [Room!]!
  #   buzzers: [Buzzer!]!
  #   attendees: [Org!]!
  #   indivduals: [Player!]!
  #   phases: [Phase!]!
  #   status: TournamentStatus!
  #   tiebreaker: TiebreakerType!
  # }

  # type Room {
  #   id: ID!
  #   name: String!
  #   location: String!
  #   buzzer: Buzzer
  #   tournament: Tournament
  #   mod: User!
  # }

  # type Buzzer {
  #   id: ID!
  #   owner: Org
  #   room: Room
  # }

  # type Phase {
  #   id: ID!
  #   name: String!
  #   nRounds: Int!
  #   type: PhaseType!
  #   tournament: Tournament!
  #   divisions: [Division!]!
  # }

  # type Division {
  #   id: ID!
  #   name: String!
  #   phase: Phase!
  #   teams: [Team!]!
  #   games: [Game!]!
  # }

  # type Team {
  #   id: ID!
  #   org: Org!
  #   players: [Player!]!
  #   games: [Game!]!
  #   name: String!
  #   tournament: Tournament!
  #   division: Division!
  #   w: Int!
  #   l: Int!
  #   pptuh: Int!
  #   tuh: Int!
  #   bh: Int!
  #   bp: Int!
  # }

  # type Player {
  #   id: ID!
  #   name: String!
  #   user: User
  #   team: Team!
  #   tournament: Tournament!
  #   buzzes: [Buzz!]!
  #   powers: Int
  #   gets: Int!
  #   negs: Int
  #   tuh: Int!
  #   gp: Float!
  # }

  # type Game {
  #   id: ID!
  #   status: GameStatus!
  #   team1: Team!
  #   team2: Team!
  #   tbCycles: [TBCycle!]!
  #   team1Score: Int!
  #   team2Score: Int!
  #   updatedAt: String!
  #   division: Division!
  #   round: Int!
  #   tuh: Int!
  # }

  # type Buzz {
  #   id: ID!
  #   result: BuzzResult!
  #   player: Player!
  #   tossup: Tossup!
  #   buzzPct: Float
  # }

  # type TBCycle {
  #   id: ID!
  #   buzzes: [Buzz!]!
  #   tossup: Tossup!
  #   bonus: Bonus
  #   bonusPoints: Int
  # }

  # type Tossup {
  #   id: ID!
  #   partInPower: String
  #   partNotPower: String!
  #   answerline: String!
  #   buzzes: [Buzz!]!
  #   packet: Packet!
  #   category: category!
  # }

  # type Bonus {
  #   id: ID!
  #   parts: [String!]!
  #   answerlines: [String!]!
  #   packet: Packet!
  #   category: category!
  # }

  # type Packet {
  #   id: ID!
  #   name: String!
  #   tossups: [Tossup!]!
  #   bonuses: [Bonus!]!
  #   set: Set!
  # }

  # type Set {
  #   id: ID!
  #   name: String!
  #   advancedStats: Boolean!
  #   contact: User!
  #   description: String!
  #   tournaments: [Tournament!]!
  #   unpaid: [Tournament!]!
  #   # some way to allow people to set their own pricing for stripe
  # }

  # enum BuzzResult {
  #   POWER
  #   GET
  #   NEG
  # }

  # enum GameStatus {
  #   SCHEDULED
  #   IN_PROGRESS
  #   COMPLETED
  # }

  # enum TournamentStatus {
  #   UPCOMING
  #   IN_PROGRESS
  #   COMPLETED
  # }

  # enum OrgStatus {
  #   ACTIVE
  #   INACTIVE
  #   UNKNOWN
  # }

  # enum PhaseType {
  #   RR
  #   SE
  #   DE
  #   CE
  # }

  # enum OrgType {
  #   MS
  #   HS
  #   CC
  #   CO
  # }

  # enum TiebreakerType {
  #   PPB_PPTU_ALWAYS
  #   HALF_SE_ALWAYS
  #   HALF_SE_CIRCLE
  # }

  # enum category {
  #   SCI
  #   HIST
  #   LIT
  #   VFA
  #   MUSIC
  #   CE
  #   GEO
  #   MYTH
  #   RELIG
  #   PHIL
  #   SS
  #   TRASH
  # }
  `

module.exports = typeDefs
