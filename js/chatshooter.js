var cswebsocket;
let leaders = [];
let leaderobj = {};
function runChatShooter() {
  cschatConnect();
  log("Starting up Chat-Shooter MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 442676,
    sharecode: "npzzymlb"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => csgoLive());
  });

  client.on("message", data => {
    //log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    client.broadcastEvent({
      scope: ["participant:" + participant.sessionID],
      data: {
        type: "startingoptions",

        leaders: leaders
      }
    });
  });
}
// participantID: "9f750313-c2be-481d-ac43-82450f7a2d44"
// input:
// controlID: "points"
// event: "mousedown"
// point: 1data.message.meta.censored
// id: 1578778057548
function csgoLive() {
  // console.log("doingthis");
  client.state.getControl("points").on("mousedown", clickEvent => {
    console.log(clickEvent);
    let username = client.state.getParticipants().get(clickEvent.participantID)
      .username;
    if (leaderobj[username] == null) {
      leaderobj[username] = 1;
    } else {
      leaderobj[username] = leaderobj[username] + 1;
    }
  });
  client.ready();
  setInterval(updateLeaders, 5000);
}

function updateLeaders() {
  leaders = [];
  Object.keys(leaderobj).forEach(key => {
    leaders.push({ username: key, points: leaderobj[key] });
  });
  client.broadcastEvent({
    scope: ["everyone"],
    data: {
      type: "updateleaderboard",
      leaders: leaders
    }
  });
}

// function addText(text, username, usercolor, avatarURL, timestamp) {
function chatShooterReset() {
  leaderobj = {};
  updateLeaders();
  log("Resetting Scores!");
}

function cschatConnect() {
  log("Connecting to chat!");

  $.ajax({
    url: "https://mixer.com/api/v1/chats/" + data.channelID,
    headers: { Authorization: "Bearer " + data.access_token },
    success: result => {
      console.log(result);
      data.authkey = result.authkey;
      cswebsocket = new WebSocket(
        result.endpoints[0] + "?client_id=" + clientid
      );
      cswebsocket.onopen = () => {
        log("Connected to WebSocket, starting Auth");
        let authJSON = {
          type: "method",
          method: "auth",
          arguments: [data.channelID, data.userID, data.authkey],
          id: 0
        };
        console.log(authJSON);
        cswebsocket.send(JSON.stringify(authJSON));
      };

      cswebsocket.onmessage = function(event) {
        console.log(event);

        let messageInfo = JSON.parse(event.data);
        console.log(messageInfo);
        if (messageInfo.data.authenticated == true) {
          log("Connected to Chat!");
        }
        switch (messageInfo.event) {
          case "ChatMessage":
            let dropit = false;
            if (messageInfo.data.message.meta !== undefined) {
              console.log("Meta tag here");
              if (
                messageInfo.data.message.meta.censored == true ||
                messageInfo.data.message.meta.whisper == true
              ) {
                dropit = true;
              }
            }
            if (!dropit) {
              console.log("Firing Message!");
              log("Got message from: " + messageInfo.data.user_name);
              client.broadcastEvent({
                scope: ["everyone"],
                data: {
                  type: "addtext",
                  text: deEmojiMsg(messageInfo.data.message.message),
                  username: messageInfo.data.user_name,
                  usercolor: findColor(messageInfo.data.user_roles),
                  avatarURL: messageInfo.data.user_avatar,
                  timestamp: Date.now()
                }
              });
            }
        }
      };
    }
  });
}

function deEmojiMsg(msgArray) {
  let finalMsg = "";
  msgArray.forEach(msg => {
    finalMsg += msg.text;
  });

  return finalMsg.replace(/(\r\n|\n|\r)/gm, "");
}

function findColor(roles) {
  return "white";
}
