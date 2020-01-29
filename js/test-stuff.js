function runTestStuff() {
  log("Starting up Test Stuff MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 446666,
    sharecode: "joc27jkf"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => tsgoLive());
  });

  client.on("message", data => {
    // log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
  });
}

function tsgoLive() {
  client.ready();
}
