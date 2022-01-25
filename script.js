const allAudio = document.querySelectorAll("audio")
const allVolumeInputs = document.querySelectorAll(".seek-slider-volume")
const playPauseBtn = document.querySelector(".play-btn")


const timerButton = document.querySelector('.timer')
const timerContainer = document.querySelector('.timer-container')
const audioCards = document.querySelector('#audio-levels')


// Storage

function clearStorage() {
    localStorage.clear();
    location.reload();
}

//Check to see if there are items in storage, if so, parse them and get them. If not, set an empty array for us to work with in this session
let savedAudioLevels = localStorage.getItem('savedAudio') ? JSON.parse(localStorage.getItem('savedAudio')) : [];

//jobItems is our custom key, and the cards are in the jobArray (parsed to strings) as our values. Set everything into localStorage
localStorage.setItem('savedAudio', JSON.stringify(savedAudioLevels));

//Get the items in our storage, if any, for when the page loads. We need to parse these from the string format so we can work with the data.
const audioData = JSON.parse(localStorage.getItem('savedAudio'));

//loop through our data saved in the array from the previous sessions and recreate cards for them.
  audioData.forEach(audio => {
    createTestBox(audio.level, audio.key)
    setAudioHandles(audio.level, audio.key)
});

//Event Listener for volume changes
function createStorage(e){
    let level = e.target.value;
    let key = (Math.random() + 1).toString(36).substring(7);

    let audio = {
        level: level,
        key: key
    }

    createTestBox(level, key)
    savedAudioLevels.push(audio)
    localStorage.setItem('savedAudio', JSON.stringify(savedAudioLevels))
}

//add the storage info to the blue box below just to see it working
function createTestBox(level, key){
    const card = `
        <p class="level">${level}<p>
        <p>${key}</p>
    `;
    audioCards.innerHTML += card
}

//Function to loop through and target the audio handles and set them into the saved audio position from storage
function setAudioHandles(level, key){
    console.log(savedAudioLevels)
    for(let i = 0; i < allVolumeInputs.length; i++){
       allVolumeInputs[i].value = level
       allVolumeInputs[i].parentNode.parentNode.parentNode.firstElementChild.volume = level / 100
    }
}

// Individual Audio Players 

function restartAudio(ev){
    ev.preventDefault();
    var audio = ev.target.parentNode.parentNode.parentNode.parentNode.firstElementChild;
    audio.currentTime = 0
}

function adjustVolume (ev) {
    ev.preventDefault();
    var audio = ev.target.parentNode.parentNode.parentNode.firstElementChild;
    var value = ev.target.value;
    audio.volume = value / 100
}

// Master Audio Controls

playPauseBtn.addEventListener('click', (e) => {
    allAudio.forEach((audio) => {
        audio.paused ? audio.play() : audio.pause();
    })
})


// Timer

const timeOptions = [0, 2000, 4000, 6000, 8000]
let currentTime = 0
let currentText = ''

  function setTimer(){
    
    console.log(currentTime)    
    console.log(currentText)

    if (currentTime === 0){
        currentTime = timeOptions[1]
        currentText = currentTime / 1000
        myTimeout(currentTime, currentText)
    } else if (currentTime === 2000) {
        currentTime = timeOptions[2]
        currentText = currentTime / 1000
        myTimeout(currentTime, currentText)
    } else if (currentTime === 4000){
        currentTime = timeOptions[3]
        currentText = currentTime / 1000
        myTimeout(currentTime, currentText)
    } else if (currentTime === 6000){
        currentTime = timeOptions[4]
        currentText = currentTime / 1000
        myTimeout(currentTime, currentText)
    } else if (currentTime === 8000){
        currentTime = timeOptions[0]
        currentText = ''
        myTimeout(currentTime, currentText)
    }
}

function myTimeout(time, text){
    setTimeout(function () {
        playPauseBtn.click();
    }, time);
    text ? timerContainer.innerHTML = 'Timer set to ' + text + ' seconds' : timerContainer.innerHTML = '';
}
    
 window.onload = function() {
    timerButton.addEventListener('click', setTimer);
  };





//Bubbles and Canvas Animation 

/* DOTS SETTINGS */

var winWidth= window.innerWidth;
var winHeight = window.innerHeight;
var canvas = document.getElementById('stage');

canvas.height = winHeight;
canvas.width = winWidth;

var context = canvas.getContext('2d');
var canvasWidth = canvas.offsetWidth;
var canvasHeight = canvas.offsetHeight;
var dots = [];
var amount =  20;
var colors = ['#F6D5CC'];
var curX;
var curY;

/* GRAB ALL ICON IMAGES FOR REFERENCE*/

var imageArray = [];

function getIcons() {
  var icons = document.querySelectorAll('.hero-icon');
  
  icons.forEach(icon => {
    let iconSource = icon.src
    imageArray.push(iconSource)
  })
  console.log(imageArray)
}

getIcons()

/* DOTS PROTOTYPE */

function Dot(){}

Dot.prototype.create = function(){
  this.radius = Math.floor((Math.random() * 40) + 3);
  this.originalSize = this.radius;
  this.x = Math.floor((Math.random() * canvasWidth) + 1);
  this.y = Math.floor((Math.random() * canvasHeight) + 1);
  this.speed = (Math.random()*0.4)+1;
  this.vx = (Math.random() * this.speed) - this.speed;
  this.vy = (Math.random() * this.speed) - this.speed;
  this.color = colors[(Math.floor((Math.random() * colors.length)))];
  this.alpha = Math.random()+0.2;
  this.expanded = false;
  this.imageSource = imageArray[(Math.floor((Math.random() * imageArray.length)))];
};

Dot.prototype.animate = function(){
  this.move();
  this.expand();
  this.draw();
};

Dot.prototype.iconImage = function(){
    console.log(this.imageSource);
    context.drawImage(this.imageSource, 10, 10);
} 

Dot.prototype.draw = function(){
  context.beginPath();
  context.globalAlpha = this.alpha;
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  context.fill();
};

Dot.prototype.move = function(){

  this.x += this.vx*this.speed;
  this.y += this.vy*this.speed;

  // bounce on width
  if(this.x >= canvasWidth){
    this.vx = -this.speed;
  }else if(this.x < 0){
    this.vx = this.speed;
  }else{
    this.vx *= 1 ;
  }


  // bounce on height
  if(this.y >= canvasHeight){
    this.vy = -this.speed;
  }else if(this.y < 0){
    this.vy = this.speed;
  }else{
    this.vy *= 1 ;
  }

};

Dot.prototype.expand = function(){
   if(this.x <= (curX + 100) && this.x >= (curX - 100) && this.y <= (curY + 100) && this.y >= (curY - 100) ){
     if(this.radius >= this.originalSize * 3) return false;
     this.radius *= 1.02;
     this.expanded = true;
   }else if(this.expanded){
     this.radius *= 0.98;
     this.expanded = this.radius <= this.originalSize ? false: true;
   }
};


/* RENDERING THE CANVAS */

function spawn(){
  for(var i =0; i <= amount; i++){
    var dot  = new Dot;
    dot.create();
    dots.push(dot);
  }
}

function draw(){
  for(var i = 0; i < dots.length; i++){
    dots[i].animate();
  }
}

/* KICK IT OFF */

spawn(--amount);

function render() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  draw();
  requestAnimationFrame(render);
}

render();

document.addEventListener('mouseout', function(e){
  curX = -1000;
  curY = -1000;
});

document.addEventListener('mousemove', function(e){
  curX = e.pageX;
  curY = e.pageY;
});