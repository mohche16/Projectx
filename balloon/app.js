// Vår balloon-container klass som används i HTML / CSS
const balloon_container = document.querySelector(".balloon-container");

// Antalet ballonger hemsidan ska generera
const balloon_count = 24;

// Text som visas när en ballong poppas
const balloonpop_text = "POP!";

window.onload = function () {
  for (i = 0; i < balloon_count; i++) {
    balloon_container.insertAdjacentHTML(
      "beforeend",
      `<div class="balloon">${balloonpop_text}</div>`
    );
  }
};

let isBalloonValidChecker = (element) => {
  if (
    element.classList.contains("balloon") &&
    !element.classList.contains("popped")
  ) {
    return true;
  } else {
    return false;
  }
};

let getAllPoppedBalloonsCount = () => {
  return document.querySelectorAll(".popped").length;
};

document.addEventListener("mouseover", (e) => {
  const element = e.target;
  if (isBalloonValidChecker(element)) {
    element.classList.add("popped");
    if (getAllPoppedBalloonsCount() == balloon_count) {
      balloon_container.innerHTML = "YAY!";
    }
  }
});
