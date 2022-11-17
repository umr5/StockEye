import { auth } from "./firebase.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateCurrentUser, updateProfile,signInWithPopup} from 'firebase/auth';
import { addTrader, addBroker } from "../model/User.js";

var user;

//registers a new Trader user
function registerTrader(email, password, username){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: username
        }).then((res)=>{
          addTrader(auth.currentUser);
          console.log("Trader registered as " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}

//logs in an existing Trader user
function loginTrader(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateCurrentUser(auth, userCredential.user);
      console.log("Trader siged in as: " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

//registers a new Broker User
function registerBroker(email, password, username, institution){
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: username
      }).then((res)=>{
        addBroker(auth.currentUser);
        console.log("Broker registered as " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
      });
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
  });
}

//logs in a new Broker User
function loginBroker(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    updateCurrentUser(auth, userCredential.user);
    console.log("Broker siged in as: " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}

function setUser(new_user){
  updateCurrentUser(auth, new_user);
  console.log("New user set as " + auth.currentUser);
}

function SignOut(){
  console.log("User signed out");
  auth.signOut();
}

export {registerTrader, loginTrader, registerBroker, loginBroker, setUser, SignOut};