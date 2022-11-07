import { auth } from "./firebase.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateCurrentUser, updateProfile} from 'firebase/auth';
import { addTrader } from "../model/User.js";

var user;


function registerUser(email, password, username){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: username
        }).then((res)=>{
          addTrader(auth.currentUser);
          console.log("User registered as " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}

function loginUser(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateCurrentUser(auth, userCredential.user);
      console.log("User siged in as: " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

function setUser(new_user){
  updateCurrentUser(auth, new_user);
  console.log("New user set as " + auth.currentUser.email);
}

function SignOut(){
  console.log("User signed out");
  auth.signOut();
}

export {registerUser, loginUser, setUser};