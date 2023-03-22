const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
    }

    type UserList {
        _id: ID!
        name: String!
    }

    type ReceiverUserDetails {
        _id: ID!
        name: String!
        email: String!
    }
    
    type AuthData {
        token:String!
        userId:String!
    }
    
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type Message {
        conversationId: ID!,
        sender: User!,
        body: String!
    }
    
    type RootQuery {
        login(email:String!,password:String!): AuthData!
        user: User!
        users(id:ID!): [UserList!]!
        userdetails(id:ID!): ReceiverUserDetails!
        messages(id:ID!): [Message!]
    }
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
        updateStatus(status:String!): User!
        sendMessage(id:ID!,messageBody:String!): Message!
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
