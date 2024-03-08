## How to contribute to our LearnFitness frontend

### 1. Clone this repo to your local machine and check out the ```dev``` branch
There are 2 branches to this repo. The ```main``` branch is stable and ready for production. The ```dev``` branch is where we develop and test our code. Example git commands:
- ```git clone <url>``` (```git pull``` if you've already cloned it before)
- ```git checkout dev```

### 2. Develop and test your feature
First of all, launch the app locally by running one of these commands in the terminal, depending on which platform you're coding for.

- Installing dependencies (make sure you have Node.js installed): ```npm i```
- Launch iOS app: ```npx expo run:ios```
- Launch Android app: ```npx expo run:android```

Any changes you make to the code will now be automatically updated in the iOS simulator or Android emulator.

Once you complete and test your feature, stage the changes and commit it to ```dev``` with detailed commmit messages. It might be a good idea to annouce team members that a new feature is completed, so we can all test it if necessary. 
- ```git add .```
- ```git commit -m <your message>```

Once you're done, the ```dev``` is updated and there should be a warning like below.
<img width="935" alt="image" src="https://github.com/LearnFitness/LearnFitness-frontend/assets/35861939/06b59879-b8e3-40b3-a6c1-3f884cc69ae8">

### 3. Make a pull request
Pull request is a way to ensure we do not break our app when multiple people are adding, removing and testing changes. Before the changes are merged into the ```main``` branch, a team member has to review the code and resolve any conflicts.
<img width="1093" alt="image" src="https://github.com/LearnFitness/LearnFitness-frontend/assets/35861939/359a8607-6778-4a45-898c-3f85ed0505d4">

### 4. Merge pull request
This should be done by other team members other than you, to make sure our ```main``` branch is always stable and bug free.
<img width="950" alt="image" src="https://github.com/LearnFitness/LearnFitness-frontend/assets/35861939/109e5d82-ef7a-49ef-8f09-33ec09ab57c2">
