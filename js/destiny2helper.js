function d2_anyDataHere() {
  let mi = localStorage.getItem("d2_mi");
  $("#d2players").empty();
  if (mi !== undefined) {
    $("#d2players").append(
      "<option>" +
        localStorage.getItem("d2_mi_displayName") +
        " - " +
        localStorage.getItem("d2_mt_name") +
        " - " +
        localStorage.getItem("d2_mt") +
        " - " +
        localStorage.getItem("d2_mi") +
        "</option>"
    );
  }
}

function d2SearchForPlayer() {
  $("#d2_loading").show();
  $("#d2players").empty();
  let d2_name = encodeURI($("#d2playerName").val());
  let headers = {
    "X-API-Key": "9d59f63aeacf44c5937006b63ee3cc91",
  };
  $.ajax({
    headers: headers,
    url:
      "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/" +
      d2_name +
      "/",
  }).then((results) => {
    //console.log(results);
    results.Response.forEach((members) => {
      $("#d2players").append(
        "<option>" +
          members.displayName +
          " - " +
          d2_membershipType(members.membershipType) +
          " - " +
          members.membershipType +
          " - " +
          members.membershipId +
          "</option>"
      );
    });
    $("#d2_loading").hide();
  });
}

function d2_itemType(equip) {
  if (equip.Response.itemCategoryHashes.includes(50)) {
    return "SubClass";
  }
  if (equip.Response.itemCategoryHashes.includes(20)) {
    // console.log(equip.Response.itemCategoryHashes);
    return "Armor";
  }
  if (equip.Response.itemCategoryHashes.includes(1)) {
    // console.log(equip.Response.itemCategoryHashes);
    return "Weapon";
  }
  if (equip.Response.itemCategoryHashes.includes(39)) {
    return "Other";
  }
  if (equip.Response.itemCategoryHashes.includes(42)) {
    return "Other";
  }
  return "Crap";
}
function d2_itemSubType(equip) {
  if (equip.Response.itemCategoryHashes.includes(4)) {
    return 3;
  }
  if (equip.Response.itemCategoryHashes.includes(3)) {
    return 2;
  }
  if (equip.Response.itemCategoryHashes.includes(2)) {
    return 1;
  }
  if (equip.Response.itemCategoryHashes.includes(45)) {
    return 1;
  }
  if (equip.Response.itemCategoryHashes.includes(46)) {
    return 2;
  }
  if (equip.Response.itemCategoryHashes.includes(47)) {
    return 3;
  }
  if (equip.Response.itemCategoryHashes.includes(48)) {
    return 4;
  }
  if (equip.Response.itemCategoryHashes.includes(49)) {
    return 5;
  }

  return 6;
}

function d2_stat(type) {
  switch (type) {
    case 3614673599:
      return "Blast Radius";
    case 2523465841:
      return "Velocity";
    case 392767087:
      return "Resilience";
    case 1735777505:
      return "Discipline";
    case 1943323491:
      return "Recovery";
    case 2996146975:
      return "Mobility";
    case 4244567218:
      return "Strength";
    case 155624089:
      return "Stability";
    case 943549884:
      return "Handling";
    case 1240592695:
      return "Range";
    case 3871231066:
      return "Magazine";
    case 4043523819:
      return "Impact";
    case 4188031367:
      return "Reload Speed";
    case 4284893193:
      return "Rounds Per Minute";
    case 144602215:
      return "Intellect";
    default:
      return type;
  }
}

function d2_race(type) {
  switch (type) {
    case 0:
      return "Human";
    case 1:
      return "Awoken";
    case 2:
      return "Exo";
    case 3:
      return "Unknown";
    default:
      return type;
  }
}

function d2_class(type) {
  switch (type) {
    case 0:
      return "Titan";
    case 1:
      return "Hunter";
    case 2:
      return "Warlock";
    case 3:
      return "Unknown";
    default:
      return type;
  }
}

