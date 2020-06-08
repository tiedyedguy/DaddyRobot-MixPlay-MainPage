let overlayImages = [
  // {
  //   url:
  //     "https://freetwitchoverlays.com/wp-content/uploads/edd/2019/09/master.jpg",
  // },
  // {
  //   url:
  //     "https://cdn.streamelements.com/uploads/03d52c7b-d5b8-4d6b-9c06-4fdd43ac7684.png",
  //   location: "full",
  // },
  // {
  //   url: "https://media.giphy.com/media/nNxT5qXR02FOM/giphy.gif",
  //   location: "CR",
  // },
];
let overlayBrowserSources = [
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "UL",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "UC",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "UR",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "CL",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "C",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "CR",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "LL",
  // },
  // {
  //   url: "https://streamlabs.com/alert-box/v3/6D37C86BE85E7D75CB75",
  //   location: "LC",
  // },
  // {
  //   url: "https://control.streamjar.tv/overlay/15952ae27e927bf837346922d2969e26/2",
  //   location: "LR",
  // },
  {
    url:
      "https://streamelements.com/overlay/5ec69656c3cd293676d495ba/lhpDmoHqete4pDtISPRzvs_9mP1mfW6u8vtpJtvDPGW0Ht-F",
    location: "full",
  },
  // { url: "https://pixel.chat/80799171/E0CSep68Bnfu0Qo", location: "full" },
];

function runOverlay() {
  log("Starting up Overlay MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 470107,
    sharecode: "vaxeu4oq",
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => overlaygoLive());
  });

  client.state.on("participantJoin", (participant) => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    client.broadcastEvent({
      scope: ["participant:" + participant.sessionID],
      data: {
        type: "options",
        images: overlayImages,
        browsersources: overlayBrowserSources,
      },
    });
  });
}

function overlaygoLive() {
  client.ready();
}

function overlaySendOverlay() {
  client.broadcastEvent({
    scope: ["everyone"],
    data: {
      type: "options",
      images: overlayImages,
      browsersources: overlayBrowserSources,
    },
  });
}
