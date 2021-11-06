import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; //v9
import "firebase/compat/database";
const config = {
  apiKey: "AIzaSyCdPkKK8GhLbJRB6PtwULV7QOa_LoSd00s",
  authDomain: "my-bro-d8dfb.firebaseapp.com",
  databaseURL: "https://my-bro-d8dfb-default-rtdb.firebaseio.com"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
