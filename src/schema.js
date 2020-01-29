const { gql } = require('apollo-server-cloudflare')

// const types = gql`
//   type Query {
//     # searchTournaments(filter: TournamentInput): [Tournament!]!
//     # searchUsers(filter: UserInput): [User!]!
//   }

//   type Mutation {
//     addUser(user: UserInput): User!
//   #   setUserName(user: ID!, name: String!): User!
//   #   setUserEmail(user: ID!, email: String!): User!
//   #   setUserPhone(user: ID!, phoneNumber: String!): User!
//   #   addUserAffiliation(user: ID!, org: ID!): User!
//   #   removeUserAffiliation(user: ID!, org: ID!): User!
//   #   addUserAppearances(user: ID!, players: [ID!]!): User!
//   #   reoveUserAppearances(user: ID!, players: [ID!]!): User!

//   #   addOrg(org: OrgInput!): Org!
//   #   addOrgMember(org: ID!, member: ID!): Org!
//   #   setOrgStatus(org: ID!, status: OrgStatus): Org!
//   #   setMainContact(org: ID!, contact: ID!): Org!
//   #   addSetHeard(org: ID!, Set: ID!): Org!
//   #   addAppearance(org: ID!, appearances: ID!): Org!

//   #   addTournament(tournament: TournamentInput!): Tournament!
//   #   setTournamentInfo(id: ID!, tournamentInfo: TournamentInput!): Tournament!
//   #   addTournamentStaff(tournament: ID!, users: [ID!]!): Tournament!
//   #   setTournamentPaid(tournament: ID!, team: ID!): Tournament!
//   #   setTournamentFieldCap(tournament: ID!, fieldCap: Int!): Tournament!
//   #   setTournamentRuleset(tournament: ID!, hasPowers: Boolean!, hasNegs: Boolean!, hasBB: Boolean!): Tournament!
//   #   setTournamentTiebreaker(tournament: ID!, kind: TiebreakerType!): Tournament!

//   #   addRoom(room: RoomInput!): Room!
//   #   setRoomName(room: ID!, name: String!): Room!
//   #   setRoomMod(room: ID!, mod: ID!): Room!
//   #   setRoomBuzzer(room: ID!, buzzer: ID!): Room!

//   #   addBuzzer(buzzer: BuzzerInput!): Buzzer!
//   #   setBuzzerOwner(buzzer: ID, org: ID!): Buzzer!

//   #   addPhase(phase: PhaseInput): Phase!
//   #   setPhaseName(phase: ID!, name: String!): Phase!


//   #   setDivisionName(division: ID!, name: String!): Division!
//   #   setDivisionPhase(division: ID!, phase: ID!): Division!
//   #   addDivisionTeams(division: ID!, teams: [ID!]!): Division!

//   #   addTeam(team: TeamInput!, tournament: ID!): Team!
//   #   removeTeam(team: ID!): ID!
//   #   addTeamTBCycle(team: ID, bp: Int!): Team!

//   #   addPlayer(players: PlayerInput): Player!
//   #   removePlayer(player: ID!): ID!
//   #   addPlayerTossup(player: ID!, buzz: ID!): Player!
//   #   addPlayerGame(player: ID!, game: ID!): Player!

//   #   generateGames(division: ID!): Game!
//   #   removeGame(game: ID!): ID!
//   #   setGameTeams(game: ID!, team1: ID, team2: ID): Game!
//   #   addGameTBCycle(game: ID!, cycle: TBCycleInput!): Game!

//   #   # file upload how???

//   }

//   # input UserInput {
//   #   name: String!
//   #   email: String!
//   #   phoneNumber: String
//   # }

//   # input OrgInput {
//   #   name: String!
//   #   type: OrgType!
//   #   country: String!
//   #   state: String!
//   #   status: OrgStatus!
//   #   mainContact: ID!
//   # }

//   # input TournamentInput {
//   #   name: String!
//   #   date: String!
//   #   address: String!
//   #   host: ID!
//   #   hasPowers: Boolean!
//   #   hasNegs: Boolean!
//   #   hasBB: Boolean!
//   #   set: ID!
//   #   hardCap: Int!
//   #   softCap: Int!
//   #   tiebreaker: TiebreakerType!
//   # }

