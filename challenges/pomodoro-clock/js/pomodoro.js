/* global ProgressBar */

var MIN = 60000;
var WORK = 0;
var REST = 1;

function buildProgress(container, showTime, color) {
    var bar = new ProgressBar.Circle(container, {
        color: color || '#aaa',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'linear',
        duration: 0,
        text: {
            autoStyleContainer: false
        },
        step: function (state, circle) {
            var duration = this.duration || 0;
            circle.path.setAttribute('stroke-width', 4);
            var value = Math.round(circle.value() * duration);
            var minutes = Math.floor(((duration - value) % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor(((duration - value) % (1000 * 60)) / 1000);
            if (!showTime) {
                circle.setText('');
            } else {
                circle.setText(minutes + ':' + (seconds < 10 ? '0' : '') + seconds +
                    '<br>' + intervals[currentInterval].name);
            }
        }
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';
    bar.text.style.textAlign = 'center';
    return bar;
}

function startMinutes(minutes) {
    minutesProgress.animate(1.0, {duration: minutes * MIN}, function () {
        currentInterval = currentInterval === WORK ? REST : WORK;
        stopTimer();
        startTimer();
    });
}

function startSeconds() {
    secondsProgress.animate(1.0, {duration: MIN}, function () {
        if (!stoped) {
            secondsProgress.set(0);
            startSeconds();
        }
    });
}

function startTimer() {
    stoped = false;
    startMinutes(intervals[currentInterval].duration);
    startSeconds()
}

function stopTimer() {
    stoped = true;
    minutesProgress.set(0);
    secondsProgress.set(0);
}

function resetTimer() {
    currentInterval = WORK;
    stopTimer();
}

function increment(tarjet, maximum) {
    var value = Number(tarjet.textContent);
    resetTimer();
    if (value < maximum) {
        tarjet.textContent = value + 1;
    }
}

function decrement(tarjet) {
    var value = Number(tarjet.textContent);
    resetTimer();
    if (value > 1) {
        tarjet.textContent = value - 1;
    }
}

var stoped = true;
var intervals = [
    {name: 'Work', duration: 25},
    {name: 'Rest', duration: 5},
];
var currentInterval = WORK;
var minutesContainer = document.getElementById('minutes-container');
var secondsContainer = document.getElementById('seconds-container');
var workTime = document.getElementById('work-time');
var restTime = document.getElementById('rest-time');
var minutesProgress = buildProgress(minutesContainer, true, '#333');
var secondsProgress = buildProgress(secondsContainer);

document.getElementById('substract-work').addEventListener('click', function (event) {
    event.preventDefault();
    decrement(workTime);
});
document.getElementById('add-work').addEventListener('click', function (event) {
    event.preventDefault();
    increment(workTime, 90);
});
document.getElementById('substract-rest').addEventListener('click', function (event) {
    event.preventDefault();
    decrement(restTime);
});
document.getElementById('add-rest').addEventListener('click', function (event) {
    event.preventDefault();
    increment(restTime, 30);
});
document.getElementById('play').addEventListener('click', function (event) {
    event.preventDefault();
    if (stoped) {
        intervals[WORK].duration = Number(workTime.innerText);
        intervals[REST].duration = Number(restTime.innerText);
        startTimer();
    }
});
document.getElementById('stop').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('play').innerHTML = '&#9658;';
    resetTimer();
});
