'use strict';

var TWITTER_SHARE_URL = '//twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=';
var QUOTE_SERVICE_URL = '//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';

function removeTags(text) {
  return text.replace(/<\/?\w+>/gi, '');
}

function updateQuote(response) {
  var quote = response.shift();
  $('#quote-content').html(quote.content);
  $('#quote-author').text(quote.title || 'Unknown');
  $('#tweet-quote').attr('href', TWITTER_SHARE_URL + encodeURIComponent(removeTags(quote.content)));
}

function getQuote() {
  $.getJSON(QUOTE_SERVICE_URL, updateQuote);
}

$.ajaxSetup({ cache: false });

$(function () {
  $('#new-quote').click(getQuote);
  getQuote();
});
