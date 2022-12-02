import { auth } from "./firebase.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateCurrentUser, updateProfile,signInWithPopup} from 'firebase/auth';
import { addTrader, addBroker, set_currenuser_cache, empty_currentuser_cache} from "../model/User.js";

var user;

//registers a new Trader user
function registerTrader(email, password, username){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: username
        }).then(async (res)=>{
          addTrader(auth.currentUser);
          console.log(auth.currentUser.uid + " Trader registered as " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
          await set_currenuser_cache('User')
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
    .then(async (userCredential) => {
      updateCurrentUser(auth, userCredential.user);
      console.log(auth.currentUser.uid + " Trader siged in as: " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
      await set_currenuser_cache('User')
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
      }).then(async (res)=>{
        addBroker(auth.currentUser);
        console.log(auth.currentUser.uid + " Broker registered as " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
        await set_currenuser_cache('Broker')
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
  .then(async (userCredential) => {
    updateCurrentUser(auth, userCredential.user);
    console.log(auth.currentUser.uid + " Broker siged in as: " + auth.currentUser.email + " with displayName: " + auth.currentUser.displayName);
    await set_currenuser_cache('Broker')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}

function SignOut(){
  console.log("User signed out");
  auth.signOut();
  empty_currentuser_cache()
}
export {registerTrader, loginTrader, registerBroker, loginBroker, SignOut};