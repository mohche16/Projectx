/*Alla länkar som ska fetchas senare i koden*/
const dogApi_Url = "https://dog.ceo/api/breeds/image/random";
const catApi_Url = "https://aws.random.cat/meow";
const foxApi_Url = "https://randomfox.ca/floof/";

/*Variablar som innehåller endast urlen till bilden från parsad JSON objekt*/
let dogImage_Url = "";
let catImage_Url = "";
let foxImage_Url = "";

/*Alla våra HTML element som vi kommer arbeta med*/
const form_element = document.querySelector(".djur-form");
const dropdown_element = document.querySelector(".djur-dropdrown");
const image_element = document.querySelector(".displayedimage");
const favorites_element = document.querySelector(".favorites-list");

//Sätter dogImage_Url till värdet från parsad JSON Objekt
async function fetchDog() {
  await fetch(dogApi_Url)
    .then((response) => response.json())
    .then((dogObject) => (dogImage_Url = dogObject.message));
}

//Sätter catImage_Url till värdet från parsad JSON Objekt
async function fetchCat() {
  await fetch(catApi_Url)
    .then((response) => response.json())
    .then((catObject) => (catImage_Url = catObject.file));
}

//Sätter foxImage_URL till värdet från parsad JSON Objekt
async function fetchFox() {
  await fetch(foxApi_Url)
    .then((response) => response.json())
    .then((foxObject) => (foxImage_Url = foxObject.image));
}

/*Sätter src på <img> i vår HTML till valda värdet*/
let displayImage = (url) => {
  image_element.src = url;
};


/*Submit event på formen som hanterar valda djuret och gör en action beroende på det
(kör fetchcat, fetchdog, fetchfox) sen displayImage funktionen*/
form_element.addEventListener("submit", async (e) => {
  e.preventDefault();
  let animal_picked =
    dropdown_element.options[dropdown_element.selectedIndex].value;

  if (animal_picked == "katt") {
    await fetchCat();
    displayImage(catImage_Url);
  }
  if (animal_picked == "hund") {
    await fetchDog();
    displayImage(dogImage_Url);
  }
  if (animal_picked == "rav") {
    await fetchFox();
    displayImage(foxImage_Url);
  }
});

/* Click event som kollar ifall objektet innehåller "displayedimage" klassen
vilket då innebär att det är IMG taggen vi vill ha
 och då kan man ta .src på objektet och spara det i vår lista
med flera <img> taggar
*/
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
      alt="favorite Image"
    />
  </li>`
    );
  }
});
