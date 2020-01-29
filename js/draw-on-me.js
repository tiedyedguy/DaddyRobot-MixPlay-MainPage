function runDrawOnMe() {
  log("Starting up Draw-On-Me MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 443195,
    sharecode: "rqc35x8i"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => domgoLive());
  });

  client.on("message", data => {
    // log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
  });
}

function domgoLive() {
  client.ready();
}
