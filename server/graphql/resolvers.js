const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const io = require("../socket");

const User = require("../models/user");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, name, password } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-Mail is invalid" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPwd,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.REACT_APP_SECRET,
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },
  user: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found");
      error.code = 404;
      throw error;
    }
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  users: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const allUsers = await User.find({ _id: { $ne: id } });
    return allUsers;
  },
  userdetails: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(id);
    return { _id: user._id, name: user.name, email: user.email };
  },
  updateStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found");
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  messages: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    let conversationDetails;
    conversationDetails = await Conversation.findOne({
      members: { $all: [req.userId, id] },
    });
    if (!conversationDetails) {
      const conversation = new Conversation();
      conversation.members.push({ _id: req.userId });
      conversation.members.push({ _id: id });
      conversationDetails = await conversation.save();
    }
    const messageList = await Message.find({
      conversationId: conversationDetails._id,
    });
    return messageList;
  },
  sendMessage: async function ({ id, messageBody }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    let conversationDetails;
    conversationDetails = await Conversation.findOne({
      members: { $all: [req.userId, id] },
    });
    if (!conversationDetails) {
      const conversation = new Conversation();
      conversation.members.push({ _id: req.userId });
      conversation.members.push({ _id: id });
      conversationDetails = await conversation.save();
    }
    const message = new Message({
      conversationId: conversationDetails._id,
      sender: req.userId,
      body: messageBody,
    });
    const newMessage = await message.save();
    io.getIO().emit("chat", {
      action: "sendmessage",
      body: newMessage,
    });
    console.log("send message mutation");
    return newMessage;
  },
};
