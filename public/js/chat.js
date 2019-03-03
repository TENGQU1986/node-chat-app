const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
})

socket.on('location', (locationInfo) => {
  console.log(locationInfo)
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
