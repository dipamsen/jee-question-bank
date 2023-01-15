// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} = require("firebase/firestore/lite");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn_E9L9JYJeM0caKYBLJdGAk7bL-mSClc",
  authDomain: "fun-planet-95e02.firebaseapp.com",
  databaseURL: "https://fun-planet-95e02-default-rtdb.firebaseio.com",
  projectId: "fun-planet-95e02",
  storageBucket: "fun-planet-95e02.appspot.com",
  messagingSenderId: "881612924662",
  appId: "1:881612924662:web:a0ac0c34f71213e40a6ed7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function getCompletedChaps() {
  const q = doc(db, "jeeq", "completed_chaps");
  return (await getDoc(q)).data();
}

async function setCompletedChaps(obj) {
  const q = doc(db, "jeeq", "completed_chaps");
  return setDoc(q, obj);
}

module.exports = {
  getCompletedChaps,
  setCompletedChaps,
};
