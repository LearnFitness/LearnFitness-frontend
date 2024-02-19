import { initializeApp } from 'firebase-admin/app';
import express from 'express';

// Set up Express app
const app = express()
// Initialize Firebase Admin
const firebaseApp = initializeApp();