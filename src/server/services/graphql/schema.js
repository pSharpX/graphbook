const typeDefinitions = `
type User {
    id: Int
    avatar: String
    username: String
}

type Post {
    id: Int
    text: String
    user: User
}

type Message {
    id: Int
    text: String
    user: User
    chat: Chat
}

type Chat {
    id: Int
    lastMessage: Message
    messages: [Message]
    users: [User]
}

type RootQuery {
    posts: [Post]
    chats: [Chat]
    chat (chatId: Int): Chat
}

input PostInput {
    text: String!
}

input UserInput {
    avatar: String!
    username: String!
}

input ChatInput {
    users: [Int]
}

input MessageInput {
    text: String!
    chatId: Int!
}

type RootMutation {
    addPost (post: PostInput!): Post
    addChat (chat: ChatInput!): Chat
    addMessage (message: MessageInput!): Message
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

export default [typeDefinitions];
