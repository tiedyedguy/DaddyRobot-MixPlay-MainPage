var smwebsocket;
let countID = 0;
function runSocialMe() {
  log("Starting up Social-Me MixPlay!");
  smchatConnect();

  client.open({
    authToken: data.access_token,
    versionId: 443564,
    sharecode: "9y0y59m8"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => smgoLive());
  });

  client.on("message", data => {
    // log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    client.broadcastEvent({
      scope: ["participant:" + participant.sessionID],
      data: {
        type: "startingoptions",

        socials: data.social
      }
    });
  });
}

function smgoLive() {
  client.state.getControl("social").on("mousedown", clickEvent => {
    console.log(clickEvent);
    let username = client.state.getParticipants().get(clickEvent.participantID)
      .username;

    log(username + " click on " + clickEvent.input.social);
    msgText =
      "Check out my " +
      clickEvent.input.social +
      " page: " +
      data.social[clickEvent.input.social];
    whisperText =
      "Thanks for your support!  Here is my " +
      clickEvent.input.social +
      " link: " +
      data.social[clickEvent.input.social];
    let msg = {
      type: "method",
      method: "msg",
      arguments: [msgText],
      id: countID
    };
    countID = countID + 1;
    let whisper = {
      type: "method",
      method: "whisper",
      arguments: [username, whisperText],
      id: countID
    };
    countID = countID + 1;
    console.log(msg);
    console.log(whisper);

    // smwebsocket.send(JSON.stringify(msg));
    smwebsocket.send(JSON.stringify(whisper));
  });
  console.log(data.social);
  client.ready();
}

function smchatConnect() {
  log("Connecting to chat!");
  $.ajax({
    url: "https://mixer.com/api/v1/chats/" + data.channelID,
    headers: { Authorization: "Bearer " + data.access_token },
    success: result => {
      console.log(result);
      data.authkey = result.authkey;
      smwebsocket = new WebSocket(
        result.endpoints[0] + "?client_id=" + clientid
      );
      smwebsocket.onopen = () => {
        log("Connected to WebSocket, starting Auth");
        let authJSON = {
          type: "method",
          method: "auth",
          arguments: [data.channelID, data.userID, data.authkey],
          id: 0
        };
        console.log(authJSON);
        smwebsocket.send(JSON.stringify(authJSON));
      };

      smwebsocket.onmessage = function(event) {
        console.log(event);

        let messageInfo = JSON.parse(event.data);
        console.log(messageInfo);
        if (messageInfo.data.authenticated == true) {
          log("Connected to Chat!");
        }
      };
    }
  });
}