//   # input RoomInput {
//   #   name: String!
//   #   location: String!
//   #   buzzer: ID
//   #   tournament: ID
//   # }

//   # input BuzzerInput {
//   #   owner: ID!
//   #   room: ID
//   # }

//   # input PhaseInput {
//   #   name: String!
//   #   nRounds: Int!
//   #   tournament: ID!
//   #   type: PhaseType!
//   # }

//   # input DivisionInput {
//   #   name: String!
//   #   phase: ID!
//   # }

//   # input TeamInput {
//   #   id: ID!
//   #   org: ID!
//   #   name: String!
//   #   tournament: ID!
//   #   division: ID!
//   # }

//   # input PlayerInput {
//   #   name: String!
//   #   user: ID
//   #   team: ID!
//   #   tournament: ID!
//   # }

//   # input GameInput {
//   #   status: GameStatus!
//   #   team1: ID!
//   #   team2: ID!
//   #   team1Score: Int!
//   #   team2Score: Int!
//   #   updatedAt: String!
//   #   division: ID!
//   #   round: Int!
//   #   tuh: Int!
//   # }

//   # input BuzzInput {
//   #   #advancedStats: Boolean!
//   #   result: BuzzResult!
//   #   player: ID!
//   #   tossup: ID!
//   #   #buzzPct: Float
//   # }

//   # input TBCycleInput {
//   #   buzzes: [BuzzInput!]!
//   #   tossup: ID!
//   #   bonus: ID
//   #   bonusPoints: Int
//   # }

//   # input TossupInput {
//   #   advancedStats: Boolean!
//   #   partInPower: String
//   #   partNotPower: String!
//   #   answerline: String!
//   #   packet: ID!
//   #   category: String!
//   #   subcategory: String!
//   # }

//   # input BonusInput {
//   #   advancedStats: Boolean!
//   #   parts: [String!]!
//   #   answerlines: [String!]!
//   #   packet: ID!
//   #   category: String!
//   #   subcategory: String!
//   # }

//   # input PacketInput {
//   #   advancedStats: Boolean!
//   #   name: String!
//   #   tossups: [TossupInput!]!
//   #   bonuses: [BonusInput!]!
//   #   set: ID!
//   # }

//   # input SetInput {
//   #   name: String!
//   #   contact: ID! # userID
//   #   description: String!
//   #   # some way to allow people to set their own pricing for stripe
//   # }

//   # type User {
//   #   id: ID!
//   #   name: String!
//   #   email: String!
//   #   phoneNumber: String
//   #   affiliations: [Org!]!
//   # }

//   # type Org {
//   #   id: ID!
//   #   name: String!
//   #   type: OrgType!
//   #   country: Int!
//   #   state: String!
//   #   status: OrgStatus!
//   #   mainContact: User!
//   #   members: [User!]!
//   #   setsHeard: [Set!]!
//   #   appearances: [Team!]!
//   # }

//   # type Tournament {
//   #   id: ID!
//   #   name: String!
//   #   date: String!
//   #   address: String!
//   #   host: Org!
//   #   powerVal: Int
//   #   negVal: Int
//   #   bbVal: Int
//   #   set: Set!
//   #   fieldCap: Int!
//   #   field: [Team!]!
//   #   standby: [Team!]!
//   #   unpaid: [Team!]!
//   #   staff: [User!]!
//   #   rooms: [Room!]!
//   #   buzzers: [Buzzer!]!
//   #   attendees: [Org!]!
//   #   indivduals: [Player!]!
//   #   phases: [Phase!]!
//   #   status: TournamentStatus!
//   #   tiebreaker: TiebreakerType!
//   # }

//   # type Room {
//   #   id: ID!
//   #   name: String!
//   #   location: String!
//   #   buzzer: Buzzer
//   #   tournament: Tournament
//   #   mod: User!
//   # }

//   # type Buzzer {
//   #   id: ID!
//   #   owner: Org
//   #   room: Room
//   # }

//   # type Phase {
//   #   id: ID!
//   #   name: String!
//   #   nRounds: Int!
//   #   type: PhaseType!
//   #   tournament: Tournament!
//   #   divisions: [Division!]!
//   # }

