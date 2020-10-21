/*Definitioner för saker som kommer användas med fetch*/
const base_ApiUrl = "https://jsonplaceholder.typicode.com/";
const headerData = {
  "Content-Type": "application/json",
};

/*Getusers returnerar en array som är en array med olika user objekt, med properties som jsonData.first_name last_name email mm.., tar en parameter
så att t.ex får den "posts" som parameter så blir länken: https://jsonplaceholder.typicode.com/posts */
const getData = async (page) => {
  let jsonData = {};
  await fetch(base_ApiUrl + page)
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
    });
  if (jsonData) {
    return jsonData;
  }
};

//innehåller final response från getData funktionen;
let postsData = {};
//div element / container där alla posts åker in
let postsEl = document.querySelector(".posts");

//Kör när sidan läser in
window.onload = async () => {
  postsData = await getData("posts");
  if (postsData) {
    //Parsed data innehåller vår HTML kod som innehåller information från fetch requesten (id, title, body userid och postid för posterna)
    let parsedData = postsData
      .map((index) => {
        return `<div class="post" data-postid="${index.id}">
      <h3 class="post-title">${index.title}</h3>
      <div class="post-body">${index.body}</div>
      <button class="comment-button" data-postid="${index.id}">Read comments</button>
      <button class="author-button" data-userid="${index.userId}">Author info</button>
      <ul class="comments">
      </ul>
    </div>`;
      })
      .join("");
    postsEl.innerHTML = parsedData;
  }
};

//Authorel är elementet där information om författaren av posten är (längst till höger)
let authorEl = document.querySelector(".user-container");
document.addEventListener("click", async (e) => {
  //om knappen innehåller klassen author-button då är det en author knapp
  if (e.target.classList.contains("author-button")) {
    //data-userid på knappen så man kan identifiera vilken post som äger knapparna
    let authorId = e.target.dataset.userid;
    //hämta information med hjälp av userId t.ex https://jsonplaceholder.typicode.com/users/1
    let authorData = await getData(`users/${authorId}`);
    authorEl.innerHTML = `
    <div class="user">
    <h2>Author</h2>
    <div>${authorData.name}</div>
    <div>${authorData.email}</div>
    <div>Phone: ${authorData.phone}</div>
    <br />
    <div>Company: ${authorData.company.name}</div>
    </div>
  `;
  }

  //om klasslistan inkluderar comment-button då är det en komment knapp
  if (e.target.classList.contains("comment-button")) {
    //hämta vilken post knappen tillhör
    let postId = e.target.dataset.postid;
    //request till https://jsonplaceholder.typicode.com/comments
    postsData = await getData("comments");
    if (postsData) {
      //parsa data och insertAdjacenthtml med parsedData
      let parsedData = postsData
        .map((index) => {
          if (index.postId == postId) {
            return `<li class="comment">
            <div>${index.email}</div>
            <div>${index.body}</div>
              </li>`;
          }
        })
        .join("");

      let allPostsArray = document.querySelectorAll(".post");
      allPostsArray.forEach((index) => {
        if (index.dataset.postid == postId) {
          let commentsContainerEl = index.querySelector(".comments");
          if (!commentsContainerEl.querySelector(".comment"))
            commentsContainerEl.insertAdjacentHTML("beforeend", parsedData);
        }
      });
    }
  }
});
