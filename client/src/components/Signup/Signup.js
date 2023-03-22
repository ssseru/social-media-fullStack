import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import styles from "./Signup.module.css";

const Signup = () => {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const graphqlQuery = {
      query: `
        mutation CreateNewUser($email: String!, $name: String!, $password: String!){
          createUser(userInput: {email: $email, name: $name, password: $password}) {
            _id
            email
          }
        }
        `,
      variables: {
        email: inputData.email,
        name: inputData.name,
        password: inputData.password,
      },
    };
    fetch("http://localhost:8080/graphql", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (resData.errors && resData.error[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error("User Creation failed");
        }
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.form}>
      <span className={styles.heading}>Signup</span>
      <p className={styles.desc}>
        Already have an account? <Link to="/login">Login</Link> straightaway
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            required
            value={inputData.name}
            onChange={(e) =>
              setInputData((prev) => {
                return {
                  ...prev,
                  name: e.target.value,
                };
              })
            }
            className={styles.formInput}
            name="name"
            placeholder="Enter Name"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            className={styles.formInput}
            id="email"
            required
            name="email"
            placeholder="Enter Email"
            value={inputData.email}
            onChange={(e) =>
              setInputData((prev) => {
                return {
                  ...prev,
                  email: e.target.value,
                };
              })
            }
            type="email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            className={styles.formInput}
            id="password"
            name="password"
            required
            placeholder="Enter Password"
            value={inputData.password}
            onChange={(e) =>
              setInputData((prev) => {
                return {
                  ...prev,
                  password: e.target.value,
                };
              })
            }
            type="password"
          />
        </FormGroup>
        <Button className={styles.btn}>Signup</Button>
      </Form>
    </div>
  );
};

export default Signup;
