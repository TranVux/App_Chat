import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
import { getAuth, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBHmL6QM_cqAAk5379gU-IOGXq7GF78Qsw",
    authDomain: "appchat-2910.firebaseapp.com",
    databaseURL: "https://appchat-2910-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "appchat-2910",
    storageBucket: "appchat-2910.appspot.com",
    messagingSenderId: "354945102753",
    appId: "1:354945102753:web:f8c8caf2abdc4b911991e0",
    measurementId: "G-VP2GJ1KQ8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

var myName = document.getElementById("myName");
var myAvt = document.getElementById("myAvt");
var photoURL = '';
var userUID = '';
var frName = document.getElementById("nameFr");
var controlInput = document.getElementById("inputMess");
var sendBtn = document.getElementById("sendBtn");
var boxChat = document.getElementById("boxChat");
var log_gg_btn = document.getElementById("gg_btn_in");
// var logout_gg_btn = document.getElementById("gg_btn_out");

/*
    Login google 
    get user info from AUTH

*/

log_gg_btn.addEventListener('click', () => {
    if (log_gg_btn.id == 'gg_btn_in') {
        signInWithRedirect(auth, provider);
    }
});


onAuthStateChanged(auth, (user) => {
    if (user) {
        log_gg_btn.id = 'gg_btn_out';
        log_gg_btn = document.getElementById("gg_btn_out");
        log_gg_btn.innerText = `Logout`;
        myName.innerText = user.displayName;
        myAvt.src = user.photoURL;
        photoURL = user.photoURL;
        userUID = user.uid;
    } else {
        log_gg_btn.id = 'gg_btn_in';
        log_gg_btn = document.getElementById("gg_btn_in");
        log_gg_btn.innerText = `Sign In with google`;
        myName.innerText = `guest ${Math.floor(Math.random() * 9999)}`;
        myAvt.src = `https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-person-avatar-default-pic-used-web-design-127393540.jpg`;
    }
});

log_gg_btn.addEventListener('click', () => {
    if (log_gg_btn.id == 'gg_btn_out') {
        signOut(auth).then(() => {
            console.log('logout is successful');
            userUID = '';
            photoURL = 'https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-person-avatar-default-pic-used-web-design-127393540.jpg'
        }).catch((error) => {
            console.log(error);
        });
    }
});

// end user setup


// send and get mess
function writeMes() {
    var mes = controlInput.value;
    if (mes == '') return;
    const id = push(child(ref(database), 'users')).key;
    var name = myName.innerText;
    const refMess = ref(database, 'users/' + id);
    set(refMess, {
        uid: userUID,
        name: name,
        message: mes,
        photoURL: photoURL
    });
    controlInput.value = "";
    controlInput.focus();
}

sendBtn.addEventListener('click', writeMes);

// Press Enter to send mess
controlInput.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        writeMes();
    }
    return;
});

const refNewMess = ref(database, 'users/');

onChildAdded(refNewMess, (snapshot) => {
    if (snapshot.val().uid != userUID) {
        let newBoxchat = `<div class="friend_mes" id="messField">
                            <img src="${snapshot.val().photoURL}" alt="" class="avt">
                            <div class="text_mes">${snapshot.val().message}</div>
                        </div>
                        `;
        boxChat.innerHTML += newBoxchat;
        // frNameList.innerText = snapshot.val().name;
        frName.innerText = snapshot.val().name;
    } else {
        let newBoxchat = `<div class="self_mes" id="messField">
                            <div class="text_mes">${snapshot.val().message}</div>
                            <img src="${snapshot.val().photoURL}" alt="" class="avt">
                          </div>
                        `;
        boxChat.innerHTML += newBoxchat;
    }
    boxChat.scrollTop = boxChat.scrollHeight;
});



