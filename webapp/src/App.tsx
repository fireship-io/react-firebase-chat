import React, { useState, useRef } from 'react'

import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  getFirestore,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'

import './App.css'

const firebaseConfig = {
  // config here
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

if(window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}

type ChatMessageProps = {
  text: string
  uid: string
  photoURL: string
  author: string
  currentUserUid: string
}
function ChatMessage({
  text,
  uid,
  photoURL,
  author,
  currentUserUid,
}: ChatMessageProps) {
  const messageClass = uid === currentUserUid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt={author} />
      <p>{text}</p>
    </div>
  )
}

function ChatRoom({ user }: { user: User }) {
  const dummy = useRef() as React.MutableRefObject<HTMLSpanElement>
  const messagesRef = collection(db, 'messages')
  const messagesQuery = query(messagesRef, orderBy('createdAt'))

  const [messages, loading, error] = useCollection(messagesQuery, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  const [formValue, setFormValue] = useState('')
  const sendMessage = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const { uid, photoURL, displayName } = user
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: Timestamp.fromDate(new Date()),
      uid,
      photoURL,
      author: displayName,
    })
    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return (
      <>
        <p>
          <b>{error.code}</b>
        </p>
        <p>Error: {JSON.stringify(error)}</p>
      </>
    )
  }

  return (
    <>
      <main>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {JSON.stringify(error)}</p>}
        {messages &&
          messages.docs.map(doc => {
            const { text, uid, photoURL, author } = doc.data()
            return (
              <ChatMessage
                key={doc.id}
                text={text}
                uid={uid}
                photoURL={photoURL}
                author={author || 'Anonymous'}
                currentUserUid={user.uid}
              />
            )
          })}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={ev => setFormValue(ev.target.value)}
        />
        <button type="submit" disabled={formValue.length === 0}>
          ↩
        </button>
      </form>
    </>
  )
}

function UserBox({ user }: { user: User }) {
  const { photoURL, displayName } = user
  return (
    <div>
      <img referrerPolicy="no-referrer" src={photoURL || ''} alt="" />
      {displayName}
    </div>
  )
}

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        {user && <UserBox user={user} />}
        <SignOut />
      </header>

      <section>{user ? <ChatRoom user={user} /> : <SignIn />}</section>
    </div>
  )
}

export default App
