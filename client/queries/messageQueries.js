import gql from "graphql-tag";

export const getLastMessagesQuery = gql`
  query {
    getLastMessages {
      id
      author {
        id
        name
        surname
        avatar {
          url
        }
      }
      msg
      date
    }
  }
`;
