import { initializeApp } from '@firebase/app';
import {getFirestore} from 'firebase/firestore';
import { getAuth , onAuthStateChanged} from 'firebase/auth';
//import { initializeApp } from 'firebase-admin';
//import * as admin_key from '../stockeye-8f390-firebase-adminsdk-cc8zk-70d9d13f30.json';

//firebase constants
const firebaseConfig = {
    apiKey: "AIzaSyCpGJG2UxBuDfLZpx-8wwcPxgYBQsrOyA0",
    authDomain: "stockeye-8f390.firebaseapp.com",
    projectId: "stockeye-8f390",
    storageBucket: "stockeye-8f390.appspot.com",
    messagingSenderId: "380155104187",
    appId: "1:380155104187:web:767421cbfa5967f343129e"
}

const firebaseApp = initializeApp(firebaseConfig);
//initializeApp({credential: applicationDefault()});
//admin.initializeApp();
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export {db, auth};