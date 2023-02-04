import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyC0dquOYSr3_F0hhpIZMct_Vhpxq0-8Ly0",
    authDomain: "fir-auth-13f1b.firebaseapp.com",
    projectId: "fir-auth-13f1b",
    storageBucket: "fir-auth-13f1b.appspot.com",
    messagingSenderId: "494528711848",
    appId: "1:494528711848:web:b6ffdcc3b7e7d4caa4069d"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}