import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Connections.module.css";

const Connections = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    let graphqlQuery = {
      query: `
        query FetchAllUsers($id: ID!){
          users(id: $id) {
            _id
            name
          }
        }
      `,
      variables: {
        id: localStorage.getItem("userId"),
      },
    };
    fetch("http://localhost:8080/graphql", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "content-type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setUsersList(resData.data.users);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <>
      <div className={styles.profileSection}>
        <span className={styles.profileHeading}>Connections</span>
        {usersList.length > 0 &&
          usersList.map((user, key) => {
            return (
              <div key={user._id}>
                {key + 1}.
                <Link className={styles.userList} to={`/chat/${user._id}`}>
                  {user.name}
                </Link>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Connections;
