function Card(icon, phrase) {
    this.icon = icon;
    this.phrase = phrase;
    this.matched = false;
    this.position;
}

let icons = [
    ["gem", "Luxurious!"],
    ["heart", "High Flying!"],
    ["anchor", "Anchors Aweigh!"],
    ["bolt", "Electrifying!"],
    ["magic", "Magical!"],
    ["bomb", "Explosive!"],
    ["paw", "Bright!"],
    ["birthday-cake", "Delicious!"],
]
let moveCounter = 0, openCards=[], array=[], remainingMatches=icons.length, hintsUsed=0;
let startTime = Date.now();
const delayInMilliseconds = 1000; //Display cards for 1 sec
var audio = new Audio('audio/card.mp3');
const gameSurface = document.getElementById('game-surface');
gameSurface.addEventListener('click', cardClick);
// const replayButton = document.getElementById('replay-button');
// replayButton.addEventListener('click', restartGame);


function createDeck() {
    doubleIcons = icons.concat(icons);
    for (i=0; i<doubleIcons.length; i++) {
        array.push(new Card(doubleIcons[i][0], doubleIcons[i][1]));
    }
    return array;
    }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function showIcon(event) {

    event.target.setAttribute('class', 'card open show');
};

function incrementMoveCounter() {
    moveCounter +=1;
    document.getElementById('move-counter').innerText = moveCounter;
}

function checkOpenCards(card) {
    if (openCards.length === 1 && openCards[0].position != card.position) {
        let card1 = document.getElementById(openCards[0].position);
        let card2 = document.getElementById(card.position);
        if (openCards[0].icon == card.icon ) {
            card.matched = true, openCards[0].matched=true;
            card1.setAttribute('class', 'card match');
            card2.setAttribute('class', 'card match');
            remainingMatches -=1;
        }
        else {
            setTimeout(function() {
            card1.setAttribute('class', 'card');
            card2.setAttribute('class', 'card');
            }, delayInMilliseconds);
        }
        openCards.pop();
        incrementMoveCounter();
    }
    else if (openCards.length === 0) {
        openCards.push(card)
    }
}

function cardClick(event) {
    if (event.target.nodeName === "LI") {
        card = array.find(function(element) {
            return element.position == event.toElement.id;
        });
        if (!(card.matched)){
        showIcon(event);
        audio.play();
        checkOpenCards(card);
        if (remainingMatches === 0) {
            gameFinish();
        }
    }
};
}

function gameFinish() {
    let seconds = (Date.now() - startTime)/1000;
    let stars = returnStarRating(seconds, moveCounter)
    const starContainer = document.getElementById('star-container')

    document.getElementById('popup').style.display='block';
};


function placeCards(array) {
    const fragment = document.createDocumentFragment();
    for (i=0; i<array.length; i++) {
        const newCard = document.createElement('li');
        newCard.innerHTML = '<i class="fas fa-' + array[i].icon+'"></i>';
        newCard.className = "card";
        newCard.id= "card-"+i;
        array[i].position = 'card-'+i;
        fragment.appendChild(newCard);
    };
    gameSurface.appendChild(fragment);
}

function startGame() {
    //Start Timer
    let array = shuffle(createDeck());
    let cardHolders = document.getElementsByClassName('card');
    placeCards(array);
}

function returnStarRating(seconds, moves) {
    let stars = 0;
    if (hintsUsed === 0){
        stars++;
    };
    if (seconds < 40) {
        stars++;
    };
    if (moves < 17) {
        stars ++;
    };
    return stars;
}

function giveHint() {
    if (openCards.length === 1 ) {
        matchingCard = array.find(function(element) {
            return element.icon == openCards[0].icon && element.position != openCards[0].position;
        });
        console.log(matchingCard)
        let card2Node = document.getElementById(matchingCard.position);
        card2Node.setAttribute('class', 'card hint');
}
    else {
        card1 = array.find(function(element) {
            return element.matched === false;
        });
        card2 = array.find(function(element) {
            return element.icon == card1.icon && element.position != card1.position;
        })
        let card1Node = document.getElementById(card1.position);
        let card2Node = document.getElementById(card2.position);

        card1Node.setAttribute('class', 'card hint');
        card2Node.setAttribute('class', 'card hint');
    }
    hintsUsed++;
}

function restartGame() {
    moveCounter = 0, openCards=[], array=[], remainingMatches=icons.length, hintsUsed=0;
    startTime = Date.now();
    document.getElementById('move-counter').innerText = moveCounter;
    document.getElementById('popup').style.display='none';
    while (gameSurface.firstChild) {
    gameSurface.removeChild(gameSurface.firstChild);
    }
    startGame();
}

startGame();
