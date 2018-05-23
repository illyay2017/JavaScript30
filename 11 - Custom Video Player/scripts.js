/* SPECS:

DONE---> 1) make play button toggle playback, and make click on the video player toggle playback 
DONE---> 2) make sliding the volume bar change the volume accordingly;
DONE---> 3) make sliding the playback speed bar change the playback speed accordingly;
DONE---> 4) make clicking the skip forward button skip forward 25s
DONE---> 5) make clicking the skip back button skip back 10s
6) make the progress bar reflect video progress, and clicking on it reflect to which 
  point in the video we need to skip

*/

// get our elements
// VIDEO:
const video = document.querySelector('.viewer');

// PLAYER BUTTONS:
const playerButtons = document.querySelectorAll('.player__button');
const toggle = playerButtons[0];
const fullScreen = playerButtons[3];
const skipButtons = document.querySelectorAll('[data-skip]');
//PROGRESS BAR:
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
// SLIDERS:
const sliders = document.querySelectorAll('.player__slider');


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

function updateprogress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function handleProgressBarClick(e) {
  const progressTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = progressTime;
}

function changeFullScreenIcon(e) {
  if (e.type === 'mouseover') {
    this.textContent = '[ ] => [    ]';
  } else if (e.type === 'mouseleave') {
    this.textContent = '[ ]';
  } else if (e.type === 'click') {
    if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen();
    }
  }
}

let mousedown = false;
// hook up event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('timeupdate', updateprogress);

skipButtons.forEach(button => button.addEventListener('click', skip));
sliders.forEach(slider => slider.addEventListener('change', handleRangeUpdate));
toggle.addEventListener('click', togglePlay);
fullScreen.addEventListener('mouseover', changeFullScreenIcon);
fullScreen.addEventListener('mouseleave', changeFullScreenIcon);
fullScreen.addEventListener('click', changeFullScreenIcon);

progress.addEventListener('click', handleProgressBarClick);
progress.addEventListener('mousemove', (e) => mousedown && handleProgressBarClick(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);