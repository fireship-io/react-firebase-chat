import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true})
  response.send("Hello from Firebase!")
})

admin.initializeApp()

const db = admin.firestore()

const isProfane = (text: string) => {
  return text.includes("badword")
}
const filter = (text: string) => {
  return text.replace("badword", "****")
}

exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}")
    .onCreate(async (doc, ctx) => {
      const {text, uid} = doc.data()

      if (isProfane(text)) {
        const cleaned = filter(text)
        await doc.ref.update({
          text: `🤐 I got BANNED for life for saying... ${cleaned}`,
        })

        await db.collection("banned").doc(uid).set({})
      }

      const userRef = db.collection("users").doc(uid)

      const userData = (await userRef.get()).data()
      if (!userData) {
        return
      }

      if (userData.msgCount >= 7) {
        await db.collection("banned").doc(uid).set({})
      } else {
        await userRef.set({msgCount: (userData.msgCount || 0) + 1})
      }
    })
