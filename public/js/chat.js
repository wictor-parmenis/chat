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
}

// DOM modifications
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

document.getElementById("users_list").addEventListener("click", (event) => {
  if (event.target && event.target.matches("li.user_name_list")) {
    const idUser = event.target.getAttribute("idUser");

    socket.emit("start_chat", { idUser }, (data) => {
      console.log(data, "data");
      roomId = data.chatRoom.id_chat_room;
    });
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
