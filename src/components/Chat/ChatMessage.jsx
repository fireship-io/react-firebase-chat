import React from "react";
import { auth } from "../../firebaseConfig";

const DEFAULT_PP =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106";

export default function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth?.currentUser?.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || DEFAULT_PP} />
        <p>{text}</p>
      </div>
    </>
  );
}
