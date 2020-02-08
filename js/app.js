//Get the interactive class
const client = new interactive.GameClient();

//Set up scopes for all mixplays, doesn't change based on mixplay, maybe it should.
const scopes =
  "interactive:play interactive:robot:self chat:chat chat:connect chat:whisper";
const clientid = "1871c44332cf8cf83922f4bd891aff625107a7c2a178239b";

//This data object will hold everything, and I mean it.
let data = {
  client_id: clientid,
  scope: scopes
};

//There are a few "main" sections, each of them slide like this one. THis is the first click of Let's go.
function letsgo() {
  $("#welcome").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#selectmixplay")
      .show("slide", { direction: "right" }, 250)
      .show();
  }, 500);
}

//The onclick function of the mixplays.  Basically the switch statement is (Does this mixplay have settings that we need to do before it loads)
function pickmixplay(mixplay) {
  //This IF statement is to stop propagation if they click on the mixer user name of last used.
  //It bubbles up to the div that calls this and that was annoying.
  if (!$(event.target).hasClass("mixeruser")) {
    data.mixplay = mixplay;
    $(".ms").hide();
    $("." + mixplay).show();
    switch (mixplay) {
      case "chat-shooter":
      case "social-me":
      case "test-stuff":
      case "team-viewer":
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
}

//Clicking back from the inital settings to go back to pick a mixplay.
function backtomixplaypick() {
  $("#mixplaysettings").hide("slide", { direction: "right" }, 250);
  setTimeout(() => {
    $("#selectmixplay")
      .show("slide", { direction: "left" }, 250)
      .show();
  }, 500);
}

//Click on back from the authentication to the settings.
//TODO, make this go back to mixplay if it is a mixplay that doesn't need inital settings
function backtomixplaysettings() {
  $("#startingblock").hide("slide", { direction: "right" }, 250);
  setTimeout(() => {
    $("#mixplaysettings")
      .show("slide", { direction: "left" }, 250)
      .show();
  }, 500);
}

//Click on the button to go from intial settings to oauth.
function oauthtime() {
  $("#mixplaysettings").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#startingblock")
      .show("slide", { direction: "right" }, 250)
      .show();
  }, 500);
}

//Starting oauth! oh boy.
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

//After we get the code from mixer we slide to the log page.
//This is the function that waits until we get a result of the login.
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

//We got the login OK, time to push forward.
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

//Our simple logging function just adds a row to a table.
//TODO: Probably should not let the table grow forever.
function log(thing) {
  var d = new Date();
  $("#logtablebody").prepend(
    "<tr><td>" + d.toLocaleString() + " / " + thing + "</td></tr>"
  );
}

//Two things, 1st send data to my page to keep simple stats.
//2nd, is run the mixplay specific function that fires it off.
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
    case "team-viewer":
      runTeamViewer();
      break;
  }
}

//When the document is ready, let's load in the stats of usage!
$(document).ready(() => {
  $.get("https://ask.daddyrobot.live/mixplaycounts", result => {
    console.log(result);
    Object.keys(result).forEach(mixplay => {
      console.log(mixplay);
      $("#" + mixplay + "-mps").html(
        "Current Usage: <span class='mps-usage'>" +
          result[mixplay].last24 +
          "</span> Latest User: <a class='mixeruser' target='_blank' href='https://mixer.com/" +
          result[mixplay].latestuser +
          "'>" +
          result[mixplay].latestuser +
          "</a>"
      );
    });
  });
});
