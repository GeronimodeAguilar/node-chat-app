var socket = io();

function scrollToBottom () {
  const messages = document.querySelector('.chat__messages');
  let newMessage = messages.lastChild;

  let clientHeight = parseInt(getComputedStyle(messages).height);
  let scrollHeight = messages.scrollHeight;
  let newMessageHeight = parseInt(getComputedStyle(newMessage).height);
  if (clientHeight + newMessageHeight <= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

socket.on('connect', function () {
  const params = window.location.search.slice(1) ;
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  let userList = document.createElement('ol');
  userList.classList.add("user-list");
  
  users.forEach(function (user) {
    let newLi = document.createElement('li');
    newLi.innerHTML = user;
    userList.appendChild(newLi);
  });
  
  const oldUserList = document.querySelector('.user-list');
  document.querySelector('#users').replaceChild(userList, oldUserList);
});

socket.on('newMessage', function (message) {
  const messageBox = document.querySelector('.chat__messages')
  const formattedTime = message.createdAt;
  const newMessageItem = document.createElement('li');
  const inputText = document.createTextNode(message.text);
  const inputUsername = document.createTextNode(message.from);
  newMessageItem.innerHTML = `
  <li class="message">
  <div class="message__title">
    <h4 class="message__user"></h4>
    <span>${formattedTime}</span>
  </div>
  <div class="message__body">
    <p class="message__text"></p>
  </div>
</li>
  `;

  messageBox.appendChild(newMessageItem );
  messageBox.lastChild.querySelector('.message__text').appendChild(inputText);
  messageBox.lastChild.querySelector('.message__user').appendChild(inputUsername);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = message.createdAt;
  let newMessageItem = document.createElement('li');
  newMessageItem.innerHTML  = `
<li class="message">
<div class="message__title">
<h4>${message.from}</h4>
<span>${formattedTime}</span>
</div>
<div class="message__body">
  <p>
    <a href="${message.url}" target="_blank">My current location</a>
  </p>
</div>
</li>
  `;

  document.querySelector('.chat__messages').appendChild(newMessageItem );
  scrollToBottom();  

});

document.querySelector('#message-form').addEventListener('submit', function (e) {
  e.preventDefault();

  var messageTextbox = document.querySelector('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.value
  }, function () {
    messageTextbox.value = '';
  });
});

const locationButton = document.querySelector('#send-location');
locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled')
  locationButton.textContent = 'Sending location...';

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttribute('disabled')
    locationButton.textContent = 'Send location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled')
    locationButton.textContent = 'Send location';
    alert('Unable to fetch location.');
  });
});
