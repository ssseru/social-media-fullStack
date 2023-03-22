import { useEffect, useState } from "react";
import { Input, Button } from "reactstrap";
import styles from "./Profile.module.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    status: "",
    name: "",
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    let graphqlQuery = {
      query: `
              {
                user {
                  status
                  name
                }
              }
            `,
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
        console.log(resData);
        if (resData.errors) {
          throw new Error("Fetching status failed!");
        }
        setUserDetails((prev) => {
          return {
            ...prev,
            status: resData.data.user.status,
            name: resData.data.user.name,
          };
        });
      })
      .catch((e) => console.log(e));
  }, []);

  const handleUpdateStatus = () => {
    let graphqlQuery = {
      query: `
         mutation UpdateUserStatus($userStatus: String!) {
            updateStatus(status: $userStatus) {
              status
            }
         }
        `,
      variables: {
        userStatus: userDetails.status,
      },
    };
    fetch("http://localhost:8080/graphql", {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Fetching posts failed!");
        }
        console.log(resData);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={styles.profileSection}>
      <span className={styles.profileHeading}>Profile</span>
      <p>
        Name: <span className={styles.profileName}>{userDetails.name}</span>
      </p>
      <div className={styles.messageInput}>
        <Input
          className={styles.formInput}
          value={userDetails.status}
          onChange={(e) => {
            setUserDetails((prev) => {
              return {
                ...prev,
                status: e.target.value,
              };
            });
          }}
        />
        <Button onClick={handleUpdateStatus} className={styles.profileBtn}>
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default Profile;