//   # type Division {
//   #   id: ID!
//   #   name: String!
//   #   phase: Phase!
//   #   teams: [Team!]!
//   #   games: [Game!]!
//   # }

//   # type Team {
//   #   id: ID!
//   #   org: Org!
//   #   players: [Player!]!
//   #   games: [Game!]!
//   #   name: String!
//   #   tournament: Tournament!
//   #   division: Division!
//   #   w: Int!
//   #   l: Int!
//   #   pptuh: Int!
//   #   tuh: Int!
//   #   bh: Int!
//   #   bp: Int!
//   # }

//   # type Player {
//   #   id: ID!
//   #   name: String!
//   #   user: User
//   #   team: Team!
//   #   tournament: Tournament!
//   #   buzzes: [Buzz!]!
//   #   powers: Int
//   #   gets: Int!
//   #   negs: Int
//   #   tuh: Int!
//   #   gp: Float!
//   # }

//   # type Game {
//   #   id: ID!
//   #   status: GameStatus!
//   #   team1: Team!
//   #   team2: Team!
//   #   tbCycles: [TBCycle!]!
//   #   team1Score: Int!
//   #   team2Score: Int!
//   #   updatedAt: String!
//   #   division: Division!
//   #   round: Int!
//   #   tuh: Int!
//   # }

//   # type Buzz {
//   #   id: ID!
//   #   result: BuzzResult!
//   #   player: Player!
//   #   tossup: Tossup!
//   #   buzzPct: Float
//   # }

//   # type TBCycle {
//   #   id: ID!
//   #   buzzes: [Buzz!]!
//   #   tossup: Tossup!
//   #   bonus: Bonus
//   #   bonusPoints: Int
//   # }

//   # type Tossup {
//   #   id: ID!
//   #   partInPower: String
//   #   partNotPower: String!
//   #   answerline: String!
//   #   buzzes: [Buzz!]!
//   #   packet: Packet!
//   #   category: category!
//   # }

//   # type Bonus {
//   #   id: ID!
//   #   parts: [String!]!
//   #   answerlines: [String!]!
//   #   packet: Packet!
//   #   category: category!
//   # }

//   # type Packet {
//   #   id: ID!
//   #   name: String!
//   #   tossups: [Tossup!]!
//   #   bonuses: [Bonus!]!
//   #   set: Set!
//   # }

//   # type Set {
//   #   id: ID!
//   #   name: String!
//   #   advancedStats: Boolean!
//   #   contact: User!
//   #   description: String!
//   #   tournaments: [Tournament!]!
//   #   unpaid: [Tournament!]!
//   #   # some way to allow people to set their own pricing for stripe
//   # }

//   # enum BuzzResult {
//   #   POWER
//   #   GET
//   #   NEG
//   # }

//   # enum GameStatus {
//   #   SCHEDULED
//   #   IN_PROGRESS
//   #   COMPLETED
//   # }

//   # enum TournamentStatus {
//   #   UPCOMING
//   #   IN_PROGRESS
//   #   COMPLETED
//   # }

//   # enum OrgStatus {
//   #   ACTIVE
//   #   INACTIVE
//   #   UNKNOWN
//   # }

//   # enum PhaseType {
//   #   RR
//   #   SE
//   #   DE
//   #   CE
//   # }

//   # enum OrgType {
//   #   MS
//   #   HS
//   #   CC
//   #   CO
//   # }

//   # enum TiebreakerType {
//   #   PPB_PPTU_ALWAYS
//   #   HALF_SE_ALWAYS
//   #   HALF_SE_CIRCLE
//   # }

//   # enum category {
//   #   SCI
//   #   HIST
//   #   LIT
//   #   VFA
//   #   MUSIC
//   #   CE
//   #   GEO
//   #   MYTH
//   #   RELIG
//   #   PHIL
//   #   SS
//   #   TRASH
//   }
//   `

module.exports = gql`
  type PokemonSprites {
    front_default: String!
    front_shiny: String!
    front_female: String!
    front_shiny_female: String!
    back_default: String!
    back_shiny: String!
    back_female: String!
    back_shiny_female: String!
  }

  type Pokemon {
    id: ID!
    name: String!
    height: Int!
    weight: Int!
    sprites: PokemonSprites!
  }

  type Query {
    pokemon(id: ID!): Pokemon
  }
`
