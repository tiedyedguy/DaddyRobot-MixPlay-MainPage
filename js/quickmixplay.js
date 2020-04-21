function runQuickMixPlay() {
  log("Starting up Quick MixPlay!");

  //PUT YOUR VERSION ID IN HERE.
  client.open({
    authToken: data.access_token,
    versionId: 346629,
    sharecode: "6cdfwzn6",
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => quickgoLive());
  });

  client.on("message", (data) => {
    // log(data);
  });

  client.state.on("participantJoin", (participant) => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
  });
}

function quickgoLive() {
  client.ready();
}
