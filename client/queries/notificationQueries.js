import gql from "graphql-tag";

export const createNotificationMutation = gql`
  mutation(
    $title: String!
    $description: String!
    $date: String!
    $importance: String!
  ) {
    createNotification(
      title: $title
      description: $description
      date: $date
      importance: $importance
    ) {
      id
      title
      description
      date
      importance
    }
  }
`;

export const getAllNotificationsByClassQuery = gql`
  query {
    getNotificationsByClass {
      id
      title
      description
      date
      importance
    }
  }
`;

export const getNotificationByClassQuery = gql`
  query($notificationId: ID!) {
    getNotificationByClass(notificationId: $notificationId) {
      id
      title
      description
      date
      importance
    }
  }
`;

export const deleteNotificationByIdMutation = gql`
  mutation($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      id
      title
    }
  }
`;

export const editNotificationMutation = gql`
  mutation(
    $title: String!
    $description: String!
    $date: String!
    $notificationId: ID!
    $importance: String!
  ) {
    editNotification(
      title: $title
      description: $description
      date: $date
      notificationId: $notificationId
      importance: $importance
    ) {
      title
      description
      date
    }
  }
`;
