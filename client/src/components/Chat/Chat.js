import { Link, useParams } from "react-router-dom";
import styles from "./Chat.module.css";
import { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { io } from "socket.io-client";

const Chat = () => {
  let { id } = useParams();
  const [recieverDetails, setRecieverDetails] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // useEffect for creating socket connection
  useEffect(() => {
    if (socket === null) {
      setSocket(io("ws://localhost:8080"));
    }
    if (socket) {
      socket.on("connect", () => {
        socket.emit("joined", { serverchannel: 120 });
        console.log("Connected to socket");
      });
      socket.on("chat", (data) => {
        if (data.action === "sendmessage") {
          setMessageList((prev) => {
            return [
              ...prev,
              {
                body: data.body.body,
                conversationId: data.body.conversationId,
                sender: { _id: data.body.sender },
              },
            ];
          });
        }
      });
    }
  }, [socket]);

  // useEffect for fetching the details of user who will be receiving the message
  useEffect(() => {
    let graphqlQuery = {
      query: `
            query FetchRecieverDetails($id: ID!){
              userdetails(id: $id) {
                name
                _id
                email
              }
            }
          `,
      variables: {
        id: id,
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
        setRecieverDetails(resData.data.userdetails);
      })
      .catch((e) => console.log(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect for fetching the history of messages between users
  useEffect(() => {
    let graphqlQueryMessages = {
      query: `
              query FetchMessages($id: ID!){
                messages(id: $id) {
                  body
                  conversationId
                  sender {
                    _id
                  }
                }
              }
            `,
      variables: {
        id: id,
      },
    };
    fetch("http://localhost:8080/graphql", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "content-type": "application/json",
      },
      body: JSON.stringify(graphqlQueryMessages),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setMessageList(resData.data.messages);
      })
      .catch((e) => console.log(e));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendMessage = (e) => {
    e.preventDefault();
    let graphqlQuery = {
      query: `
            mutation SendMessage($id: ID!,$messageBody: String!){
              sendMessage(id: $id,messageBody: $messageBody) {
                body
              }
            }
          `,
      variables: {
        id: id,
        messageBody: newMessage,
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
        console.log(resData);
      })
      .catch((e) => console.log(e));
    setNewMessage("");
  };

  return (
    <div className={styles.profileSection}>
      <p className={styles.profileHeading}>
        <span className={styles.userName}>{recieverDetails.name}</span>
        <Link to="/connections" className={styles.backBtn}>
          {"<---"}
        </Link>
      </p>
      {messageList.length > 0 &&
        messageList.map((message, i) => {
          return (
            <div key={i}>
              {message.sender._id === recieverDetails._id ? (
                <div className={styles.receiverUser}>
                  <span>{recieverDetails.name}</span>
                  <hr />
                  <span className={styles.userMessage}>{message.body}</span>
                </div>
              ) : (
                <div className={styles.senderUser}>
                  <span>{"You"}</span>
                  <hr />
                  <span className={styles.userMessage}>{message.body}</span>
                </div>
              )}
            </div>
          );
        })}
      {messageList.length === 0 && (
        <span>Conversation not started, chat more dude.</span>
      )}
      <div className={styles.messageInput}>
        <Input
          className={styles.formInput}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage} className={styles.sendBtn}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
