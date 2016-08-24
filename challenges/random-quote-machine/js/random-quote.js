'use strict';

var TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=';

function updateQuote(response) {
  if (response) {
    $('#quote-content').text(response.quoteText);
    $('#quote-author').text(response.quoteAuthor || 'Unknown');
    $('#tweet-quote').attr('href', TWITTER_SHARE_URL + encodeURIComponent(response.quoteText));
  }
}

function getQuote() {
  $.ajax({
    url: 'http://api.forismatic.com/api/1.0/',
    dataType: 'jsonp',
    jsonp: 'jsonp',
    jsonpCallback: 'updateQuote',
    data: {
      method: 'getQuote',
      key: 457653,
      format: 'jsonp',
      lang: 'en'
    }
  });
}

$(function () {
  $('#new-quote').click(getQuote);
  getQuote();
});
