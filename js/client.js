const socket = io('http://localhost:8000');

//Get DOM elements recpective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will playing on receiving messages
var audio = new Audio('ting.mp3');

//Function which will append event info to the container
const append=(message, position)=>{
    const messageElement = document.createElement('div')
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position == 'left'){
        audio.play();
    }
}

//Ask new user for his/her name and let the server know
const name1 = prompt("Enter Your name to Join", "Guest");
socket.emit('new-user-joined', name1);

//If the new user joins, receive his/her name from the server
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'left');
});

//If server sends a message, receive it
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`,'left')
});

//If user leaves the chat, append the info to the container
socket.on('left-the-chat',name=>{
    append(`${name} left the chat`,'left');
});

//If the form get submitted, send server the message
form.addEventListener('submit',e=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    messageInput.value = '';
});