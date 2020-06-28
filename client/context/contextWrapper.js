import { useQuery } from "@apollo/react-hooks";
import { authUserQuery } from "../queries/authQueries";
import AuthContextProvider from "./authContext";
import { withRouter } from "next/router";
import InitialContextUse from "./InitialContextUse";

function ContextWrapper({ children, token }) {
  const { data: authData, loading: authLoading, error: authError } = useQuery(
    authUserQuery,
    {
      skip: !token,
      variables: { token },
    }
  );

  let ssrValues = {};

  if (!authLoading && !authError && authData && authData.authUser) {
    // FY Edge
    ssrValues = { ...authData.authUser, isAuth: true };
    // ssrValues = authData.authUser;
    // ssrValues.isAuth = true;
  }

  return (
    <AuthContextProvider ssrValues={ssrValues}>
      <InitialContextUse authError={authError}>{children}</InitialContextUse>
    </AuthContextProvider>
  );
}

export default withRouter(ContextWrapper);
