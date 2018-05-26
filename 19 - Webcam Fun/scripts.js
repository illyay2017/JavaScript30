const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
let intvl;

let rClicked = null;
let gClicked = null;
let bClicked = null;

function getVideo () {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      // the below window.URL.createObjectURL function wraps the local
      // media stream (which is an object) into a sort of URL so that the HTML element
      // video can understand /parse it out it properly
      // * NOTE: this is deprecated, and srcObject is the new standard
      // video.src = window.URL.createObjectURL(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`You must allow webcam access to be able to use this app ${err}`);
    });
};

function paintToCanvas(red = null, green = null, blue = null) {
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;
  intvl = setInterval(function(red=null, green=null, blue=null) {
    ctx.drawImage(video, 0, 0, width, height);
    if (red !== null && green !== null && blue !== null) {
      let pixels = ctx.getImageData(0, 0, width, height);
      pixels = removeSpecificRange(pixels, red, green, blue);
      ctx.putImageData(pixels, 0, 0);
    }
  }, 16, rClicked, gClicked, bClicked);
};

function takePhoto() {
  snap.currentTime = 0;
  snap.play(); 

  const data = canvas.toDataURL('image/jpeg');
  /* one way to create an image:
  NOTE: a bit unclean but can be polished
  const pic = new Image(300, 300);
  pic.src = data;
  strip.appendChild(pic);
  */

  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'pic');
  link.innerHTML = `<img src=${link.href} alt="Click to Download" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;  //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;   //GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  //BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 350] = pixels.data[i + 0];  //RED
    pixels.data[i + 200] = pixels.data[i + 1];  //GREEN
    pixels.data[i - 350] = pixels.data[i + 2];  //BLUE
  }
  return pixels;
}

function greenSreen(pixels) {
  const levels = {};
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;  
      }
  }
  return pixels;
}

function getPixelsToGreenScreen(e) {
  e.preventDefault();
  if (e.target !== canvas) return;
  const {offsetX: x, offsetY: y} = e;
  const actualX = Math.round(x * (video.videoWidth / e.target.clientWidth));
  const actualY = Math.round(y * (video.videoHeight / e.target.clientHeight));
  const pixelsClickedOn = ctx.getImageData(actualX, actualY, 1, 1);
  const [R, G, B] = [... pixelsClickedOn.data];
  rClicked = R;
  gClicked = G;
  bClicked = B;
  clearInterval(intvl);  
  paintToCanvas();
}

function removeSpecificRange(pixels, xRed, xGreen, xBlue) {
  if (!xRed || !xGreen || !xBlue) return pixels;
  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    if (red >= xRed - 35
      && green >= xGreen - 35
      && blue >= xBlue - 35
      && red <= xRed + 35
      && green <= xGreen + 35
      && blue <= xBlue + 35) {
        pixels.data[i + 3] = 0;  
      }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
document.addEventListener('click', getPixelsToGreenScreen);
