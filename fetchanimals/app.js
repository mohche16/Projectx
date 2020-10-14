let dogApi_Url = "https://dog.ceo/api/breeds/image/random";
let catApi_Url = "https://aws.random.cat/meow";
let foxApi_Url = "https://randomfox.ca/floof/";

let dogImage_Url = "";
let catImage_Url = "";
let foxImage_Url = "";

let form_element = document.querySelector(".djur-form");
let dropdown_element = document.querySelector(".djur-dropdrown");
let image_element = document.querySelector(".displayedimage");
let favorites_element = document.querySelector(".favorites-list");

window.onload = () => {
  fetchDog();
  fetchCat();
  fetchFox();
};

async function fetchDog() {
  await fetch(dogApi_Url)
    .then((response) => response.json())
    .then((dogObject) => (dogImage_Url = dogObject.message));
}

async function fetchCat() {
  await fetch(catApi_Url)
    .then((response) => response.json())
    .then((catObject) => (catImage_Url = catObject.file));
}

async function fetchFox() {
  await fetch(foxApi_Url)
    .then((response) => response.json())
    .then((foxObject) => (foxImage_Url = foxObject.image));
}

let displayImage = (url) => {
  image_element.src = url;
};

form_element.addEventListener("submit", (e) => {
  e.preventDefault();
  let animal_picked =
    dropdown_element.options[dropdown_element.selectedIndex].value;

  if (animal_picked == "katt") {
    fetchCat();
    displayImage(catImage_Url);
  }
  if (animal_picked == "hund") {
    fetchDog();
    displayImage(dogImage_Url);
  }
  if (animal_picked == "rav") {
    fetchFox();
    displayImage(foxImage_Url);
  }
});

document.addEventListener("click", (e) => {
  let element = e.target;
  if (element.classList.contains("displayedimage")) {
    favorites_element.insertAdjacentHTML(
      "beforeend",
      `<li>
    <img
      src=${element.src}
      height="70%"
      width="70%"
    />
  </li>`
    );
  }
});
