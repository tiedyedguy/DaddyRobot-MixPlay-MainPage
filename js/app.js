//Get the interactive class
const client = new interactive.GameClient();
var useSavedData = false;
var skipInitialSettings = false;

//Set up scopes for all mixplays, doesn't change based on mixplay, maybe it should.
const scopes =
  "interactive:play channel:follow:self interactive:robot:self chat:chat chat:connect chat:whisper";
const clientid = "1871c44332cf8cf83922f4bd891aff625107a7c2a178239b";

//This data object will hold everything, and I mean it.
let data = {
  client_id: clientid,
  scope: scopes,
};

//There are a few "main" sections, each of them slide like this one. THis is the first click of Let's go.
function letsgo() {
  $("#welcome").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#selectmixplay").show("slide", { direction: "right" }, 250).show();
  }, 500);
  checkForSavedLogin();
}

//Checking to see if they have saved their login before!
function checkForSavedLogin() {
  console.log("Looking for saved data");
  let savedData = window.localStorage.getItem("dr_data");
  if (savedData !== null) {
    $(".rememberme").hide();
    data = JSON.parse(savedData);
    useSavedData = true;
    $("#myname").text(data.username);
    console.log(data.token_expires);
    console.log(Date.now());
    if (data.token_expires < Date.now()) {
      refreshToken();
    }
  } else {
    $("#rememberd").hide();
  }
  console.log(savedData);
}

//Forget the saved login info
function ForgetMe() {
  window.localStorage.removeItem("dr_data");
  useSavedData = false;
  $(".rememberme").show();
  $("#rememberd").hide();
}

//Update AccessToken if expired by refreshToken
function refreshToken() {
  console.log("Refreshing the token");
  $.post("https://mixer.com/api/v1/oauth/token", {
    client_id: clientid,
    refresh_token: data.refresh_token,
    grant_type: "refresh_token",
  })
    .done((result) => {
      console.log(result);
      data.access_token = result.access_token;
      data.refresh_token = result.refresh_token;
      data.token_expires = Date.now() + 20599000;
    })
    .fail((error) => {
      ForgetMe();
    });
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
      case "spark-donate":
      case "test-stuff":
      case "overlay":
      case "spark-dump":
      case "team-viewer":
      case "closed-captioning":
      case "draw-on-me":
      case "contest":
      case "blockrain":
        skipInitialSettings = true;
        $("#selectmixplay").hide("slide", { direction: "left" }, 250);
        setTimeout(() => {
          $("#startingblock").show("slide", { direction: "right" }, 250).show();
        }, 500);
        break;
      case "destiny2":
        skipInitialSettings = false;
        d2_anyDataHere();
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
    $("#selectmixplay").show("slide", { direction: "left" }, 250).show();
  }, 500);
}

//Click on back from the authentication to the settings.
//TODO, make this go back to mixplay if it is a mixplay that doesn't need inital settings
function backtomixplaysettings() {
  if (!skipInitialSettings) {
    $("#startingblock").hide("slide", { direction: "right" }, 250);
    setTimeout(() => {
      $("#mixplaysettings").show("slide", { direction: "left" }, 250).show();
    }, 500);
  } else {
    $("#startingblock").hide("slide", { direction: "right" }, 250);
    setTimeout(() => {
      $("#selectmixplay").show("slide", { direction: "left" }, 250).show();
    }, 500);
  }
}

//Click on the button to go from intial settings to oauth.
function oauthtime() {
  $("#mixplaysettings").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#startingblock").show("slide", { direction: "right" }, 250).show();
  }, 500);
}

//Starting oauth! oh boy.
function startOauth() {
  console.log("Starting OAuth");
  if (useSavedData) {
    getUserInfo();
  } else {
    $.post("https://mixer.com/api/v1/oauth/shortcode", data, (result) => {
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
  $("#startingblock").hide("slide", { direction: "left" }, 250);
  setTimeout(() => {
    $("#mixplaycontrols").show("slide", { direction: "right" }, 250).show();
  }, 500);
}

//After we get the code from mixer we slide to the log page.
//This is the function that waits until we get a result of the login.
function waitforgo() {
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
      grant_type: "authorization_code",
    },
    (result) => {
      console.log(result);
      data.access_token = result.access_token;
      data.refresh_token = result.refresh_token;
      data.token_expires = Date.now() + 20599000;

      getUserInfo();
    }
  );
}

function getUserInfo() {
  $.ajax({
    url: "https://mixer.com/api/v1/users/current",
    headers: { Authorization: "Bearer " + data.access_token },
    success: (result) => {
      console.log(result);
      data.channelID = result.channel.id;
      data.social = result.social;
      data.userID = result.id;
      checkForFollow();
      data.username = result.username;
      if ($("#rememberme").prop("checked") || useSavedData) {
        console.log("Remembering user");
        window.localStorage.setItem("dr_data", JSON.stringify(data));
      } else {
        window.localStorage.removeItem("dr_data");
      }
      run(data.mixplay);
    },
  });
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
    mixplay: mixplay,
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
    case "blockrain":
      runBlockRain();
      break;
    case "closed-captioning":
      runClosedCaptioning();
      break;
    case "destiny2":
      runDestiny2();
      break;
    case "contest":
      runContest();
      break;
    case "overlay":
      runOverlay();
      break;
    case "spark-dump":
      runSparkDump();
      break;
  }
}

//See if you are following DaddyRobot and if not, say something.
function checkForFollow() {
  $.get(
    "https://mixer.com/api/v1/channels/70637586/relationship?user=" +
      data.userID,
    (result) => {
      if (result.status.follows === null) {
        log(
          "<span id='followspan'>If you like this site, why not give DaddyRobot a <button class='follow' onclick='followDR()'>follow?</button></span>"
        );
      }
    }
  );
}

function followDR() {
  $.ajax({
    method: "POST",
    data: "{user: " + data.userID + "}",
    url: "https://mixer.com/api/v1/channels/70637586/follow",
    headers: { Authorization: "Bearer " + data.access_token },
    success: (result) => {
      $("#followspan").text("THANK YOU!");
    },
  });
}
//When the document is ready, let's load in the stats of usage!
$(document).ready(() => {
  $.get("https://ask.daddyrobot.live/mixplaycounts", (result) => {
    console.log(result);
    Object.keys(result).forEach((mixplay) => {
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
