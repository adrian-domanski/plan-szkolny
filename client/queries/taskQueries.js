import gql from "graphql-tag";

export const createTaskMutation = gql`
  mutation($title: String!, $description: String!, $date: String!) {
    createTask(title: $title, description: $description, date: $date) {
      id
      title
      description
      date
    }
  }
`;

export const getAllTasksByClassQuery = gql`
  query {
    getTasksByClass {
      id
      title
      description
      date
      color
    }
  }
`;

export const deleteTaskByIdMutation = gql`
  mutation($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
    }
  }
`;

export const getTaskByClassQuery = gql`
  query($taskId: ID!) {
    getTaskByClass(taskId: $taskId) {
      id
      title
      description
      date
    }
  }
`;

export const editTaskMutation = gql`
  mutation(
    $title: String!
    $description: String!
    $date: String!
    $taskId: ID!
  ) {
    editTask(
      title: $title
      description: $description
      date: $date
      taskId: $taskId
    ) {
      title
      description
      date
    }
  }
`;

// User tasks
export const createUserTaskMutation = gql`
  mutation($title: String!, $description: String!, $date: String!) {
    createUserTask(title: $title, description: $description, date: $date) {
      title
      description
      color
    }
  }
`;

export const deleteUserTaskMutation = gql`
  mutation($taskId: ID!) {
    deleteUserTask(taskId: $taskId) {
      title
      description
      color
    }
  }
`;

export const editUserTaskMutation = gql`
  mutation(
    $title: String!
    $description: String!
    $date: String!
    $taskId: ID!
  ) {
    editUserTask(
      title: $title
      description: $description
      date: $date
      taskId: $taskId
    ) {
      title
      description
      color
    }
  }
`;
