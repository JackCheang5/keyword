 // set up basic variables for app

const record = document.querySelector('.record');
const soundClips = document.querySelector('.sound-clip');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const finish = document.querySelector('#ok');

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.'); // check support

  const constraints = { audio: true }; // set audio
  let chunks = []; // audio cache

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    visualize(stream);
    let recording = false;
    record.onclick = function() {
      if (recording == false) {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.textContent = 'Stop'
        soundClips.innerHTML = '';
        recording = true;
      } else {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.textContent = 'Record'
        recording = false;
      }
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter the keyword','Untitled');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');

      if(clipName === null) {
        clipLabel.textContent = 'Untitled';
      } else {
        clipLabel.textContent = clipName;
      }
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(audio);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      finish.onclick = function() {
        console.log(blob);
        console.log(clipName);
        console.log(clipLabel.textContent);
        
        const fd = new FormData();
        fd.append('keyword', clipLabel.textContent);
        fd.append('audio', 'testing');
        $.ajax({
          type: 'POST',
          url: './audio',
          data: fd,
          processData: false,
          contentType: false,
        })
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Change the keyword?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

