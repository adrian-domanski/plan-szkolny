import React, { useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import {
  getClassMembersQuery,
  makeUserAdminMutation,
  makeUserMemberMutation,
  deleteUserFromClassMutation,
} from "../../../queries/classQueries";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Alert from "../../../components/app/alert";
import { AuthContext } from "../../../context/authContext";

const Members = () => {
  const { data: classMembersData, loading: classMembersLoading } = useQuery(
    getClassMembersQuery
  );

  const {
    authContext: { user },
  } = useContext(AuthContext);

  const [makeAdmin] = useMutation(makeUserAdminMutation);
  const [makeMember] = useMutation(makeUserMemberMutation);
  const [deleteUser] = useMutation(deleteUserFromClassMutation);
  const [errorAlert, setErrorAlert] = useState("");

  const handleMakeUserAdmin = async (userId) => {
    if (user.rank !== "owner") {
      return setErrorAlert({
        type: "danger",
        msg: "Tylko założyciel może tego dokonać",
      });
    }

    try {
      await makeAdmin({
        variables: { userId },
        refetchQueries: [{ query: getClassMembersQuery }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleMakeUserMember = async (userId) => {
    if (user.rank !== "owner") {
      return setErrorAlert({
        type: "danger",
        msg: "Tylko założyciel może tego dokonać",
      });
    }

    try {
      await makeMember({
        variables: { userId },
        refetchQueries: [{ query: getClassMembersQuery }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (user.rank !== "owner") {
      return setErrorAlert({
        type: "danger",
        msg: "Tylko założyciel może tego dokonać",
      });
    }

    try {
      const res = await deleteUser({
        variables: { userId },
        refetchQueries: [{ query: getClassMembersQuery }],
      });

      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <div className="cms-members container">
        <h1 className="global-section-title">Pozostali członkowie</h1>
        <p className="global-section-subtitle mb-1">
          <b>
            Liczba:{" "}
            {classMembersLoading ? 0 : classMembersData.getClassMembers.length}
          </b>
        </p>
        <Alert
          alert={errorAlert}
          clearAlert={() => setErrorAlert("")}
          className="mb-1"
        />
        <ul className="members-list">
          {classMembersLoading ? (
            <div className="loader">Wczytywanie...</div>
          ) : classMembersData.getClassMembers.length ? (
            classMembersData.getClassMembers.map((member) => (
              <li
                key={member.id}
                className={`members-list__item member--${member.rank}`}>
                {`${member.name} ${member.surname} - ${
                  member.rank === "member" ? "Członek" : "Admin"
                }`}
                <div className="members-actions">
                  {member.rank === "member" ? (
                    <button
                      className="btn btn--submit members-list__item-action"
                      onClick={() => handleMakeUserAdmin(member.id)}>
                      <i className="fas fa-user" aria-hidden="true"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn--abort members-list__item-action"
                      onClick={() => handleMakeUserMember(member.id)}>
                      <i className="fas fa-crown" aria-hidden="true"></i>
                    </button>
                  )}
                  {user.rank === "owner" ? (
                    <button
                      className="btn btn--abort members-list__item-action"
                      onClick={() => handleDeleteUser(member.id)}>
                      <i className="fas fa-user-minus" aria-hidden="true"></i>
                    </button>
                  ) : null}
                </div>
              </li>
            ))
          ) : (
            <h1 className="global-section-title">Brak członków</h1>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default Members;
