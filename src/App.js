import React, { useRef, useState } from 'react';
import './App.css';
import './Chat.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD1q2WvZ1JRGqCyjKa4LylpzMfhyZuCDWU",
  authDomain: "showintel-8dcf8.firebaseapp.com",
  databaseURL: "https://showintel-8dcf8.firebaseio.com",
  projectId: "showintel-8dcf8",
  storageBucket: "showintel-8dcf8.appspot.com",
  messagingSenderId: "58581328267",
  appId: "1:58581328267:web:49b2e8b62825a148648f8e",
  measurementId: "G-214P1FQBKT"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Sandbox Env</h1>
        <SignOut />
      </header>
      <section className="body">
        <section className="main">
          <p>Main Body</p>
        </section>
        <section className="rail">
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage} className="chatInput">
      <div className="inputContainer">
        <input 
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)} 
          placeholder="Say something..." />
        <button type="submit" disabled={!formValue}>Go</button>
      </div>
    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img alt="avatar" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
