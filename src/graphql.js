import gql from "graphql-tag";

export const GET_USER = gql`
  query($email: String!, $password: String!) {
    GetUser(email: $email, password: $password)
  }
`;

export const ADD_USER = gql`
  mutation($email: String!, $name: String!, $password: String!) {
    SignUpUser(email: $email, name: $name, password: $password)
  }
`;

export const GET_USERS = gql`
  query($email: String!) {
    GetUsers(email: $email) {
      id
      email
      name
    }
  }
`;

export const GET_INDIVIDUAL_CHATS = gql`
  query($email: String!) {
    GetIndividualChats(email: $email) {
      id
      members {
        id
        email
        name
      }
      messages {
        id
        sender {
          id
          email
          name
        }
        datetime
        message
      }
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation($creator: String!, $receipient: [String]!, $name: String!) {
    CreateChat(creator: $creator, receipient: $receipient, name: $name)
  }
`;

export const SEND_MESSAGE = gql`
  mutation(
    $sender: String!
    $message: String!
    $individualChatId: String!
    $groupChatId: String!
  ) {
    SendMessage(
      sender: $sender
      message: $message
      individualChatId: $individualChatId
      groupChatId: $groupChatId
    )
  }
`;

export const INDIVIDUAL_CHAT_SUB = gql`
  subscription($email: String!) {
    IndividualChatCreated(email: $email) {
      id
      members {
        id
        email
        name
      }
      messages {
        id
        sender {
          id
          email
          name
        }
        datetime
        message
      }
    }
  }
`;
