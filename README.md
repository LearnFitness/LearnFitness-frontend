# LearnFitness mobile app

Welcome to the repository of our LearnFitness mobile app, a cutting-edge solution designed to cater to fitness enthusiasts and individuals looking to enhance their physical well-being through structured and engaging workout routines.

## Technology Stack

- **Frontend**: Built using React Native, this app offers a smooth and dynamic user experience that is consistent across iOS and Android devices.
- **Backend Server**: Our backend infrastructure is powered by Node.js and Express, ensuring a robust and scalable service architecture.
- **Deployment**: Deployed on Google Cloud Platform's App Engine, our app benefits from automatic scaling and high availability, handling user demands efficiently and reliably.
- **Database**: Utilizing Supabase PostgreSQL, we ensure that our app scales seamlessly with growing data needs, providing real-time updates and powerful query capabilities.

## Frontend file structure (React Native Expo)

### Root directory

- ```app.json```: config file for Expo.
- ```App.tsx```: React Native app entry.
- ```eas.json```: config file for EAS builds (built on the cloud).
- ```local.properties```: contains directory of the Android SDK (used when building Android apps locally, copy and paste to ```./android``` when needed).
- ```package.json```: npm (node package manager) dependencies.
- ```tsconfig.json```: config file for TypeScript
- ```yarn.lock```: yarn package mananger dependencies (a better alternative to npm)
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

- ```supabase.js```: establish connections to Supabase.

## Backend file structure (Node.js + Express)

### Root directory

- ```package.json``` and ```package-lock.json```: npm (node package manager) dependencies.
- ```index.js```: Node.js app entry.
