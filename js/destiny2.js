let dataToSend = {};
let d2_sentone = false;

function runDestiny2() {
  log("Starting up Destiny2 MixPlay!");
  client.open({
    authToken: data.access_token,
    versionId: 460070, //Live
    sharecode: "kxcid71k", //Live
    // sharecode: "3re2gsyf", //Beta
    // versionId: 462971, //Beta
  });

  client.on("open", () => {
    log("Mixplay has been opened!");
    client
      .getScenes()
      .then(() => client.synchronizeScenes())
      .then(() => d2goLive());
  });

  client.state.on("participantJoin", (participant) => {
    // console.log(participant);
    log(participant.username + " joined the mixplay!");
    if (d2_sentone) {
      client.broadcastEvent({
        scope: ["participant:" + participant.sessionID],
        data: {
          type: "updatedata",
          data: dataToSend,
        },
      });
    }
  });
}

function d2goLive() {
  // console.log("doingthis");

  client.ready();
  d2updateData();
  setInterval(d2updateData, 180000);
}

function d2updateData() {
  d2LoadInfo();
  setTimeout(() => {
    log("Sending Latest Data.");
    d2_sentone = true;
    client.broadcastEvent({
      scope: ["everyone"],
      data: {
        type: "updatedata",
        data: dataToSend,
      },
    });
  }, 30000);
}

function d2LoadInfo(type = 0) {
  log("Getting Latest Data.");
  let mt = "";
  let mi = "";
  let mt_name = "";
  let mi_displayName = "";

  switch (type) {
    case 1:
      console.log("Loading test data");
      mi = "4611686018467188891";
      mt = 3;
      break;

    case 0:
      let info = $("#d2players").val().split(" - ");
      //console.log(info);
      mi_displayName = info[0];
      mt_name = info[1];
      mt = info[2];
      mi = info[3];
      break;

    case 2:
      mi = localStorage.getItem("d2_mi");
      mt = localStorage.getItem("d2_mt");
      mt_name = localStorage.getItem("d2_mt_name");
      mi_displayName = localStorage.getItem("d2_mi_displayName");
  }

  dataToSend = {};

  let headers = {
    //"X-API-Key": "9d59f63aeacf44c5937006b63ee3cc91", //beta
    "X-API-Key": "c887af950f1147f2812113e513797155", //live
  };

  dataToSend.mt = d2_membershipType(mt);
  dataToSend.characters = {};

  $.ajax({
    headers: headers,
    url:
      "https://www.bungie.net/Platform/Destiny2/" +
      mt +
      "/Profile/" +
      mi +
      "/?components=200",
  }).then((profile) => {
    localStorage.setItem("d2_mi", mi);
    localStorage.setItem("d2_mt", mt);
    localStorage.setItem("d2_mt_name", mt_name);
    localStorage.setItem("d2_mi_displayName", mi_displayName);
    Object.keys(profile.Response.characters.data).forEach(function (charKey) {
      let character = {
        id: profile.Response.characters.data[charKey].characterId,
      };
      // do something with obj[key]

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
      dataToSend.characters[charKey].emblem =
        profile.Response.characters.data[charKey].emblemBackgroundPath;
      dataToSend.characters[charKey].light =
        profile.Response.characters.data[charKey].light;
      dataToSend.characters[charKey].equipment = {};
      dataToSend.characters[charKey].stats = {};
      dataToSend.characters[charKey].stats.pvp = {};
      dataToSend.characters[charKey].stats.pve = {};

      $.ajax({
        headers: headers,
        url:
          "https://www.bungie.net/Platform/Destiny2/" +
          mt +
          "/Profile/" +
          mi +
          "/Character/" +
          profile.Response.characters.data[charKey].characterId +
          "/?components=200,202,205",
      }).then((charData) => {
        //console.log(charData.Response.equipment.data.items);
        dataToSend.characters[charKey].trialinfo = d2_trialInfo(
          charData.Response.progressions.data.uninstancedItemObjectives
        );
        // console.log(
        //   charData.Response.progressions.data.uninstancedItemObjectives
        // );
        // console.log(
        //   d2_trialInfo(
        //     charData.Response.progressions.data.uninstancedItemObjectives
        //   )
        // );

        charData.Response.equipment.data.items.forEach((equipment) => {
          $.ajax({
            headers: headers,
            url:
              "https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/" +
              equipment.itemHash,
          }).then((itemHashData) => {
            //console.log(itemHashData.Response.displayProperties.name);
            //console.log(itemHashData);
            let itemType = d2_itemType(itemHashData);
            switch (itemType) {
              case "SubClass":
                //  console.log(itemHashData.Response);
                dataToSend.characters[charKey].subclass =
                  itemHashData.Response.displayProperties.name;
                dataToSend.characters[charKey].subclassEmblem =
                  itemHashData.Response.displayProperties.icon;
                dataToSend.characters[
                  charKey
                ].subclassItemTypeAndTierDisplayName =
                  itemHashData.Response.itemTypeAndTierDisplayName;
                break;
            }

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
              tierType: itemHashData.Response.inventory.tierType,
              order: d2_itemSubType(itemHashData),
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
              if (
                itemInstanceData.Response.instance.data.primaryStat !==
                undefined
              ) {
                dataToSend.characters[charKey].equipment[
                  equipment.itemInstanceId
                ].light =
                  itemInstanceData.Response.instance.data.primaryStat.value;
              }

              if (itemInstanceData.Response.stats.data !== undefined) {
                Object.keys(itemInstanceData.Response.stats.data.stats).forEach(
                  function (statKey) {
                    let statToPush = {};
                    statToPush.name = d2_stat(
                      itemInstanceData.Response.stats.data.stats[statKey]
                        .statHash
                    );
                    statToPush.value =
                      itemInstanceData.Response.stats.data.stats[statKey].value;

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
      statData = statData.Response.characters.filter((x) => !x.deleted);

      statData.forEach((charStatData) => {
        Object.keys(charStatData.results.allPvP.allTime).forEach((pvpStats) => {
          //   console.log("Doing PvP Stat: " + pvpStats);
          let pvpStatObject = {};

          pvpStatObject.basic =
            charStatData.results.allPvP.allTime[pvpStats].basic.displayValue;
          if (charStatData.results.allPvP.allTime[pvpStats].pga !== undefined) {
            pvpStatObject.pga =
              charStatData.results.allPvP.allTime[pvpStats].pga.displayValue;
          }

          dataToSend.characters[charStatData.characterId].stats.pvp[
            charStatData.results.allPvP.allTime[pvpStats].statId
          ] = pvpStatObject;
        });
        Object.keys(charStatData.results.allPvE.allTime).forEach((pveStats) => {
          let pveStatObject = {};

          pveStatObject.basic =
            charStatData.results.allPvE.allTime[pveStats].basic.displayValue;
          if (charStatData.results.allPvE.allTime[pveStats].pga !== undefined) {
            pveStatObject.pga =
              charStatData.results.allPvE.allTime[pveStats].pga.displayValue;
          }

          dataToSend.characters[charStatData.characterId].stats.pve[
            charStatData.results.allPvE.allTime[pveStats].statId
          ] = pveStatObject;
        });
      });
    });
  });
}
