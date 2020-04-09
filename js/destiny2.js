let dataToSend = {};

function d2LoadInfo(test = 0) {
  let mt = "";
  let mi = "";

  if (test == 1) {
    console.log("Loading test data");
    // //ZKMushroom
    mi = "4611686018467188891";
    mt = 3;
  } else {
    let info = $("#d2players").val().split(" - ");
    console.log(info);
    mt = info[1];
    mi = info[2];
  }

  dataToSend = {};
  setTimeout(() => {
    console.log(
      "Data To Send - sending after 20 seconds because who needs to use promises, lol."
    );
    console.log(dataToSend);
  }, 10000);

  let headers = {
    "X-API-Key": "c887af950f1147f2812113e513797155",
  };

  $("#d2info").append(
    "<li>" + d2_membershipType(mt) + "</li><ul id='" + mi + "'></ul>"
  );
  dataToSend.mt = d2_membershipType(mt);
  dataToSend.characters = {};
  // console.log(membership);
  $.ajax({
    headers: headers,
    url:
      "https://www.bungie.net/Platform/Destiny2/" +
      mt +
      "/Profile/" +
      mi +
      "/?components=200",
  }).then((profile) => {
    //   console.log(profile);
    Object.keys(profile.Response.characters.data).forEach(function (charKey) {
      let character = {
        id: profile.Response.characters.data[charKey].characterId,
      };
      // do something with obj[key]
      $("#" + mi).append(
        "<li>" +
          d2_class(profile.Response.characters.data[charKey].classType) +
          " // " +
          d2_race(profile.Response.characters.data[charKey].raceType) +
          " " +
          d2_gender(profile.Response.characters.data[charKey].genderType) +
          "</li><ul id='" +
          profile.Response.characters.data[charKey].characterId +
          "'><li>Light: " +
          profile.Response.characters.data[charKey].light +
          "</li></ul>"
      );
      dataToSend.characters[charKey] = {};
      dataToSend.characters[charKey].race = d2_race(
        profile.Response.characters.data[charKey].raceType
      );
      dataToSend.characters[charKey].class = d2_class(
        profile.Response.characters.data[charKey].classType
      );
      dataToSend.characters[charKey].gender = d2_gender(
        profile.Response.characters.data[charKey].genderType
      );
      dataToSend.characters[charKey].light =
        profile.Response.characters.data[charKey].light;
      dataToSend.characters[charKey].equipment = {};
      dataToSend.characters[charKey].stats = {};
      dataToSend.characters[charKey].stats.pvp = [];
      dataToSend.characters[charKey].stats.pve = [];

      $.ajax({
        headers: headers,
        url:
          "https://www.bungie.net/Platform/Destiny2/" +
          mt +
          "/Profile/" +
          mi +
          "/Character/" +
          profile.Response.characters.data[charKey].characterId +
          "/?components=200,205",
      }).then((charData) => {
        //   console.log(charData);
        $("#" + profile.Response.characters.data[charKey].characterId).append(
          "<li>Stats</li><ul id='" +
            profile.Response.characters.data[charKey].characterId +
            "-stats'><li>PvP</li><ul id ='" +
            profile.Response.characters.data[charKey].characterId +
            "-stats-pvp'></ul><li>PvE</li><ul id ='" +
            profile.Response.characters.data[charKey].characterId +
            "-stats-pve'></ul></ul><li>Equipment</li><ul><li>Weapons</li><ul id='" +
            profile.Response.characters.data[charKey].characterId +
            "-equipment-Weapon'></ul><li>Armors</li><ul id='" +
            profile.Response.characters.data[charKey].characterId +
            "-equipment-Armor'></ul><li>Others</li><ul id='" +
            profile.Response.characters.data[charKey].characterId +
            "-equipment-Other'></ul></ul>"
        );
        charData.Response.equipment.data.items.forEach((equipment) => {
          $.ajax({
            headers: headers,
            url:
              "https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/" +
              equipment.itemHash,
          }).then((itemHashData) => {
            console.log(character);
            let itemType = d2_itemType(itemHashData);
            //   console.log(
            //     itemType +
            //       " - " +
            //       itemHashData.Response.displayProperties.name +
            //       " - ItemHashData"
            //   );
            //   console.log(itemHashData);
            switch (itemType) {
              case "SubClass":
                $(
                  "#" + profile.Response.characters.data[charKey].characterId
                ).prepend(
                  "<li>Subclass: " +
                    itemHashData.Response.displayProperties.name +
                    "</li>"
                );
                dataToSend.characters[charKey].subclass =
                  itemHashData.Response.displayProperties.name;
                break;
              case "Weapon":
                $(
                  "#" +
                    profile.Response.characters.data[charKey].characterId +
                    "-equipment-" +
                    itemType
                ).append(
                  "<li>" +
                    itemHashData.Response.displayProperties.name +
                    " - " +
                    itemHashData.Response.itemTypeAndTierDisplayName +
                    "</li><ul id='" +
                    equipment.itemInstanceId +
                    "'><li>Images</li><ul id='" +
                    equipment.itemInstanceId +
                    "-images'></ul><li>Stats</li><ul id='" +
                    equipment.itemInstanceId +
                    "-stats'></ul></ul>"
                );

                break;
              case "Armor":
                $(
                  "#" +
                    profile.Response.characters.data[charKey].characterId +
                    "-equipment-" +
                    itemType
                ).append(
                  "<li>" +
                    itemHashData.Response.displayProperties.name +
                    " - " +
                    itemHashData.Response.itemTypeAndTierDisplayName +
                    "</li><ul id='" +
                    equipment.itemInstanceId +
                    "'><li>Images</li><ul id='" +
                    equipment.itemInstanceId +
                    "-images'></ul><li>Stats</li><ul id='" +
                    equipment.itemInstanceId +
                    "-stats'></ul></ul>"
                );

                break;
              default:
                $(
                  "#" +
                    profile.Response.characters.data[charKey].characterId +
                    "-equipment-" +
                    itemType
                ).append(
                  "<li>" +
                    itemHashData.Response.displayProperties.name +
                    " - " +
                    itemHashData.Response.itemTypeAndTierDisplayName +
                    "</li><ul><li>Images</li><ul id='" +
                    itemHashData.Response.hash +
                    "-images'></ul>"
                );
            }
            $("#" + equipment.itemInstanceId + "-images").append(
              "<li>Icon</li><ul><li>" +
                itemHashData.Response.displayProperties.icon +
                "</li></ul>"
            );
            $("#" + equipment.itemInstanceId + "-images").append(
              "<li>ScreenShot</li><ul><li>" +
                itemHashData.Response.screenshot +
                "</li></ul>"
            );
            let equipmentData = {
              type: itemType,
              name: itemHashData.Response.displayProperties.name,
              itemTypeAndTierDisplayName:
                itemHashData.Response.itemTypeAndTierDisplayName,
              images: {
                icon: itemHashData.Response.displayProperties.icon,
                screenshot: itemHashData.Response.screenshot,
              },
              stats: [],
              perks: [],
            };
            dataToSend.characters[charKey].equipment[
              equipment.itemInstanceId
            ] = equipmentData;

            $.ajax({
              headers: headers,
              url:
                "https://www.bungie.net/Platform/Destiny2/" +
                mt +
                "/Profile/" +
                mi +
                "/Item/" +
                equipment.itemInstanceId +
                "/?components=300,302,304",
            }).then((itemInstanceData) => {
              console.log(
                itemType +
                  " - " +
                  itemHashData.Response.displayProperties.name +
                  " - ItemInstanceData"
              );
              console.log(itemInstanceData);
              if (
                itemInstanceData.Response.instance.data.primaryStat !==
                undefined
              ) {
                $("#" + equipment.itemInstanceId).prepend(
                  "<li>Light - " +
                    itemInstanceData.Response.instance.data.primaryStat.value +
                    "</li>"
                );
                dataToSend.characters[charKey].equipment[
                  equipment.itemInstanceId
                ].light =
                  itemInstanceData.Response.instance.data.primaryStat.value;
              }

              if (itemInstanceData.Response.stats.data !== undefined) {
                Object.keys(itemInstanceData.Response.stats.data.stats).forEach(
                  function (statKey) {
                    $("#" + equipment.itemInstanceId + "-stats").append(
                      "<li>" +
                        d2_stat(
                          itemInstanceData.Response.stats.data.stats[statKey]
                            .statHash
                        ) +
                        " - " +
                        itemInstanceData.Response.stats.data.stats[statKey]
                          .value +
                        "</li>"
                    );
                    let statToPush = {};
                    statToPush[
                      itemInstanceData.Response.stats.data.stats[
                        statKey
                      ].statHash
                    ] = d2_stat(
                      itemInstanceData.Response.stats.data.stats[statKey].value
                    );
                    dataToSend.characters[charKey].equipment[
                      equipment.itemInstanceId
                    ].stats.push(statToPush);
                  }
                );
              }
              if (itemInstanceData.Response.perks.data !== undefined) {
                itemInstanceData.Response.perks.data.perks.forEach(function (
                  perk
                ) {
                  //https://www.bungie.net/Platform/Destiny2/Manifest/DestinySandboxPerkDefinition/281733738
                  if (perk.visible) {
                    $.ajax({
                      headers: headers,
                      url:
                        "https://www.bungie.net/Platform/Destiny2/Manifest/DestinySandboxPerkDefinition/" +
                        perk.perkHash,
                    }).then((perkHashData) => {
                      console.log(
                        itemType +
                          " - " +
                          itemHashData.Response.displayProperties.name +
                          " - Perk - " +
                          perkHashData.Response.displayProperties.name
                      );
                      console.log(perkHashData);

                      $("#" + equipment.itemInstanceId + "-perks").append(
                        "<li>" +
                          perkHashData.Response.displayProperties.name +
                          "<ul><li>Description: " +
                          perkHashData.Response.displayProperties.description +
                          "</li><li>icon: " +
                          perkHashData.Response.displayProperties.icon +
                          "</li></ul></li>"
                      );
                      let perkToPush = {
                        name: perkHashData.Response.displayProperties.name,
                        description:
                          perkHashData.Response.displayProperties.description,
                        icon: perkHashData.Response.displayProperties.icon,
                      };
                      dataToSend.characters[charKey].equipment[
                        equipment.itemInstanceId
                      ].perks.push(perkToPush);
                    });
                  }
                });
              }
            });
          });
        });
      });
    });
    $.ajax({
      headers: headers,
      url:
        "https://www.bungie.net/Platform/Destiny2/" +
        mt +
        "/Account/" +
        mi +
        "/Stats/",
    }).then((statData) => {
      console.log("Stat Data");
      statData = statData.Response.characters.filter((x) => !x.deleted);
      console.log(statData);
      statData.forEach((charStatData) => {
        Object.keys(charStatData.results.allPvP.allTime).forEach((pvpStats) => {
          //   console.log("Doing PvP Stat: " + pvpStats);
          let pvpStatObject = {};
          let html =
            "<li>" +
            charStatData.results.allPvP.allTime[pvpStats].statId +
            "</li><ul><li>" +
            charStatData.results.allPvP.allTime[pvpStats].basic.displayValue +
            "</li>";

          pvpStatObject.basic =
            charStatData.results.allPvP.allTime[pvpStats].basic.displayValue;
          if (charStatData.results.allPvP.allTime[pvpStats].pga !== undefined) {
            pvpStatObject.pga =
              charStatData.results.allPvP.allTime[pvpStats].pga.displayValue;
            html =
              html +
              "<li>PGA: " +
              charStatData.results.allPvP.allTime[pvpStats].pga.displayValue +
              "</li>";
          }
          html = html + "</ul>";
          //   console.log(html);
          //   console.log("#" + charStatData.characterId + "-stats-pvp");
          $("#" + charStatData.characterId + "-stats-pvp").append(html);
          dataToSend.characters[charStatData.characterId].stats.pvp[
            charStatData.results.allPvP.allTime[pvpStats].statId
          ] = pvpStatObject;
        });
        Object.keys(charStatData.results.allPvE.allTime).forEach((pveStats) => {
          let pveStatObject = {};
          let html =
            "<li>" +
            charStatData.results.allPvE.allTime[pveStats].statId +
            "</li><ul><li>" +
            charStatData.results.allPvE.allTime[pveStats].basic.displayValue +
            "</li>";
          pveStatObject.basic =
            charStatData.results.allPvE.allTime[pveStats].basic.displayValue;
          if (charStatData.results.allPvE.allTime[pveStats].pga !== undefined) {
            pveStatObject.pga =
              charStatData.results.allPvE.allTime[pveStats].pga.displayValue;
            html =
              html +
              "<li>PGA: " +
              charStatData.results.allPvE.allTime[pveStats].pga.displayValue +
              "</li>";
          }
          html = html + "</ul>";
          dataToSend.characters[charStatData.characterId].stats.pve[
            charStatData.results.allPvE.allTime[pveStats].statId
          ] = pveStatObject;
        });
      });
    });
  });
}
