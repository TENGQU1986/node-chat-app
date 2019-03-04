
const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm A')
  });
  console.log(message.username)
  $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('location', (message) => {
  console.log(message)
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm A')
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html;
})

socket.on('welcome', (message) => {
  console.log(message.text);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm A')
  });
  $messages.insertAdjacentHTML('beforeend', html);
})



$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');
  // disable

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    //enable
    
    if (error) {
      return console.log(error);
    }

    console.log('The message was delivered', message);
  });
});

$sendLocationButton.addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('location not supported by your browser')
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    const locationInfo = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    }

    socket.emit('sendLocation', locationInfo, () => {
      console.log('Location shared!');
      $sendLocationButton.removeAttribute('disabled');
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
})