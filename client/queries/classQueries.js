import gql from "graphql-tag";

// Create class
export const createClassMutation = gql`
  mutation($name: String!) {
    createClass(name: $name) {
      code
      name
      owner {
        id
      }
    }
  }
`;

// Delete class
export const deleteClassMutation = gql`
  mutation {
    deleteClass {
      code
    }
  }
`;

// Add user to class
export const addUserToClassMutation = gql`
  mutation($code: ID!, $className: String!) {
    addUserToClass(code: $code, className: $className) {
      code
      name
      owner {
        id
      }
    }
  }
`;

// Delete user from class
export const leaveClassMutation = gql`
  mutation {
    leaveClass {
      id
    }
  }
`;

// Upload lesson plan
export const uploadClassPlanMutation = gql`
  mutation($image: Upload!) {
    uploadPlan(image: $image) {
      id
      filename
      url
    }
  }
`;

// Delete lesson plan
export const deleteClassPlanMutation = gql`
  mutation {
    deletePlan {
      url
      id
      filename
    }
  }
`;

// Update replacements
export const updateReplacementsMutation = gql`
  mutation(
    $today: String!
    $tomorrow: String!
    $dayAfter: String!
    $page: String!
  ) {
    updateReplacements(
      today: $today
      tomorrow: $tomorrow
      dayAfter: $dayAfter
      page: $page
    ) {
      replacements {
        today
        tomorrow
        dayAfter
        page
      }
    }
  }
`;

// Get class members
export const getClassMembersQuery = gql`
  query {
    getClassMembers {
      id
      name
      surname
      rank
    }
  }
`;

// Make user admin
export const makeUserAdminMutation = gql`
  mutation($userId: ID!) {
    makeUserAdmin(userId: $userId) {
      id
    }
  }
`;

// Make user member
export const makeUserMemberMutation = gql`
  mutation($userId: ID!) {
    makeUserMember(userId: $userId) {
      id
    }
  }
`;

// Delete user from class
export const deleteUserFromClassMutation = gql`
  mutation($userId: ID!) {
    deleteUserFromClass(userId: $userId) {
      id
    }
  }
`;

// Change class name
export const changeClassNameMutation = gql`
  mutation($newClassName: String!) {
    changeClassName(newClassName: $newClassName) {
      id
    }
  }
`;

// Generate new class code
export const generateNewClassCodeMutation = gql`
  mutation {
    generateNewClassCode {
      id
    }
  }
`;
