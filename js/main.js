// Select Elements
let categorySpan = document.querySelector(".quiz-info .category span");
let quizChoose = document.querySelector(".quiz-choose");
let chooseBtns = document.querySelectorAll(".quiz-choose div");
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let resultsContainer = document.querySelector(".results");
let countDownContainer = document.querySelector(".count-timer");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let language;

function getQuestions() {
    const myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {

            // on click on one of choose btns
            chooseBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    // Get data attribute of clicked button
                    language = btn.dataset.lang;
                    const languagesObject = JSON.parse(this.responseText);
                    const questionsObject = languagesObject[language];
                    const questionsNumber = questionsObject.length;

                    // Set Category Value
                    categorySpan.innerHTML = language;

                    // Remove all buttons
                    quizChoose.style.display = "none";
        
                    // Create Bullets
                    createBullets(questionsNumber);
        
                    // Add questions and aswers
                    addQuestionsData(questionsObject[currentIndex], questionsNumber);
        
                    // CountDown
                    countDown(60, questionsNumber)
        
                    // Check right answer
                    submitBtn.onclick = () => {
                        // Get the right answer
                        let rightAnswer = questionsObject[currentIndex].right_answer;
        
                        // Icrease the current index
                        currentIndex++;
        
                        checkAnswer(rightAnswer, questionsNumber);
        
                        // Remove present quesion
                        quizArea.innerHTML = '';
                        answersArea.innerHTML = '';
        
                        // Get next question
                        addQuestionsData(questionsObject[currentIndex], questionsNumber);
        
                        // Handle "On" Bullets
                        handleOnBullets()
        
                        // CountDown
                        clearInterval(countDownInterval)
                        countDown(60, questionsNumber)
        
                        // Show results
                        showResults(questionsNumber)
                    }
                })
            })

        }
    }

    myRequest.open("GET", "../json/questions.json", true)
    myRequest.send()
}

getQuestions();

// Create Bullets Function
function createBullets(num) {
    countSpan.innerHTML = num;

    for (let i = 0; i < num; i++) {
        // Create Spans
        let bulletsSpan = document.createElement("span");

        // Append Spans to bullets span container
        bulletsSpansContainer.append(bulletsSpan);

        if (i === 0) {
            bulletsSpan.className = "on";
        }
    }
}

// Create Questions and Answers 
function addQuestionsData(obj, count) {
    if (currentIndex < count) {
        // Create h2
        let myHeading = document.createElement("h2");
        // Create h2 text
        let headingText = document.createTextNode(obj.title);
        // Append text to h2
        myHeading.append(headingText);
        // Append h2 to quiz area
        quizArea.append(myHeading);

        for (let i = 1; i <= 4; i++) {
            // Create main div
            let answer = document.createElement("div");
            // Add class to main div
            answer.className = "answer";

            // create radio input
            let radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            if (i === 1) {
                radioInput.checked = true;
            }

            // create Label
            let ansLabel = document.createElement("label");
            ansLabel.htmlFor = `answer_${i}`;
            let labelTxt = document.createTextNode(obj[`answer_${i}`]);
            ansLabel.appendChild(labelTxt);
            answer.appendChild(radioInput);
            answer.appendChild(ansLabel);

            // Append answers to answers area
            answersArea.appendChild(answer);
        }
    }
}

// Check answers function
function checkAnswer(rAnswer, count) {
    // Get answers by element name
    let answers = document.getElementsByName("question");
    let choosenAnswer;

    // Get the custom attribute of choosen answer
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            choosenAnswer = answers[i].dataset.answer;
        }
    }

    // increase the right answers if this answer is right
    if (choosenAnswer === rAnswer) {
        rightAnswers++;
    }
}

// Handle on bullets function
function handleOnBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let bulletsArray = Array.from(bulletsSpans);

    bulletsArray.forEach((bullet, index) => {
        if (index === currentIndex) {
            bullet.className = "on";
        }
    })
}

// Show results function
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();

        if (rightAnswers < count && rightAnswers > (count / 2)) {
            theResults = `<span class='good'>good </span>${rightAnswers} / 10`;
        } else if (rightAnswers === count) {
            theResults = `<span class='perfect'>perfect </span>${rightAnswers} / 10`;
        } else {
            theResults = `<span class='bad'>bad </span>${rightAnswers} / 10`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "#FFF";
        resultsContainer.style.fontSize = "20px";
    }
}

// Countdown function
function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;

        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? minutes = `0${minutes}` : minutes;
            seconds = seconds < 10 ? seconds = `0${seconds}` : seconds;

            countDownContainer.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000)
    }
}