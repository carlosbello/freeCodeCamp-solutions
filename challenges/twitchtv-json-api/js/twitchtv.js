'use strict';

var TWITCH_API_URL = '//api.twitch.tv/kraken/streams/';
var DEFAULT_CHANNEL_URL = 'javascript: void(0);';
var DEFAULT_LOGO_URL = '//s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_purple.png'
var CHANNELS = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
                "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var $channelList;
var channelTemplate;

function getStatusText(info) {
  return info.status === 404 ? 'Not found' :
         info.url            ? 'Online' :
                               'Offline';
}

function showChannelInfo(channel, info) {
  var info;
  var formatedInfo = channelTemplate
    .replace('${name}', info.display_name || channel)
    .replace('${channelUrl}', info.url || DEFAULT_CHANNEL_URL)
    .replace('${disabled}', info.url ? '' : 'disabled')
    .replace('${status}', getStatusText(info))
    .replace('${logoUrl}', info.logo || DEFAULT_LOGO_URL);

  $channelList.append(formatedInfo);
}

function loadChannels(channels) {
  channels.forEach(function (channel) {
    $.getJSON(TWITCH_API_URL + channel, function (info) {
      showChannelInfo(channel, info);
    });
  });
}

function applyFilter(elem) {
  var status = $(elem.currentTarget).text();

  if (status === 'All') {
    $channelList.children().show();
  } else {
    $channelList.children().hide();
    $channelList.find('p:contains(' + status + ')').parent().show();
  }
}

$(function () {
  $('.button-collapse').sideNav({closeOnClick: true});
  $('.filter').click(applyFilter);
  channelTemplate = $('#channelTemplate').text();
  $channelList = $('#channelList');
  loadChannels(CHANNELS);
});
