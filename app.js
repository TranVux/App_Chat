import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
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

var myName = prompt("Nhập tên của bạn");
var frNameList = document.getElementById("nameFrlist");
var frName = document.getElementById("nameFr");
var controlInput = document.getElementById("inputMess");
var sendBtn = document.getElementById("sendBtn");
var boxChat = document.getElementById("boxChat");


function writeMes() {
    var mes = controlInput.value;
    if (mes == '') return;
    const id = push(child(ref(database), 'users')).key;
    var name = myName;
    const refMess = ref(database, 'users/' + id);
    set(refMess, {
        name: name,
        message: mes
    });
    controlInput.value = "";
    controlInput.focus();
}

const refNewMess = ref(database, 'users/');

onChildAdded(refNewMess, (snapshot) => {
    if (snapshot.val().name != myName) {
        let newBoxchat = `<div class="friend_mes" id="messField">
                            <img src="https://yt3.ggpht.com/ytc/AKedOLRAIbph_gdGzZ9tOuxxzrWJYHGXFLbBXDUVz6HE2w=s900-c-k-c0x00ffffff-no-rj" alt="" class="avt">
                            <div class="text_mes">${snapshot.val().message}</div>
                        </div>
                        `;
        boxChat.innerHTML += newBoxchat;
        frNameList.innerText = snapshot.val().name;
        frName.innerText = snapshot.val().name;
    } else {
        let newBoxchat = `<div class="self_mes" id="messField">
                            <div class="text_mes">${snapshot.val().message}</div>
                            <img src="https://yt3.ggpht.com/ytc/AKedOLRAIbph_gdGzZ9tOuxxzrWJYHGXFLbBXDUVz6HE2w=s900-c-k-c0x00ffffff-no-rj" alt="" class="avt">
                          </div>
                        `;
        boxChat.innerHTML += newBoxchat;
    }
    boxChat.scrollTop = boxChat.scrollHeight;
});

sendBtn.addEventListener('click', writeMes);
