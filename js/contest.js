var ctwebsocket;
let ctcountID = 0;
let ctlastupdate = 0;
let ctupdatetimer = 3000;
let ctjoining = false;
let autoInterval;
let contestJoinText =
  "The Contest has started! You have 30 seconds to type !join or to click on the MixPlay!";
let ctusers = [
  // {
  //   username: "tiedyedguy",
  //   avatar: "https://mixer.com/api/v1/users/80799171/avatar",
  // },
  // {
  //   username: "badmerc",
  //   avatar: "https://mixer.com/api/v1/users/46819651/avatar",
  // },
  // {
  //   username: "mytho",
  //   avatar: "https://mixer.com/api/v1/users/46251730/avatar",
  // },
  // {
  //   username: "Kirby_is_watching",
  //   avatar: "https://uploads.mixer.com/avatar/majlhz8f-56363970.jpg",
  // },
  // {
  //   username: "Le_Senegalais",
  //   avatar: "https://uploads.mixer.com/avatar/806n0e6g-61840959.jpg",
  // },
  // {
  //   username: "TexasHasFallen",
  //   avatar: "https://mixer.com/api/v1/users/12947171/avatar",
  // },
  // {
  //   username: "DeBruiser",
  //   avatar: "https://uploads.mixer.com/avatar/qlzk7745-69942354.jpg",
  // },
];

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

let waitingtogoagain = "";

function knockOneOutOfContest() {
  if (!ctjoining) {
    shuffleArray(ctusers);
    let loser = ctusers.pop();
    log(loser.username + " HAS BEEN ELIMINATED");
    if (ctusers.length == 1) {
      winnerWinner();
    } else {
      sendUpdate();
    }
  } else {
    log("Please wait until the contest close to start eliminating people!");
  }
}

function winnerWinner() {
  stopAutoFinishContest();
  log(ctusers[0].username + " IS THE WINNER!");
  ctwinner = ctusers[0].username;
  sendUpdate();
  let msg = {
    type: "method",
    method: "msg",
    arguments: ["@" + ctwinner + " HAS WON THE CONTEST!"],
    id: ctcountID,
  };
  ctwebsocket.send(JSON.stringify(msg));

  setTimeout(() => {
    ctusers = [];
    ctwinner = "";
    sendUpdate();
  }, 5000);
}

function autoFinishContest() {
  clearInterval(autoInterval);
  log("Starting Auto Contest!");
  autoInterval = setInterval(() => {
    knockOneOutOfContest();
  }, ctupdatetimer + 500);
}

function stopAutoFinishContest() {
  log("Stoping Auto Contest!");
  clearInterval(autoInterval);
}

function openContest() {
  ctcountID = ctcountID + 1;
  let msg = {
    type: "method",
    method: "msg",
    arguments: [contestJoinText],
    id: ctcountID,
  };
  ctwebsocket.send(JSON.stringify(msg));

  ctjoining = true;
  sendUpdate();
  log("THE CONTEST HAS OPENED!");

  setTimeout(() => {
    ctjoining = false;
    if (ctusers.length > 1) {
      ctcountID += 1;
      let msg = {
        type: "method",
        method: "msg",
        arguments: ["The contest is underway! No more joining allowed!!"],
        id: ctcountID,
      };
      ctwebsocket.send(JSON.stringify(msg));
      sendUpdate();
      log("THE CONTEST IS READY TO PLAY!");
    }
    if (ctusers.length == 1) {
      winnerWinner();
    } else {
      if (ctusers.length == 0) {
        ctcountID += 1;
        ctjoining = false;
        let msg = {
          type: "method",
          method: "msg",
          arguments: ["Awww, no one wants to play?!!"],
          id: ctcountID,
        };
        ctwebsocket.send(JSON.stringify(msg));
        sendUpdate();
        log("No one signed up!");
      }
    }
  }, 30000);
}

function sendUpdate() {
  //console.log("Trying to send update");
  if (Date.now() - ctlastupdate > ctupdatetimer) {
    //console.log("Sending update");
    ctlastupdate = Date.now();

    client.broadcastEvent({
      scope: ["everyone"],
      data: {
        type: "data",
        joining: ctjoining,
        users: ctusers,
        winner: ctwinner,
      },
    });
  } else {
    //console.log("Waiting on send");
    clearTimeout(waitingtogoagain);
    waitingtogoagain = setTimeout(() => {
      sendUpdate();
    }, ctupdatetimer);
  }
}

let ctwinner = "";

function runContest() {
  log("Starting up Contest MixPlay!");
  ctchatConnect();

  client.open({
    authToken: data.access_token,
    versionId: 466097,
    sharecode: "cltcur6e",
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => ctgoLive());
  });

  client.on("message", (data) => {
    // log(data);
  });

  client.state.on("participantJoin", (participant) => {
    //console.log(participant);
    log(participant.username + " joined the mixplay!");
    client.broadcastEvent({
      scope: ["participant:" + participant.sessionID],
      data: {
        type: "data",
        joining: ctjoining,
        users: ctusers,
        winner: ctwinner,
        myname: participant.username,
        anon: participant.anonymous,
      },
    });
  });
}

function joinContest(username, avatar) {
  //console.log("Trying to join contest");
  if (ctjoining) {
    //console.log("Contest is open!");
    if (!ctusers.some((user) => user.username === username)) {
      ctusers.push({ username: username, avatar: avatar });
      log(username + " joined the contest");
      //console.log(username + " joined the contest");
      whisperText = "You have joined the contest!";

      ctcountID = ctcountID + 1;
      let whisper = {
        type: "method",
        method: "whisper",
        arguments: [username, whisperText],
        id: ctcountID,
      };
      // smwebsocket.send(JSON.stringify(msg));
      ctwebsocket.send(JSON.stringify(whisper));
      sendUpdate();
    }
  }
}

function ctgoLive() {
  client.state.getControl("joincontest").on("mousedown", (clickEvent) => {
    //console.log(clickEvent);
    let user = client.state.getParticipants().get(clickEvent.participantID);
    //console.log(user);
    if (!user.anonymous) {
      joinContest(
        user.username,
        "https://mixer.com/api/v1/users/" + user.userID + "/avatar"
      );
    }
  });
  client.ready();
}

function ctchatConnect() {
  log("Connecting to chat!");
  $.ajax({
    url: "https://mixer.com/api/v1/chats/" + data.channelID,
    headers: { Authorization: "Bearer " + data.access_token },
    success: (result) => {
      data.authkey = result.authkey;
      ctwebsocket = new WebSocket(
        result.endpoints[0] + "?client_id=" + clientid
      );
      ctwebsocket.onopen = () => {
        log("Connected to WebSocket, starting Auth");
        let authJSON = {
          type: "method",
          method: "auth",
          arguments: [data.channelID, data.userID, data.authkey],
          id: 0,
        };

        ctwebsocket.send(JSON.stringify(authJSON));
      };

      ctwebsocket.onmessage = function (event) {
        //console.log(event);
        let messageInfo = JSON.parse(event.data);
        if (messageInfo.data.authenticated == true) {
          log("Connected to Chat!");
        }
        if (messageInfo.event == "ChatMessage") {
          messageInfo.data.message.message.forEach((msg) => {
            if (msg.type == "text" && msg.data.includes("!join")) {
              if (msg.data != contestJoinText) {
                joinContest(
                  messageInfo.data.user_name,
                  messageInfo.data.user_avatar
                );
              }
            }
          });
        }
      };
    },
  });
}
