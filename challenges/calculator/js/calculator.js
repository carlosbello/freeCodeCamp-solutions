'use strict';

var result = document.getElementById('result');
var ERROR = 'Error';
var HELP = [
  'Use your mouse...',
  'or your key board',
  'Backspace:',
  'Clear one char',
  'Del:',
  'Clear all the input',
];
var BACKSPACE = 8;
var DEL = 46;
var ENTER = 13;
var INITIAL_VALUE = '0';
var HELP_SHOW_TIME = 1500;
var BACKSPACE = 8;
var DEL = 46;
var ENTER = 13;
var INITIAL_VALUE = '0';
var HELP_SHOW_TIME = 1500;
var BACKSPACE = 8;
var DEL = 46;
var ENTER = 13;
var INITIAL_VALUE = '0';
var HELP_SHOW_TIME = 1500;

function appendInput(text) {
  if (result.innerHTML === INITIAL_VALUE || result.innerHTML === ERROR) {
    result.innerHTML = text;
  } else {
    result.innerHTML += text;
  }
}

function processKey(key, keyCode) {
  if (key.match('[0-9]|\\+|\\-|\\*|/|\\.')) {
    appendInput(key);
  }
  if (keyCode === BACKSPACE) {
    result.innerHTML = result.innerHTML.length > 1 && result.innerHTML !== ERROR
      ? result.innerHTML.substr(0, result.innerHTML.length - 1)
      : INITIAL_VALUE;
  }
  if (keyCode === DEL) {
    result.innerHTML = INITIAL_VALUE;
  }
  if (key === '=' || keyCode === ENTER) {
    try {
      result.innerHTML = eval(result.innerHTML);
    } catch (e) {
      result.innerHTML = ERROR;
    }
  }
  if (key === '?') {
    showHelp();
  }
}

function showHelp() {
  var currentResult = result.innerHTML;

  for(var i = 0; i < HELP.length; i++) {
    setTimeout((function (index) {
      return function () {
        result.innerHTML = HELP[index];
      };
    })(i), i * HELP_SHOW_TIME);
  }
  setTimeout(function () {
    result.innerHTML = currentResult;
  }, HELP.length * HELP_SHOW_TIME);
}

document.querySelectorAll('[data-key]').forEach(function (el) {
  el.addEventListener('click', function (event) {
    var key = event.currentTarget.dataset.key;
    event.preventDefault();
    processKey(key, -1);
  });
});

document.querySelectorAll('[data-keycode]').forEach(function (el) {
  el.addEventListener('click', function (event) {
    var keyCode = Number(event.currentTarget.dataset.keycode);
    event.preventDefault();
    processKey('', keyCode);
  });
});

document.addEventListener('keydown', function (event) {
  var oEvent = event || window.event;
  var key = oEvent.key;
  var keyCode = oEvent.keyCode;
  processKey(key, keyCode);
});
