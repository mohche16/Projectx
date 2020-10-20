/*Definitioner för saker som kommer användas med fetch*/
const base_ApiUrl = "https://reqres.in/";
const headerData = {
  "Content-Type": "application/json",
};
const bodyData = {
  email: "",
  password: "",
};

/*Funktion som returnerar true ifall vår inloggning lyckades*/
const submitLogin = async () => {
  let jsonData = {};
  await fetch(base_ApiUrl + "api/login", {
    method: "POST",
    headers: headerData,
    body: JSON.stringify(bodyData),
  })
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
    });
  if (jsonData.token) {
    return true;
  }
  return false;
};

/*Getusers returnerar en array som är en array med olika user objekt, med properties som jsonData.first_name last_name email mm..*/
const getUsers = async () => {
  let jsonData = {};
  await fetch(base_ApiUrl + "api/users")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data.data;
    });
  if (jsonData) {
    return jsonData;
  }
};

/* HTML Element som vi bland annat hämtar values, lägger event listeners på mm.*/
const loginformEl = document.querySelector("#loginForm");
const showUsersBtnEl = document.querySelector(".showUsersButton");
const loginMsgEl = document.querySelector("#loginErrorMessage");

/*Event på loginformen som hanterar att sätta bodyData till värden som användaren har lagt in på webb läsaren, och sedan så körs submitLogin() 
funktionen först här för att sedan visa show users knappen osv.*/
loginformEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  bodyData.email = document.querySelector("#loginEmailInput").value;
  bodyData.password = document.querySelector("#loginPasswordInput").value;

  if (await submitLogin()) {
    showUsersBtnEl.classList.remove("hide");
    if (!loginMsgEl.classList.contains("hide"))
      loginMsgEl.classList.add("hide");
  } else {
    const loginMsgEl = document.querySelector("#loginErrorMessage");
    loginMsgEl.classList.remove("hide");
    loginMsgEl.append("<p>Error logging in! Check your details");
  }
});

/*Returnerar en array med användarens fulla data beroende på userId (filter på userid) */
const findUserById = async (id) => {
  let jsonData = {};
  await fetch(base_ApiUrl + `api/users?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      jsonData = data.data;
    });
  if (jsonData) {
    return jsonData;
  }
};

//Eventlistener på show users knappen  som sedan skapar en ny array med <li> med varje användares data
const usersListEl = document.querySelector(".usersList");
showUsersBtnEl.addEventListener("click", async (e) => {
  const Users = await getUsers();
  const parsedUsersArray = Users.map((index) => {
    return `<li class="userlistitem" value="${index.id}">${index.first_name}</li>`;
  }).join("");

  //Sätt htmlen så att det blir en list item för varje objekt
  usersListEl.innerHTML = parsedUsersArray;
});

//Specific Userinfo container för klicka på användare för mer info
const userInfoContainerEl = document.querySelector(".userInfoContainer");
usersListEl.addEventListener("click", async (e) => {
  if (e.target.classList.contains("userlistitem")) {
    const listItemEl = e.target;
    let userInfoArray = await findUserById(listItemEl.value);

    let avatarElement = document.createElement("img");
    avatarElement.src = userInfoArray.avatar;
    let first_lastnameEl = document.createElement("p");
    first_lastnameEl.innerText = `First Name: ${userInfoArray.first_name} - Last Name: ${userInfoArray.last_name} - E-Mail: ${userInfoArray.email}`;
    userInfoContainerEl.innerHTML = "";
    userInfoContainerEl.append(avatarElement);
    userInfoContainerEl.append(first_lastnameEl);
  }
});
