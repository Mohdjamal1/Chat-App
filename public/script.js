const socket = io();
let username = "";
document.getElementById('join-btn').addEventListener('click',(event)=>{
    event.preventDefault();
    joinChat();
});

function joinChat(){
    username = document.getElementById('username-input').value;
    // User Authentication,
    if(username.trim() != ""){
    document.querySelector('.user').style.display = 'none';
    document.querySelector('.chatroom').style.display = 'block';
    }else{
        let p = document.querySelector('#para');
        p.innerText = "Username can not be empty";
        p.setAttribute('style','color:red');
        return;
    }

    let header = document.getElementById('header');
    header.innerText = `${username} Chatroom`;
    //this emit the message in socket
    socket.emit('new user join',username);
}
    
//This function calls the socket callback when new user join the chat
socket.on('new user join',(username)=>{
    joinInfo(username);
});

//This function calls the socket callback when any user left the chat
socket.on('close', name=>{
    leftChat(name);
});

//This function run when new User Join the chatroom
function joinInfo(username){
    let container = document.querySelector('.message');
    let join = document.createElement('div');
    join.setAttribute('class','userJoin');
    join.innerText = `${username} join the Chat:`;
    container.append(join);
}
//This function run when any User left the chatroom
function leftChat(username){
    let container = document.querySelector('.message');
    let join = document.createElement('div');
    join.setAttribute('class','userLeft');
    join.innerText = `${username} left the Chat:`;
    container.append(join);
}

//when a user want to send a message by click on send btn
document.getElementById('send-btn').addEventListener('click',(event)=>{
    event.preventDefault();
    let msg = document.getElementById('msg').value.trim();

    // //if user give empty message;
    if (msg === "") {
        return;
    }
    //create a object
    const data ={
        username : username,
        message : msg,
    }

    //emmiting with 'message' event
    socket.emit('message',data);
    addMessage(data,true); //true => sent
});

//receiving message
socket.on('message',(data)=>{
    if (data.username !== username) {
        console.log(data.username);
        addMessage(data,false);
    }
});



//this function is appending message into DOM
function addMessage(data,flag) {
    let div = document.querySelector('.message');
    let msgDiv = document.createElement('div');
    //flag => true for sent
    //flag => false for receive
    if(flag){
        msgDiv.innerText = `${data.message}`;
        msgDiv.setAttribute('class','right');
    }
    else{
        msgDiv.innerText = `${data.username}: ${data.message}`;
        msgDiv.setAttribute('class','left');
    }
    div.append(msgDiv);
    document.getElementById('msg').value = "";
    console.log("end of func");
}