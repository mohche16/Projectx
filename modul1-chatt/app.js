// Get peer id (hash) from URL.
let getPeerId = window.location.hash.split("#")[1];

// Connect to Peer server
peer = new Peer(getPeerId, {
  host: "glajan.com",
  port: 8443,
  path: "/myapp",
  secure: true,
});

// Print pear id on connection "open" event.
peer.on("open", (id) => {
  const myPeerIdEl = document.querySelector(".my-peer-id");
  myPeerIdEl.innerHTML = id;
});

// Event listener for click "Refresh list"
const listPeersButtonEl = document.querySelector(".list-all-peers-button");
const listAllPeersEl = document.querySelector(".peers");
const btnForPeers = document.querySelector(".btnForPeers");
const peerEl = document.querySelector(".peers");

listPeersButtonEl.addEventListener("click", () => {
  peer.listAllPeers((peers) => {
    console.log(peers);
    const listItems = peers
      .filter((peerId) => {
        if (peerId === peer._id) return false;
        return true;
      })

      .map((peers) => {
        return `
            <li>
                <button class="connect-button peerId-${peers}">${peers}
            </li>
            `;
      })
      .join("");

    listAllPeersEl.innerHTML = listItems;
  });
});

let dataConnection = null;
//Click on peer event listener
peerEl.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.classList.contains("connect-button")) return;
  const clickedUserPeerId = target.innerText;

  dataConnection && dataConnection.close();
  //Connect to new peer
  dataConnection = peer.connect(clickedUserPeerId);

  dataConnection.on("open", () => {
    //Create and dispatch event
    const event = new CustomEvent("peer-changed", {
      detail: clickedUserPeerId,
    });
    document.dispatchEvent(event);
  });
});

document.addEventListener("peer-changed", (e) => {
  const peerId = e.detail;

  let clickedPeerEl = document.querySelector(
    `.connect-button.peerId-${peerId}`
  );
  let allPeerButtons = document
    .querySelectorAll(".connect-button.connected")
    .forEach((peerBtn) => peerBtn.classList.remove("connected"));

  clickedPeerEl.classList.add("connected");
});
