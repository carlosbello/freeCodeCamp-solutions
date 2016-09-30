'use strict';

var TWITCH_API_URL = '//api.twitch.tv/kraken/streams/';
var CHANNELS = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
                "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var $channelList;
var channelTemplate;

function showChannelInfo(channel, info) {
  var info;console.log(info);
  if (info.status === 404) {
    info = channelTemplate
      .replace('${name}', channel)
      .replace('${status}', 'Not found');
  } else if (info.url) {
    info = channelTemplate
      .replace('${name}', info.display_name || channel)
      .replace('${channelUrl}', info.url)
      .replace('${status}', 'Online')
      .replace('${logoUrl}', info.logo);
  } else {
    info = channelTemplate
      .replace('${name}', channel)
      .replace('${status}', 'Offline');
  }
  $channelList.append(info);
}

function loadChannels(channels) {
  channels.forEach(function (channel) {
    $.getJSON(TWITCH_API_URL + channel, function (info) {
      showChannelInfo(channel, info);
    });
  });
}

$(function () {
  channelTemplate = $('#channelTemplate').text();
  $channelList = $('#channelList');
  loadChannels(CHANNELS);
});
