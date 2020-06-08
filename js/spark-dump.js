var sdwebsocket;
let sdcountID = 0;
function runSparkDump() {
  log("Starting up Spark Dump MixPlay!");
  sdchatConnect();

  client.open({
    authToken: data.access_token,
    versionId: 473848,
    sharecode: "q6i5qdjk",
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => sdgoLive());
  });

  client.on("message", (data) => {
    // log(data);
  });

  client.state.on("participantJoin", (participant) => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
  });
}

function sparksDumped(numberOfSparks, username, avatar) {
  client.broadcastEvent({
    scope: ["everyone"],
    data: {
      type: "dump",
      numberOfSparks,
      username,
      avatar,
    },
  });
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sdgoLive() {
  client.state.getControl("dump").on("mousedown", (clickEvent) => {
    console.log(clickEvent);
    let user = client.state.getParticipants().get(clickEvent.participantID);
    let username = user.username;
    let control = client.state.getControl(username + clickEvent.input.sparks);

    if (control == undefined) {
      client
        .createControls({
          sceneID: "default",
          controls: [
            {
              controlID: username + clickEvent.input.sparks,
              cost: parseInt(clickEvent.input.sparks),
              kind: "button",
            },
          ],
        })
        .then((response) => {
          //          this.client.synchronizeScenes().then(() => {
          client.state
            .getControl(username + clickEvent.input.sparks)
            .on("mousedown", dumpHandler);
          client.broadcastEvent({
            scope: ["participant:" + clickEvent.participantID],
            data: {
              type: "controlready",
              name: username + clickEvent.input.sparks,
              sparks: clickEvent.input.sparks,
            },
            //          });
          });
        });
    } else {
      client.broadcastEvent({
        scope: ["participant:" + clickEvent.participantID],
        data: {
          type: "controlready",
          name: username + clickEvent.input.sparks,
          sparks: clickEvent.input.sparks,
        },
        //          });
      });
    }
  });

  client.ready();
}

function dumpHandler(event) {
  console.log(event);
  let user = client.state.getParticipants().get(event.participantID);
  let username = user.username;
  client.captureTransaction(event.transactionID).then(() => {
    sparksDumped(
      event.input.sparks,
      username,
      "https://mixer.com/api/v1/users/" + user.userID + "/avatar"
    );
    log(username + " dumped " + event.input.sparks + " sparks!!");
    msgText =
      "Thanks for the " +
      numberWithCommas(event.input.sparks) +
      " sparks @" +
      username +
      "!!!";

    let msg = {
      type: "method",
      method: "msg",
      arguments: [msgText],
      id: sdcountID,
    };
    sdcountID = sdcountID + 1;
    console.log(msg);
    sdwebsocket.send(JSON.stringify(msg));
  });
}

function sdchatConnect() {
  log("Connecting to chat!");
  $.ajax({
    url: "https://mixer.com/api/v1/chats/" + data.channelID,
    headers: { Authorization: "Bearer " + data.access_token },
    success: (result) => {
      console.log(result);
      data.authkey = result.authkey;
      sdwebsocket = new WebSocket(
        result.endpoints[0] + "?client_id=" + clientid
      );
      sdwebsocket.onopen = () => {
        log("Connected to WebSocket, starting Auth");
        let authJSON = {
          type: "method",
          method: "auth",
          arguments: [data.channelID, data.userID, data.authkey],
          id: 0,
        };
        console.log(authJSON);
        sdwebsocket.send(JSON.stringify(authJSON));
      };

      sdwebsocket.onmessage = function (event) {
        console.log(event);

        let messageInfo = JSON.parse(event.data);
        console.log(messageInfo);
        if (messageInfo.data.authenticated == true) {
          log("Connected to Chat!");
        }
      };
    },
  });
}
