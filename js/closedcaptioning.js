function runClosedCaptioning() {
  log("Starting up Closed Captions MixPlay!");

  client.open({
    authToken: data.access_token,
    versionId: 451199,
    sharecode: "knebwg4n"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => ccgoLive());
  });

  client.on("message", data => {
    // log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    // client.broadcastEvent({
    //   scope: ["participant:" + participant.sessionID],
    //   data: {
    //     type: "startingoptions",

    //     socials: data.social
    //   }
    // });
  });
}

function ccgoLive() {
  client.ready();
}

// <script type="text/javascript">
//   var cc = document.getElementById("cc-text");
//   var button = document.getElementById("cc-button");

//   var recognizing = false;

//   var recognition = new webkitSpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = true;

//   recognition.onstart = function() {
//     recognizing = true;
//   };

//   recognition.onerror = function(event) {};
//   recognition.onend = function() {
//     recognizing = false;
//   };

//   recognition.onresult = function(event) {
//     for (var i = event.resultIndex; i < event.results.length; ++i) {
//       if (event.results[i][0].confidence > 0.4) {
//         cc.innerHTML = capitalize(event.results[i][0].transcript);
//       }
//     }
//   };

//   function capitalize(s) {
//     var first_char = /\S/;
//     return s.replace(first_char, function(m) {
//       return m.toUpperCase();
//     });
//   }

//   function toggleSpeechRecognition(event) {
//     if (recognizing) {
//       recognition.stop();
//       cc.style.display = "none";
//       button.style.display = "inline-block";
//       return;
//     } else {
//       cc.style.display = "inline-block";
//       button.style.display = "none";
//       recognition.start();
//     }
//   }
// </script>
