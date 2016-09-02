/*
TODO: Implement
-1.-Get current location---------------------------
-2.-Query https://openweathermap.org/current#geo---
3. Switch between Celsius and Fahrenheit
4. Show different icons or background depending on the weather
*/
var units = 'metric';

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

function showWeatherForLocation(coords) {
  $.getJSON('http://api.openweathermap.org/data/2.5/weather',
    {
      lat: coords.latitude,
      lon: coords.longitude,
      units: units,
      APPID: 'bca17282d99ff745377ed04bc860a0b0'
    },
    function (result) {
      $('#place').text($('#place').text() || (result.name + ', ' + result.sys.country));
      $('#temperture').text(result.main.temp);
      $('#description').text(result.weather[0].main);
      $('#image').attr('src', 'http://openweathermap.org/img/w/' + result.weather[0].icon + '.png');
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
      if (result.geonames) {
        var address = result.geonames[0];
        $('#place').text((address.adminName1 || address.name) + ', ' + address.countryCode);
      }
    }
  );
}

$(function () {
  requestClientLocation()
    .done(showWeatherForLocation)
    .fail(alert);
});
