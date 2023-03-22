const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");

require("dotenv").config();

const app = express();

const MONGODB_URI = process.env.REACT_APP_mongoURI;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(express.static(path.join(__dirname, "../client", "build")));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});

const port = process.env.PORT || 8080;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected to DB succesfull");
    // app.listen(8080);
    const server = app.listen(port);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  })
  .catch((e) => console.log(e));
