import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useDispatch } from "react-redux";
import { setToken } from "../../features/auth/authSlice";

import styles from "../Signup/Signup.module.css";

const Login = () => {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const graphqlQuery = {
      query: `
            query UserLogin($email: String!, $password: String!){
              login(email: $email, password: $password) {
                token
                userId
              }
            }
            `,
      variables: {
        email: inputData.email,
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
          throw new Error("User Login failed");
        }
        localStorage.setItem("token", resData.data.login.token);
        localStorage.setItem("userId", resData.data.login.userId);
        dispatch(setToken(resData.data.login));
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.form}>
      <span className={styles.heading}>Login</span>
      <p className={styles.desc}>
        Dont have an account? <Link to="/signup">Signup</Link> now
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            required
            name="email"
            placeholder="Enter Email"
            value={inputData.email}
            className={styles.formInput}
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
            required
            id="password"
            name="password"
            placeholder="Enter Password"
            value={inputData.password}
            className={styles.formInput}
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
        <Button className={styles.btn}>Login</Button>
      </Form>
    </div>
  );
};

export default Login;
