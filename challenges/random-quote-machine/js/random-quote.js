'use strict';

var TWITTER_SHARE_URL = '//twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=';
var QUOTE_SERVICE_URL = '//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';

function updateQuote(response) {
  var quote = response.shift();
  $('#quote-content').html(quote.content);
  $('#quote-author').text(quote.title || 'Unknown');
  $('#tweet-quote').attr('href', TWITTER_SHARE_URL + encodeURIComponent(quote.content));
}

function getQuote() {
  $.getJSON(QUOTE_SERVICE_URL, updateQuote);
}

$(function () {
  $('#new-quote').click(getQuote);
  getQuote();
});
