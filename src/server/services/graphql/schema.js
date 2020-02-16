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
    messages: [Message]
    users: [User]
}

type RootQuery {
    posts: [Post]
    chats: [Chat]
}

input PostInput {
    text: String!
}

input UserInput {
    avatar: String!
    username: String!
}

type RootMutation {
    addPost (
        post: PostInput!
    ): Post
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

export default [typeDefinitions];
