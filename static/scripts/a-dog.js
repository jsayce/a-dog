window.onload = function() {
    var question = getNextQuestion();
    document.getElementById('question').innerHTML = question;

    document.getElementById('answer-input').focus();

    document.getElementById('answer-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('submit').click();
        }
    });


};

var num1;
var num2;
var score = 0;

var previousMaxScore = getCookie('maxScore');
var previousMinTimePerQuestion = getCookie('minTimePerQuestion');
var previousMaxQuestionsPerMin = getCookie('maxQuestionsPerMin');

if (previousMaxScore) {
    document.getElementById('max-score').innerHTML = previousMaxScore;
    document.getElementById('score-table').style.display = 'table';
}

if (previousMinTimePerQuestion) {
    document.getElementById('min-time-per-question').innerHTML = previousMinTimePerQuestion;
    document.getElementById('score-table').style.display = 'table';
}

if (previousMaxQuestionsPerMin) {
    document.getElementById('max-questions-per-min').innerHTML = previousMaxQuestionsPerMin;
    document.getElementById('score-table').style.display = 'table';
}

var maxScore = previousMaxScore ? parseInt(previousMaxScore) : 0;
var minTimePerQuestion = previousMinTimePerQuestion ? parseFloat(previousMinTimePerQuestion) : Infinity;
var maxQuestionsPerMin = previousMaxQuestionsPerMin ? parseFloat(previousMaxQuestionsPerMin) : 0;

var startTime = new Date().getTime();

function getNextQuestion() {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
    var question = `What is ${num1} x ${num2}?`;
    return question;
}

document.getElementById('submit').onclick = function() {

    var userAnswer = document.getElementById('answer-input').value;
    var correctAnswer = num1 * num2;

    var outcomeElement = document.getElementById('outcome');
    
    if (parseInt(userAnswer) === correctAnswer) {

        outcomeElement.innerHTML = 'Correct!';
        outcomeElement.style.color = 'green';
        score++;

        var currentTime = new Date().getTime();
        var totalTime = (currentTime - startTime) / 1000; // time taken in seconds
        var averageTimePerQuestion = totalTime / score;
        var questionsPerMin = 60 / averageTimePerQuestion;

        document.getElementById('time-per-question').innerHTML = averageTimePerQuestion.toFixed(2);
        document.getElementById('questions-per-min').innerHTML = questionsPerMin.toFixed(2);

        if (score > maxScore) {
            maxScore = score;
            document.getElementById('max-score').innerHTML = maxScore;
            setCookie('maxScore', maxScore);
        }

        if (averageTimePerQuestion < minTimePerQuestion) {
            minTimePerQuestion = averageTimePerQuestion;
            document.getElementById('min-time-per-question').innerHTML = minTimePerQuestion.toFixed(2);
            setCookie('minTimePerQuestion', minTimePerQuestion);
        }

        if (questionsPerMin > maxQuestionsPerMin) {
            maxQuestionsPerMin = questionsPerMin;
            document.getElementById('max-questions-per-min').innerHTML = maxQuestionsPerMin.toFixed(2);
            setCookie('maxQuestionsPerMin', maxQuestionsPerMin);
        }

    } else {
        outcomeElement.innerHTML = `Incorrect. The correct answer for ${num1} x ${num2} is ${correctAnswer}, but you entered ${userAnswer}.`;
        outcomeElement.style.color = 'red';

        score = 0;
        startTime = new Date().getTime();

        document.getElementById('time-per-question').innerHTML = '';
        document.getElementById('questions-per-min').innerHTML = '';
    }

    document.getElementById('score').innerHTML = score;

    document.getElementById('score-table').style.display = 'table';

    document.getElementById('question').innerHTML = getNextQuestion();
    document.getElementById('answer-input').value = '';

    document.getElementById('answer-input').focus();
};

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
