/* SPECS:

1) make play button toggle playback, and make click on the video player toggle playback
2) make sliding the volume bar change the volume accordingly;
3) make sliding the playback speed bar change the playback speed accordingly;
4) make clicking the skip forward button skip forward 25s
5) make clicking the skip back button skip back 10s
6) make the progress bar reflect video progress

*/

// get our elements
// VIDEO:
const video = document.querySelector('.viewer');

// PLAYER BUTTONS:
const playerButtons = document.querySelectorAll('.player__button');
const toggle = playerButtons[0];
const skipButtons = document.querySelectorAll('[data-skip]');
//PROGRESS BAR:
const progressBar = document.querySelector('.progress__filled');
// SLIDERS:
const sliders = document.querySelectorAll('.player__slider');

// build our functions
/*
for spec 1:
 -- we need a togglePlay function 
for spec 2:
 -- we need a changeVolume function
for spec 3:
 -- we need a changePlaySpeed function
for spec3:
 -- we need a skipForward function
for spec5:
 -- we need a skipBack function
for spec6:
 -- we need a updateProgress function???

*/

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updatePlayButton() {
  this.paused ? toggle.textContent = '||' : toggle.textContent = '►';
}

function skip() {
  video.currentTime += parseInt(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;  
}


// hook up event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);

skipButtons.forEach(button => button.addEventListener('click', skip));
sliders.forEach(slider => slider.addEventListener('change', handleRangeUpdate));



toggle.addEventListener('click', togglePlay);
// volume.addEventListener('click', changeVolume);