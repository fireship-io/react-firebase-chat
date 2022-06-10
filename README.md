# reactChat

Initial **Steps** from [firebase](https://console.firebase.google.com/) to get started

1. Create new Project

2. Enable Google sign in method from `Authentication`

3. Enable `Storage`

4. Create new database from `Firestore Database` and **add** this rule

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    match /{document=**} {
      allow read, write: if false;
    }
    
		match /messages/{docId} {
      allow read: if request.auth.uid != null;
      allow create: if canCreateMessage();
    }
    
    function canCreateMessage() {
      let isSignedIn = request.auth.uid != null;
      let isOwner = request.auth.uid == request.resource.data.uid;
      
      let isNotBanned = exists(
      	/databases/$(database)/documents/banned/$(request.auth.uid)
      ) == false;
      
      return isSignedIn && isOwner && isNotBanned;
    }
  }
}
```

5. `Add Firebase to your web app` and **copy** the variables from `const firebaseConfig`

6. **Paste** it in app.js file

```
/src/app.js
```