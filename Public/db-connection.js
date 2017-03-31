var config = {
    apiKey: "AIzaSyAC-ZazGCk0zrEw0YKn1W_Pdb8qUxgPNLs",
    authDomain: "mytest-ac084.firebaseapp.com",
    databaseURL: "https://mytest-ac084.firebaseio.com",
    storageBucket: "mytest-ac084.appspot.com",
    messagingSenderId: "84775077704"
};

firebase.initializeApp(config);
var db = firebase.database();
var storageRef = firebase.storage().ref();