function d2_gender(type) {
  switch (type) {
    case 0:
      return "Male";
    case 1:
      return "Female";
    case 2:
      return "Unknown";
    default:
      return type;
  }
}

function d2_membershipType(type) {
  type = type * 1;
  switch (type) {
    case 0:
      return "None";
    case 1:
      return "Xbox";
    case 2:
      return "PSN";
    case 3:
      return "Steam";
    case 4:
      return "Blizzard";
    case 5:
      return "Stadia";
    case 10:
      return "Demon";
    case 254:
      return "BungieNext";
    case -1:
      return "All";
    default:
      return type;
  }
}

function d2_trialInfo(UIO) {
  let result = { success: false };

  Object.keys(UIO).forEach((key) => {
    switch (key) {
      case "1600065451":
        result.success = true;
        result.passagetitle = "PASSAGE OF MERCY";
        result.passageicon =
          "https://www.bungie.net/common/destiny2_content/icons/8a7944d13890f231f332e95d0f300be9.jpg";
        result.passagetext = "Forgives one loss per run.";
        if (UIO[key][0].objectiveHash == 1586211619) {
          result.wins = UIO[key][0].progress;
          result.losses = UIO[key][1].progress;
        } else {
          result.wins = UIO[key][1].progress;
          result.losses = UIO[key][0].progress;
        }
        break;
      case "2879309661":
        result.success = true;
        result.passagetitle = "PASSAGE OF WEALTH";
        result.passageicon =
          "https://www.bungie.net/common/destiny2_content/icons/278e2252c8471a03e3dd9c0c10d7562d.jpg";
        result.passagetext =
          "Increased tokens from completing and winning Trials matches.";
        if (UIO[key][0].objectiveHash == 1586211619) {
          result.wins = UIO[key][0].progress;
          result.losses = UIO[key][1].progress;
        } else {
          result.wins = UIO[key][1].progress;
          result.losses = UIO[key][0].progress;
        }
        break;
      case "2001563200":
        result.success = true;
        result.passagetitle = "PASSAGE OF WISDOM";
        result.passageicon =
          "https://www.bungie.net/common/destiny2_content/icons/0e7e2a192c19b8d5d4dc054950047bc0.jpg";
        result.passagetext =
          "Grants bonus XP from Trials wins, scaling with the number of wins on a ticket.";
        if (UIO[key][0].objectiveHash == 1586211619) {
          result.wins = UIO[key][0].progress;
          result.losses = UIO[key][1].progress;
        } else {
          result.wins = UIO[key][1].progress;
          result.losses = UIO[key][0].progress;
        }
        break;
      case "7665310":
        result.success = true;
        result.passagetitle = "PASSAGE OF FEROCITY";
        result.passageicon =
          "https://www.bungie.net/common/destiny2_content/icons/32af2ae035485b13f65b2ae19fc02e17.jpg";
        result.passagetext =
          "With zero losses, your third win grants a bonus win.";
        if (UIO[key][0].objectiveHash == 1586211619) {
          result.wins = UIO[key][0].progress;
          result.losses = UIO[key][1].progress;
        } else {
          result.wins = UIO[key][1].progress;
          result.losses = UIO[key][0].progress;
        }
        break;
      case "1181381245":
        result.success = true;
        result.passagetitle = "PASSAGE OF CONFIDENCE";
        result.passageicon =
          "https://www.bungie.net/common/destiny2_content/icons/231be9c2ad7155c8aa1d6cd58f63fae3.jpg";
        result.passagetext = "Grants bonus rewards from Flawless Chest.";
        if (UIO[key][0].objectiveHash == 1586211619) {
          result.wins = UIO[key][0].progress;
          result.losses = UIO[key][1].progress;
        } else {
          result.wins = UIO[key][1].progress;
          result.losses = UIO[key][0].progress;
        }
        break;
    }
  });
  return result;
}
