const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clear the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  console.log(username);
  console.log(room);

  // Validate the data
  if(!username || !room) {
    return {
      error: 'Username and room are required!'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if(existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  // Store user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if(index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  // users.map((user) => {
  //   if(user.id === id) {
  //     return user;
  //   }
  // })
  
  // return undefined
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const filterdUser = [];
  users.map((user) => {
    if(user.room === room) {
      filterdUser.push(user);
    }
  })
  if(filterdUser.length !== 0) {
    return filterdUser
  }
  return undefined
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

