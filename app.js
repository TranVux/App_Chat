import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, set, ref, push, update, child, onValue, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
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

var myName = '';
var photoURL = 'https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-person-avatar-default-pic-used-web-design-127393540.jpg';
var userUID = '';
var frName = document.getElementById("nameFr");
var controlInput = document.getElementById("inputMess");
var isComposing = false;
var isRemove = false;
var tempIdWaitMess = '';
var sendBtn = document.getElementById("sendBtn");
var boxChat = document.getElementById("boxChat");
var listFriends = document.getElementById("listFriends");
var log_gg_btn = document.getElementById("gg_btn_in");
var countTurn = 0; //Count the mess typing
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
onAuthStateChanged(auth, async (user) => {
    if (user) {
        log_gg_btn.id = 'gg_btn_out';
        log_gg_btn = document.getElementById("gg_btn_out");
        log_gg_btn.innerText = `Logout`;
        photoURL = user.photoURL;
        myName = user.displayName;
        userUID = user.uid;
        // console.log(userUID);
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
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }
});

// end user setup

// send and get mess
function removeWaitBoxMess() {
    let arrBoxWait = document.querySelectorAll('.friend_mes_wait');
    arrBoxWait.forEach(element => {
        boxChat.removeChild(element);
    })
}

function writeMes() {
    var mes = controlInput.value;
    if (mes == '') return;
    const id = push(child(ref(database), 'users')).key;
    var name = myName;
    isComposing = false;
    const refMess = ref(database, 'users/' + id);
    set(refMess, {
        uid: userUID,
        name: name,
        message: mes,
        photoURL: photoURL,
        isComposing: isComposing
        // isRemove: isRemove
    });
    controlInput.value = "";
    controlInput.focus();
    countTurn = 0;
    updateTempIdWaitMess(tempIdWaitMess);
    removeWaitBoxMess();
}

sendBtn.addEventListener('click', writeMes);

function highlightUserContainer() {
    let arrUserContainer = document.querySelectorAll(".name_friend");
    arrUserContainer.forEach(element => {
        if (element.innerHTML == myName) {
            element.parentElement.classList.add("me");
        }
    });
}

// ref mess from database
const refNewMess = ref(database, 'users/');

// Press Enter to send mess 
// isComposing trả về true khi trong quá trình soạn thảo
controlInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        writeMes();
    } else {
        countTurn++;
        if (countTurn == 1) {
            isComposing = true;
            isRemove = false;
            var name = myName;
            const id = push(child(ref(database), 'users')).key;
            tempIdWaitMess = id;
            const refMess = ref(database, 'users/' + id);
            set(refMess, {
                uid: userUID,
                message: '',
                name: name,
                photoURL: photoURL,
                isComposing: isComposing,
                // isRemove: isRemove
            });
        }
    }
});

function updateTempIdWaitMess(tempId) {
    const refuser = ref(database, 'users/' + tempId);
    update(refuser, {
        isComposing: false,
    });
}

//auto update value of isComposing when tab closed
controlInput.addEventListener('focus', () => {
    window.addEventListener('beforeunload', () => {
        updateTempIdWaitMess(tempIdWaitMess);
    });
});
// end typing function
onChildAdded(refNewMess, (snapshot) => {
    var arrFriends = document.querySelectorAll(".friend_container");
    if (arrFriends.length == 0) {
        listFriends.innerHTML += `<div class="friend_container" data-uid="${snapshot.val().uid}">
        <img src="${snapshot.val().photoURL}"
            alt="" id="myAvt">
        <span class="name_friend">${snapshot.val().name}</span>
        </div>`;
    } else {
        if (!listFriends.textContent.includes(snapshot.val().name)) {
            listFriends.innerHTML += `<div class="friend_container" data-uid="${snapshot.val().uid}">
            <img src="${snapshot.val().photoURL}"
                alt="" id="myAvt">
            <span class="name_friend">${snapshot.val().name}</span>
            </div>`;
        }
    }
    // show mess
    if (snapshot.val().uid != userUID) {
        if (snapshot.val().message != '') {
            let newBoxchat = `<div class="friend_mes" id="messField">
                            <img src="${snapshot.val().photoURL}" alt="" class="avt">
                            <div class="text_mes">${snapshot.val().message}</div>
                        </div>
                        `;
            boxChat.innerHTML += newBoxchat;
            frName.innerText = snapshot.val().name;
            removeWaitBoxMess();
        } else {
            if (snapshot.val().isComposing == true) {
                let newWaitBoxChat = `
                <div data-uid="${snapshot.val().uid}" class="friend_mes friend_mes_wait">
                    <img src="${snapshot.val().photoURL}"
                        alt="" class="avt">
                    <div class="text_mes">
                        <i class="fa-solid fa-circle"></i>
                        <i class="fa-solid fa-circle"></i>
                        <i class="fa-solid fa-circle"></i>
                    </div>
                </div>
                `
                boxChat.innerHTML += newWaitBoxChat;
                boxChat.scrollTop = boxChat.scrollHeight;
            }
        }
    } else {
        if (snapshot.val().message != '') {
            let newBoxchat = `<div class="self_mes" id="messField">
            <div class="text_mes">${snapshot.val().message}</div>
            <img src="${snapshot.val().photoURL}" alt="" class="avt">
          </div>
        `;
            boxChat.innerHTML += newBoxchat;
        }
    }
    boxChat.scrollTop = boxChat.scrollHeight;
    highlightUserContainer();
});


