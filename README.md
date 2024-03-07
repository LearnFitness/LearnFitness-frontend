# LearnFitness mobile app

Welcome to the repository of our LearnFitness mobile app, a cutting-edge solution designed to cater to fitness enthusiasts and individuals looking to enhance their physical well-being through structured and engaging workout routines.

## Technology Stack

- **Frontend**: Built using React Native, this app offers a smooth and dynamic user experience that is consistent across iOS and Android devices.
- **Backend Server**: Our backend infrastructure is powered by Node.js and Express, ensuring a robust and scalable service architecture.
- **Deployment**: Deployed on Google Cloud Platform's App Engine, our app benefits from automatic scaling and high availability, handling user demands efficiently and reliably.
- **Database**: Utilizing Firebase Firestore, we ensure that our app scales seamlessly with growing data needs, providing real-time updates and powerful query capabilities.

## How to compile and run the app

### 0. Clone this repo

### 1. Install npm dependencies

- ```cd``` to the frontend directory
- If you have yarn package manager, run ```yarn``` command in the terminal
- If you don't, run ```npm i``` (If this fails, you may not have Node.js installed. Install Node.js for you system first, which should come with npm by default)
- Wait for the packages to be installed

### 2. Run the app

Try the following commands to quickly run the app:

- Run the command ```npx expo start```
- The Metro Bundler should start, and give you options to build Android or iOS apps.
- Press ```i``` to open iOS simulator (Mac only).
- Press ```a``` to Android emulator.
- Metro will automatically start the iOS simulator or the Android emulator to install and run your app, assumed that you already installed XCode (Mac only) and Android Studio + create an Android device emulator.
- On Macs, you may need to start the Android device manually before pressing ```a``` to run the Android version of the app.

If the above commands failed, you need a build of the app before running it. There are 1 options to build:

1. Locally:

- run ```npx expo run:ios``` or ```npx expo run:android```

2. On the cloud (using eas):

- run ```eas build --platform ios --profile preview``` or ```eas build --platform android --profile preview```
- Note that a cloud build of iOS apps require a paid Apple Developer Account ($99/year).

## Frontend file structure (React Native Expo)

### Root directory

- ```app.json```: config file for Expo.
- ```App.tsx```: React Native app entry.
- ```eas.json```: config file for EAS builds (built on the cloud).
- ```local.properties```: contains directory of the Android SDK (used when building Android apps locally, copy and paste to ```./android``` when needed).
- ```package.json```: npm (node package manager) dependencies.
- ```tsconfig.json```: config file for TypeScript
- ```yarn.lock```: (optional) yarn package mananger dependencies (a better alternative to npm). If you don't have yarn then this file will be package-lock.json
- ```.gitignore```: a list of files and folders to be ignored by Git and GitHub

### ```screens``` folder

- Contains screens

### ```assets``` folder

- Contains app images

### ```android``` folder

- Contains the local build of the Android app

### ```components``` folder

- Contains React Native components

### ```ios``` folder

- Contains the local build of the iOS app

### ```node_modules``` folder

- Contains all npm dependencies files. Ignored by Git & GitHub

### ```utils``` folder

- Contains config files for Firebase connections, Google Services and a troubleshoot clean-up script.
