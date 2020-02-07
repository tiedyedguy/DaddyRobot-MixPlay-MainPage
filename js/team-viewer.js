var tvwebsocket;
let tvcountID = 0;
let teamdata = {};
function runTeamViewer() {
  log("Starting up Team Viewer MixPlay!");
  $.ajax({
    url: "https://mixer.com/api/v1/users/" + data.userID + "/teams",

    success: result => {
      result.forEach(team => {
        if (team.logoUrl == null) {
          team.logoUrl =
            "https://mixer.com/_latest/assets/images/teams/logo.png";
        }
        let htmlString =
          "<img src='" +
          team.logoUrl +
          "' onclick='setTeam(\"" +
          team.token +
          "\")'>";
        $("#myteams").append(htmlString);
      });
    }
  });

  tvchatConnect();

  client.open({
    authToken: data.access_token,
    versionId: 448109,
    sharecode: "o2ir2pjj"
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => tvgoLive());
  });

  client.on("message", data => {
    // log(data);
  });

  client.state.on("participantJoin", participant => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    console.log(teamdata);
    if (teamdata.team && teamdata.team.name) {
      log("Sending them team info:" + teamdata.team.name);
      client.broadcastEvent({
        scope: ["participant:" + participant.sessionID],
        data: {
          type: "startingoptions",
          teamdata: teamdata
        }
      });
    } else {
      log("No team loaded to send them.");
    }
  });
}
let waiting = 0;

function setTeam(team) {
  $("#team").val(team);
  tvSendTeam();
}
function tvSendTeam() {
  //get team uint
  $.ajax({
    url: "https://mixer.com/api/v1/teams/" + $("#team").val(),
    headers: { Authorization: "Bearer " + data.access_token },
    success: result => {
      console.log(result);
      teamdata.team = {};
      log("Got Team name of: " + result.name);
      teamdata.team.name = result.name;
      teamdata.team.img = result.logoUrl;
      teamdata.team.token = result.token;
      teamdata.team.info = result.description;
      if (result.logoUrl == null) {
        teamdata.team.img =
          "https://mixer.com/_latest/assets/images/teams/logo.png";
      }
      teamdata.members = [];
      $.ajax({
        url: "https://mixer.com/api/v1/teams/" + result.id + "/users",
        data: {
          limit: 100
        },
        headers: { Authorization: "Bearer " + data.access_token }
      }).done((members, statusText, xhr) => {
        let pages = Math.floor(xhr.getResponseHeader("x-total-count") / 100);

        waiting = pages;
        log("Number of members: " + xhr.getResponseHeader("x-total-count"));

        for (member of members) {
          teamdata.members.push({
            avatar: member.avatarUrl,
            name: member.username,
            channelinfo: member.bio
          });
        }
        if (waiting == 0) {
          log("Sending to MixPlay!");
          client.broadcastEvent({
            scope: ["everyone"],
            data: {
              type: "startingoptions",
              teamdata: teamdata
            }
          });
        }

        for (page = 1; page < pages + 1; page++) {
          $.ajax({
            url: "https://mixer.com/api/v1/teams/" + result.id + "/users",
            data: {
              limit: 100,
              page: page,
              noCount: true
            },
            headers: { Authorization: "Bearer " + data.access_token }
          }).done((members, statusText, xhr) => {
            console.log("Got page: " + page);
            for (member of members) {
              teamdata.members.push({
                avatar: member.avatarUrl,
                name: member.username,
                channelinfo: member.bio
              });
            }
            waiting--;
            if (waiting <= 0) {
              log("Sending to MixPlay!");
              client.broadcastEvent({
                scope: ["everyone"],
                data: {
                  type: "startingoptions",
                  teamdata: teamdata
                }
              });
            }
          });
        }
      });
    }
  });
}

function tvgoLive() {
  client.state.getControl("team").on("mousedown", clickEvent => {
    console.log(clickEvent);
    let username = client.state.getParticipants().get(clickEvent.participantID)
      .username;

    log(username + " click on " + clickEvent.input.member);
    let whisperText = "";
    if (clickEvent.input.member == "^^^TEAM^^^") {
      whisperText =
        "Check out " +
        teamdata.team.name +
        "'s page at https://mixer.com/team/" +
        teamdata.team.token;
    } else {
      whisperText = "Click to Check out @" + clickEvent.input.member + "!";
    }

    tvcountID = tvcountID + 1;
    let whisper = {
      type: "method",
      method: "whisper",
      arguments: [username, whisperText],
      id: tvcountID
    };
    tvcountID = tvcountID + 1;

    console.log(whisper);

    tvwebsocket.send(JSON.stringify(whisper));
  });

  client.ready();
}

function tvchatConnect() {
  log("Connecting to chat!");
  $.ajax({
    url: "https://mixer.com/api/v1/chats/" + data.channelID,
    headers: { Authorization: "Bearer " + data.access_token },
    success: result => {
      console.log(result);
      data.authkey = result.authkey;
      tvwebsocket = new WebSocket(
        result.endpoints[0] + "?client_id=" + clientid
      );
      tvwebsocket.onopen = () => {
        log("Connected to WebSocket, starting Auth");
        let authJSON = {
          type: "method",
          method: "auth",
          arguments: [data.channelID, data.userID, data.authkey],
          id: 0
        };
        console.log(authJSON);
        tvwebsocket.send(JSON.stringify(authJSON));
      };

      tvwebsocket.onmessage = function(event) {
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
