const client = new interactive.GameClient();
const scopes =
  "interactive:play interactive:robot:self chat:chat chat:connect chat:whisper";
const clientid = "1871c44332cf8cf83922f4bd891aff625107a7c2a178239b";

let data = {
  client_id: clientid,
  scope: scopes
};

function letsgo() {
  $("#welcome").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#selectmixplay")
      .show("slide", { direction: "right" }, 250)
      .show();
  }, 500);
}

function pickmixplay(mixplay) {
  data.mixplay = mixplay;
  $(".ms").hide();
  $("." + mixplay).show();
  switch (mixplay) {
    case "chat-shooter":
    case "social-me":
    case "test-stuff":
    case "draw-on-me":
      $("#selectmixplay").hide("slide", { direction: "left" }, 250);
      setTimeout(() => {
        $("#startingblock")
          .show("slide", { direction: "right" }, 250)
          .show();
      }, 500);
      break;
    default:
      $("#selectmixplay").hide("slide", { direction: "left" }, 250);
      setTimeout(() => {
        $("#mixplaysettings")
          .show("slide", { direction: "right" }, 250)
          .show();
      }, 500);
  }
}

function backtomixplaypick() {
  $("#mixplaysettings").hide("slide", { direction: "right" }, 250);
  setTimeout(() => {
    $("#selectmixplay")
      .show("slide", { direction: "left" }, 250)
      .show();
  }, 500);
}

function backtomixplaysettings() {
  $("#startingblock").hide("slide", { direction: "right" }, 250);
  setTimeout(() => {
    $("#mixplaysettings")
      .show("slide", { direction: "left" }, 250)
      .show();
  }, 500);
}

function oauthtime() {
  $("#mixplaysettings").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#startingblock")
      .show("slide", { direction: "right" }, 250)
      .show();
  }, 500);
}

function startOauth() {
  console.log("Starting OAuth");
  $.post("https://mixer.com/api/v1/oauth/shortcode", data, result => {
    data.code = result.code;
    data.handle = result.handle;
    // console.log(result);
    window.open(
      "https://mixer.com/go?code=" + data.code,
      "popup",
      "width=575,height=650"
    );
    waitforgo();
  });
}

function waitforgo() {
  $("#startingblock").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#mixplaycontrols")
      .show("slide", { direction: "right" }, 250)
      .show();
  }, 500);

  log("Waiting for you to login...");
  $.ajax("https://mixer.com/api/v1/oauth/shortcode/check/" + data.handle)
    .done((result, statusText, xhr) => {
      // console.log(xhr);
      switch (xhr.status) {
        case 204:
          setTimeout(waitforgo, 2000);
          break;
        case 200:
          // console.log(result.code);
          data.codetwo = result.code;
          finalstep();
      }
    })
    .fail((xhr, textStatus) => {
      switch (xhr.status) {
        case 403:
          // console.log("Why you say no?");
          alert("You said no, now you have to reload.");
          break;
        case 404:
          // console.log("You waited too long");
          alert("You took too long, now you have to reload.");
          break;
      }
    });
}

function finalstep() {
  log("getting stuff from mixer, almost ready.");
  // console.log(data);
  $.post(
    "https://mixer.com/api/v1/oauth/token",
    {
      client_id: clientid,
      code: data.codetwo,
      grant_type: "authorization_code"
    },
    result => {
      // console.log(result);
      data.access_token = result.access_token;
      $.ajax({
        url: "https://mixer.com/api/v1/users/current",
        headers: { Authorization: "Bearer " + data.access_token },
        success: result => {
          console.log(result);
          data.channelID = result.channel.id;

          data.social = result.social;
          data.userID = result.id;
          data.username = result.username;
          run(data.mixplay);
        }
      });
    }
  );
}

function log(thing) {
  var d = new Date();
  $("#logtablebody").prepend(
    "<tr><td>" + d.toLocaleString() + " / " + thing + "</td></tr>"
  );
}

function run(mixplay) {
  console.log("running mixplay: " + mixplay);
  $.get("https://ask.daddyrobot.live/mixplayed", {
    username: data.username,
    mixplay: mixplay
  });
  switch (mixplay) {
    case "chat-shooter":
      runChatShooter();
      break;
    case "draw-on-me":
      runDrawOnMe();
      break;
    case "social-me":
      runSocialMe();
      break;
    case "test-stuff":
      runTestStuff();
      break;
  }
}
