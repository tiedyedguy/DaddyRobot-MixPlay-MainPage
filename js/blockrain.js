var brwebsocket;
let brleaders = [];
let brleaderobj = {};
function runBlockRain() {
  log("Starting up Blockrain MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 449618,
    sharecode: "n3qu21bj"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => brgoLive());
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    client.broadcastEvent({
      scope: ["participant:" + participant.sessionID],
      data: {
        type: "startingoptions",
        leaders: brleaders
      }
    });
  });
}

function brgoLive() {
  // console.log("doingthis");
  client.state.getControl("points").on("mousedown", clickEvent => {
    console.log(clickEvent);
    let username = client.state.getParticipants().get(clickEvent.participantID)
      .username;
    if (brleaderobj[username] == null) {
      brleaderobj[username] = clickEvent.input.score;
    } else {
      if (brleaderobj[username] < clickEvent.input.score) {
        brleaderobj[username] = clickEvent.input.score;
      }
    }
  });
  client.ready();
  setInterval(updateBRLeaders, 5000);
}

function updateBRLeaders() {
  brleaders = [];
  Object.keys(brleaderobj).forEach(key => {
    brleaders.push({ username: key, points: brleaderobj[key] });
  });
  client.broadcastEvent({
    scope: ["everyone"],
    data: {
      type: "updateleaderboard",
      leaders: brleaders
    }
  });
}

// function addText(text, username, usercolor, avatarURL, timestamp) {
function brReset() {
  brleaderobj = {};
  updateBRLeaders();
  log("Resetting Scores!");
}
