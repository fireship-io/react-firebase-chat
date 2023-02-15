Local emulator suite for firebase ([documentation](https://firebase.google.com/docs/emulator-suite/))

![](https://firebase.google.com/docs/emulator-suite/images/emulator-suite-usecase.png)

# get ready

- login `npm run firebase login`
- install the firestore emulator: `npm run firebase setup:emulators:firestore` and the ui `npm run firebase setup:emulators:ui`
- `npm run dev` and point your browser to to http://localhost:4000
- `npm run shell` doc is https://firebase.google.com/docs/functions/local-emulator

# troubleshooting

- need java 11? [use homebrew and link your system to it](https://medium.com/@kirebyte/using-homebrew-to-install-java-jdk11-on-macos-2021-4a90aa276f1c)
