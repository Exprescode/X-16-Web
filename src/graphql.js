import gql from "graphql-tag";

export const GET_USER = gql`
  query($email: String!, $password: String!, $token: String!) {
    GetUser(email: $email, password: $password, captchaToken: $token)
  }
`;

export const ADD_USER = gql`
  mutation($email: String!, $name: String!, $password: String!, $token: String!) {
    SignUpUser(email: $email, name: $name, password: $password, captchaToken: $token)
  }
`;

export const GET_USERS = gql`
  query($email: String!, $token: String!) {
    GetUsers(email: $email, jwtToken: $token) {
      id
      email
      name
    }
  }
`;

export const GET_INDIVIDUAL_CHATS = gql`
  query($email: String!, $token: String!) {
    GetIndividualChats(email: $email, jwtToken: $token) {
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
  mutation($creator: String!, $receipient: [String]!, $name: String!, $token: String!) {
    CreateChat(creator: $creator, receipient: $receipient, name: $name, jwtToken: $token)
  }
`;

export const SEND_MESSAGE = gql`
  mutation(
    $sender: String!,
    $message: String!,
    $individualChatId: String!,
    $groupChatId: String!,
    $token: String!
  ) {
    SendMessage(
      sender: $sender,
      message: $message,
      individualChatId: $individualChatId,
      groupChatId: $groupChatId,
      jwtToken: $token
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
export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessageMutation($from: String!, $message: String!, $token: String!) {
    sendMessage(from: $from, message: $message, jwtToken: $token) {
      id
      from
      message
    }
  }
`;

export const SEND_CODE_MUTATION = gql`
  mutation SendCodeMutation($email: String!, $code: String!, $token: String!) {
    VerifyCode(email: $email, code: $code, captchaToken: $token) 
  }
`;

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSentSubscription {
    messageSent {
      id
      from
      message
    }
  }
`;

export const CHECK_USER_EXISTS_QUERY = gql`
  query($email: String!, $token: String!) {
    CheckUserExists(email: $email, captchaToken: $token)
  }
`;


export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($email: String!, $password: String!, $code: String!, $token: String!) {
    ResetPassword(email: $email, password: $password, code: $code, captchaToken: $token) 
  }
`;


export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshTokenMutation($email: String!, $token: String!) {
    RefreshToken(email: $email, jwtToken: $token) 
  }
`;


export const UPLOAD_FILE_MUTATION = gql`
    mutation UploadSingleFileMutation($filename: String!, $filesize: Int!, $content: String!, $individualChatId: String!, $groupChatId: String!, $jwtToken: String!) {
      UploadSingleFile(filename: $filename, filesize: $filesize, content: $content, individualChatId: $individualChatId, groupChatId: $groupChatId, jwtToken: $jwtToken) {
        id
        filename
      }
    }

`;
