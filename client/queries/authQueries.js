import gql from "graphql-tag";

export const updateAvatarMuation = gql`
  mutation($image: Upload!) {
    uploadUserAvatar(image: $image) {
      url
      filename
      id
    }
  }
`;

export const deleteAvatarMutation = gql`
  mutation {
    deleteUserAvatar {
      url
      id
      filename
    }
  }
`;

export const loginQuery = gql`
  query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        rank
        email
        confirmed
        name
        surname
        tasks {
          id
          title
          description
          date
          color
        }
        avatar {
          url
        }
        class {
          replacements {
            today
            tomorrow
            dayAfter
            page
          }
          code
          name
          owner {
            id
          }
          plan {
            url
          }
        }
      }
      token
    }
  }
`;

export const authUserQuery = gql`
  query($token: String!) {
    authUser(token: $token) {
      user {
        id
        rank
        email
        confirmed
        name
        surname
        tasks {
          id
          title
          description
          date
          color
        }
        avatar {
          url
        }
        class {
          replacements {
            today
            tomorrow
            dayAfter
            page
          }
          code
          name
          owner {
            id
          }
          plan {
            url
          }
        }
        email
        id
      }
      token
    }
  }
`;

export const registerMutation = gql`
  mutation(
    $name: String!
    $surname: String!
    $email: String!
    $classCode: String!
    $password: String!
  ) {
    createUser(
      name: $name
      surname: $surname
      email: $email
      classCode: $classCode
      password: $password
    ) {
      user {
        id
        rank
        email
        confirmed
        name
        surname
        tasks {
          id
          title
          description
          date
          color
        }
        avatar {
          url
        }
        class {
          replacements {
            today
            tomorrow
            dayAfter
            page
          }
          code
          name
          owner {
            id
          }
          plan {
            url
          }
        }
      }
      token
    }
  }
`;

export const updateUserMutation = gql`
  mutation($name: String!, $surname: String!) {
    updateUser(name: $name, surname: $surname) {
      id
    }
  }
`;

export const resentEmailConfirmMutation = gql`
  mutation($email: String!) {
    resentEmailConfirm(email: $email) {
      msg
    }
  }
`;

export const changePasswordMutation = gql`
  mutation($newPassword: String!, $token: String!) {
    changePassword(newPassword: $newPassword, token: $token) {
      id
    }
  }
`;

export const remindPasswordQuery = gql`
  query($email: String!) {
    remindPassword(email: $email) {
      msg
    }
  }
`;

export const sendChangeEmailInfoQuery = gql`
  query {
    sendChangeEmailInfo {
      msg
    }
  }
`;

export const sendChangeEmailToNewAddressQuery = gql`
  query($firstStepToken: String!, $newEmail: String!) {
    sendChangeEmailToNewAddress(
      firstStepToken: $firstStepToken
      newEmail: $newEmail
    ) {
      msg
    }
  }
`;
