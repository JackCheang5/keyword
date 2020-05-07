 // set up basic variables for app
const record = document.querySelector('.record');
const soundClips = document.querySelector('.sound-clip');
const mainSection = document.querySelector('.main-controls');
const finish = document.querySelector('#ok');
//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.'); // check support
  const constraints = { audio: true }; // set audio
  let chunks = []; // audio cache

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
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