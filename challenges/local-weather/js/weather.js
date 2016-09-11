'use strict';

var units = 'metric';
var system = {
  'metric': { symbol: ' &deg; C', changeText: 'C&rarr;F' },
  'fahrenheit': { symbol: ' &deg; F', changeText: 'F&rarr;C' }
};
var lastKnownLocation;

function requestClientLocation() {
  var result = $.Deferred();
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        result.resolve(position.coords);
      },
      function () {
        result.reject(':( Sorry but the geolocation failed');
      }
    );
  } else {
    result.reject("Browser doesn't support Geolocation");
  }
  return result.promise();
}

function requestLocationByClientIp() {
  var result = $.Deferred();
  $.getJSON('http://ipinfo.io/json', function (ipinfo) {
    if (ipinfo && ipinfo.loc) {
      var latLon = ipinfo.loc.split(',');
      result.resolve({
        latitude: latLon[0],
        longitude: latLon[1]
      });
    } else {
      result.reject(':( Sorry but the ip location failed');
    }
  }).fail(function () {
    result.reject('Ip location service failed');
  });
  return result.promise();
}

function showWeatherForLocation(coords) {
  lastKnownLocation = coords;
  $.getJSON('http://api.openweathermap.org/data/2.5/weather',
    {
      lat: coords.latitude,
      lon: coords.longitude,
      units: units,
      APPID: 'bca17282d99ff745377ed04bc860a0b0'
    },
    function (result) {
      $('#place').text($('#place').text() || (result.name + ', ' + result.sys.country));
      $('#temperture').html(Math.round(result.main.temp) + system[units].symbol);
      $('#min').html(Math.round(result.main.temp_min) + system[units].symbol);
      $('#max').html(Math.round(result.main.temp_max) + system[units].symbol);
      $('#main').text(result.weather[0].main);
      $('#description').text(result.weather[0].description);
      $('#image').attr('class', 'wi wi-owm-' + result.weather[0].id);
    }
  );
  showCityInfo(coords);
}

function showCityInfo(coords) {
  $.getJSON('http://api.geonames.org/findNearbyPlaceNameJSON',
    {
      lat: coords.latitude,
      lng: coords.longitude,
      username: 'carlosbello'
    },
    function (result) {
      if (result.geonames && result.geonames.length) {
        var address = result.geonames[0];
        $('#place').text((address.adminName1 || address.name) + ', ' + address.countryCode);
      }
    }
  );
}

function changeUnits() {
  units = units === 'metric' ? 'fahrenheit' : 'metric';
  $('#change').html(system[units].changeText);
  showWeatherForLocation(lastKnownLocation);
}

function isFlexboxNotSupported() {
  var c;
  var f = "flex";
  var wf = "-webkit-" + f;
  var nf = "no-flex";
  var e = document.createElement('b');
  try {
    e.style.display = wf;
    e.style.display = f;
    c = (e.style.display == f || e.style.display == wf) ? f : nf;
  } catch(e) {
    c = nf;
  }
  return c === nf;
}

function removeNoFlexMessage() {
  $('.no-flex').removeClass('no-flex');
  loadWeatherInfo();
}

function loadWeatherInfo() {
  requestClientLocation()
    .done(showWeatherForLocation)
    .fail(function (err) {
      console.log(err);
      requestLocationByClientIp()
          .done(showWeatherForLocation)
          .fail(window.alert.bind(window))
    });
}

function isRunningOnHttps() {
  return document.location.protocol === 'https:';
}

function setupNoHttpMessage() {
  document.documentElement.className += ' no-http';
  // We can't programmatically redirect from https to http because the browser can stop this action
  // (at least in codepen.io) so, we need to delegate this redirection to the user.
  var httpDestination = document.URL
    .replace('https://', 'http://')
    .replace('/fullpage/', '/full/'); // HACK! This is needed for the free version of codepen.io
  $('.no-http-message a').attr('href', httpDestination);
}

function setupNoFlexboxMessage() {
  document.documentElement.className += ' no-flex';
  $('.no-flex-message a').click(removeNoFlexMessage);
}

$(function () {
  if (isRunningOnHttps()) {
    setupNoHttpMessage();
    return;
  }
  if (isFlexboxNotSupported()) {
    setupNoFlexboxMessage();
    return;
  }

  $('#change').click(changeUnits);
  loadWeatherInfo();
});
