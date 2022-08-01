const socket = io("http://localhost:3000");
let roomId = "";

function onLoad() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const avatar = params.get("avatar");
  const email = params.get("email");

  if (name && avatar) {
    formatUserLogged({ name, avatar });
  }

  socket.emit("start", {
    name,
    email,
    avatar,
  });

  socket.on("new_users", (data) => {
    addNewUser(data);
  });

  socket.emit("get_users", (users) => {
    users.map((user) => {
      validUserForListContact({
        user,
        userLogged: { email, name, avatar },
      });
    });
  });

  socket.on("message", (data) => {
    if (data.message.roomId === roomId) {
      addMessage(data);
    }
  });

  socket.on("notification", (data) => {
    if (data.room_id !== roomId) {
      addNotification(data);
    }
  });
}

// DOM modifications
function addNotification(data) {
  const user = document.getElementById(`user_${data.from._id}`);
  user.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="notification"></div>
  `
  );
}

function formatUserLogged({ name, avatar }) {
  document.querySelector(".user_logged").innerHTML += `
  <img
    class="avatar_user_logged"
    src=${avatar}
  />
  <strong id="user_logged">${name}</strong>
`;
}

function addUser(user) {
  document.getElementById("users_list").innerHTML += `
  <li
    class="user_name_list"
    id="user_${user._id}"
    idUser="${user._id}"
  >
  <img
    class="nav_avatar"
    src=${user.avatar}
  />
  ${user.name}
</li>
  `;
}

function sendMessage(event) {
  const message = event.target.value;
  event.target.value = "";

  const data = {
    message,
    idChatRoom: roomId,
  };
  socket.emit("message", data);
}

function addMessage(data) {
  const divMessageUser = document.getElementById("message_user");
  const {
    user: { avatar, name },
    message: { created_at, text },
  } = data;

  divMessageUser.innerHTML += `
    <span class="user_name user_name_date">
    <img
      class="img_user"
      src=${avatar}
    />
      <strong>${name} &nbsp; </strong>
      <span> - ${dayjs(created_at).format("DD/MM/YYYY HH:MM")} </span></span
    >
    <div class="messages">
      <span class="chat_message">${text}</span>
    </div>
  `;
}

document.getElementById("users_list").addEventListener("click", (event) => {
  const focusUserClass = "user_in_focus";
  const listUserClass = "user_name_list";
  const inputMessage = document.getElementById("user_message");
  inputMessage.classList.remove("hidden");

  document.querySelectorAll(`li.${listUserClass}`).forEach((element) => {
    element.classList.remove(focusUserClass);
  });

  document.getElementById("message_user").innerHTML = "";
  if (event.target && event.target.matches(`li.${listUserClass}`)) {
    const idUser = event.target.getAttribute("idUser");
    event.target.classList.add(focusUserClass);

    const notification = document.querySelector(
      `#user_${idUser} .notification`
    );
    if (notification) notification.remove();

    socket.emit("start_chat", { idUser }, (response) => {
      roomId = response.room.id_chat_room;
      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to,
        };

        addMessage(data);
      });
    });
  }
});

document
  .getElementById("user_message")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  });

// verifications
function validUserForListContact({ user, userLogged }) {
  if (user.email !== userLogged.email) {
    addUser(user);
  }
}

function addNewUser(user) {
  const userExists = document.getElementById(`user_${user._id}`);
  if (!userExists) {
    addUser(user);
  }
}

// main function
onLoad();
