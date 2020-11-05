//Textbox values
let userName = null;
let passWord = null;

const loginBtnEl = document.querySelector("#Log");
const cookieImageEl = document.querySelector(".cookieImg");
const cookieTextEl = document.querySelector(".cookietext");

//Default credentials
const adminUsername = "admin";
const adminPassword = "admin";
const verifyLogin = () => {
  if (userName == adminUsername && passWord == adminPassword) return true;
};

(() => {
  loginBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    //returns true if credentials match
    userName = document.querySelector("#Uname").value;
    passWord = document.querySelector("#Pass").value;
    if (verifyLogin()) {
      console.log("Login success");
      const event = new CustomEvent("login-success", { bubbles: true });
      cookieImageEl.dispatchEvent(event);
      cookieTextEl.dispatchEvent(event);
    } else {
      console.log("Failed login attempt");
    }
  });

  cookieTextEl.addEventListener("login-success", (e) => {
    console.log("event ran");
    cookieTextEl.innerText = "You have logged in and you now get a baby cookie";
  });

  cookieImageEl.addEventListener("login-success", (e) => {
    console.log("event ran");
    cookieImageEl.src = "babycookie.jpg";
  });
})();
