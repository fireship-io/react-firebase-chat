import React from "react";
import "./App.css";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./components/Auth/SignIn";
import SignOut from "./components/Auth/SignOut";
import ChatRoom from "./components/Chat/ChatRoom";
import { auth } from "./firebaseConfig";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
