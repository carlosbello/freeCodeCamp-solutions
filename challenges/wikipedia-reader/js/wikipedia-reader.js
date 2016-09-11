'use strict';

var resultTemplate;
var messageTemplate;
var $searchResult;
var TITLE = 1;
var ABSTRACT = 2;
var URL = 3;

function showMessage(message) {
  $searchResult.html(messageTemplate.replace('${message}', message));
}

function showResults(data) {
  var result;
  if (data && data[1].length) {
    $searchResult.empty();
    for(var i = 0; i < data[TITLE].length; i++) {
      result = resultTemplate
        .replace('${title}', data[TITLE][i])
        .replace('${abstract}', data[ABSTRACT][i])
        .replace('${url}', data[URL][i]);
      $searchResult.append(result);
    }
  } else {
    showMessage('Nothing found. Try a different query.');
  }
}

function queryWikipedia(search) {
  return $.ajax({
      url: '//en.wikipedia.org/w/api.php',
      data: {action: 'opensearch', search: search, format: 'json', prop: 'info'},
      dataType: 'jsonp',
      type: 'POST',
      headers: {'Api-User-Agent': 'wikipedia-reader/1.0'},
  });
}

function showError(error) {
  showMessage(':( Sorry. Something went wrong. Try again later.');
}

function search() {
  queryWikipedia($('#search').val())
    .done(showResults)
    .fail(showError);
  return false;
}

function initResultsList() {
  $searchResult.css('display', 'block');
}

$(function () {
  resultTemplate = $('#resultTemplate').text();
  messageTemplate = $('#messageTemplate').text();
  $searchResult = $('#searchResult');
  $('.card-content button').one('click', initResultsList);
  $('form').submit(search);
});
