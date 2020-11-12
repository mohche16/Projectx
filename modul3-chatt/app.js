(function () {
  // Get peer id (hash) from URL.
  let getPeerId = window.location.hash.split("#")[1];
  let dataConnection = null;
  let mediaConnection = null;
  // Event listener for click "Refresh list"
  const listPeersButtonEl = document.querySelector(".list-all-peers-button");
  const listAllPeersEl = document.querySelector(".peers");
  const btnForPeers = document.querySelector(".btnForPeers");
  const peerEl = document.querySelector(".peers");
  const videoOfThemEl = document.querySelector(".video-container.them video");
  const videoOfMeEl = document.querySelector(".video-container.me video");
  const theirVideoContainer = document.querySelector(".video-container.them");
  const startVideoButton = theirVideoContainer.querySelector(".start");
  const stopVideoButton = theirVideoContainer.querySelector(".stop");

  navigator.mediaDevices
    //camera/video!
    .getUserMedia({ audio: false, video: true })
    .then((stream) => {
      videoOfMeEl.muted = true;
      videoOfMeEl.srcObject = stream;
    });

  // Connect to Peer server
  peer = new Peer(getPeerId, {
    host: "glajan.com",
    port: 8443,
    path: "/myapp",
    secure: true,
    config: {
      iceServers: [
        { urls: ["stun:eu-turn7.xirsys.com"] },
        {
          username:
            "1FOoA8xKVaXLjpEXov-qcWt37kFZol89r0FA_7Uu_bX89psvi8IjK3tmEPAHf8EeAAAAAF9NXWZnbGFqYW4=",
          credential: "83d7389e-ebc8-11ea-a8ee-0242ac140004",
          urls: [
            "turn:eu-turn7.xirsys.com:80?transport=udp",
            "turn:eu-turn7.xirsys.com:3478?transport=udp",
            "turn:eu-turn7.xirsys.com:80?transport=tcp",
            "turn:eu-turn7.xirsys.com:3478?transport=tcp",
            "turns:eu-turn7.xirsys.com:443?transport=tcp",
            "turns:eu-turn7.xirsys.com:5349?transport=tcp",
          ],
        },
      ],
    },
  });

  // Print peer id on connection "open" event.
  peer.on("open", (id) => {
    const myPeerIdEl = document.querySelector(".my-peer-id");
    myPeerIdEl.innerHTML = id;
    getPeerId = id;
  });

  peer.on("error", (errorMessage) => {
    console.error(errorMessage);
  });

  peer.on("connection", (connection) => {
    dataConnection && dataConnection.close();
    dataConnection = connection;

    peer.on("call", (IncomingCall) => {
      mediaConnection && mediaConnection.close();

      startVideoButton.classList.remove("active");
      stopVideoButton.classList.add("active");

      navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then((myStream) => {
          IncomingCall.answer(myStream);
          mediaConnection = IncomingCall;
          mediaConnection.on("stream", (theirStream) => {
            videoOfThemEl.muted = true;
            videoOfThemEl.srcObject = theirStream;
          });
        });
    });

    const event = new CustomEvent("peer-changed", { detail: connection.peer });
    document.dispatchEvent(event);
  });

  listPeersButtonEl.addEventListener("click", () => {
    peer.listAllPeers((peers) => {
      console.log(peers);
      const listItems = peers
        .filter((peerId) => {
          if (peerId === getPeerId) return false;
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

  //Click on peer event listener
  peerEl.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("connect-button")) return;
    const clickedUserPeerId = target.innerText;

    dataConnection && dataConnection.close();
    //Connect to new peer
    dataConnection = peer.connect(clickedUserPeerId);

    dataConnection.on("open", () => {
      console.log("opened");
      //Create and dispatch event
      const event = new CustomEvent("peer-changed", {
        detail: clickedUserPeerId,
      });
      document.dispatchEvent(event);
    });
  });

  const sendButtonEl = document.querySelector(".send-new-message-button");
  const newMessageEl = document.querySelector(".new-message");
  const messagesEl = document.querySelector(".messages");

  newMessageEl.addEventListener("keyup", (e) => {
    if (newMessageEl.value === "") return;
    if (e.keyCode === 13 || e.type === "click") {
      if (dataConnection) {
        dataConnection.send(newMessageEl.value);
        printMessage(newMessageEl.value, "me");
        newMessageEl.value = "";
      }
    }
  });

  const printMessage = (text, who) => {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message", who);
    let todayTime = new Date();
    let messageTime =
      todayTime.getHours() +
      ":" +
      todayTime.getMinutes() +
      ":" +
      todayTime.getSeconds();
    messageEl.innerHTML = `<div>${text}<br>${messageTime}</div>`;
    messagesEl.append(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  sendButtonEl.addEventListener("click", (e) => {
    dataConnection && dataConnection.send(newMessageEl.value);
    printMessage(newMessageEl.value, "me");
    newMessageEl.value = "";
  });

  document.addEventListener("peer-changed", (e) => {
    console.log("Peer changed!");
    const peerId = e.detail;

    let clickedPeerEl = document.querySelector(
      `.connect-button.peerId-${peerId}`
    );
    let allPeerButtons = document
      .querySelectorAll(".connect-button.connected")
      .forEach((peerBtn) => peerBtn.classList.remove("connected"));

    clickedPeerEl.classList.add("connected");

    dataConnection.on("data", (textMessage) => {
      printMessage(textMessage, "them");
    });

    theirVideoContainer.querySelector(".name").innerText = peerId;
    theirVideoContainer.classList.add("connected");
    theirVideoContainer.querySelector(".start").classList.add("active");
    theirVideoContainer.querySelector(".stop").classList.remove("active");
  });
  //start call with remote peer.
  startVideoButton.addEventListener("click", () => {
    startVideoButton.classList.remove("active");
    stopVideoButton.classList.add("active");
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((myStream) => {
        mediaConnection && mediaConnection.close();
        const theirPeerId = dataConnection.peer;
        mediaConnection = peer.call(theirPeerId, myStream);
        mediaConnection.on("stream", (theirStream) => {
          videoOfThemEl.muted = true;
          videoOfThemEl.srcObject = theirStream;
        });
      });
  });
  //stop video click
  stopVideoButton.addEventListener("click", () => {
    stopVideoButton.classList.remove("active");
    startVideoButton.classList.add("active");
    mediaConnection && mediaConnection.close();
  });
})();
