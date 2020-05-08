const record = document.querySelector('.record');
const soundClip = document.querySelector('.sound-clip');
const save = document.querySelector('#ok');

if (navigator.mediaDevices.getUserMedia) {
  console.log('support confirmed');
  const constraints = {audio: true};
  let chunks = [];
  function success(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    let recording = false;
    record.onclick = function() {
      if (recording == false) {
        mediaRecorder.start();
        console.log('Start Recording');
        record.textContent = 'STOP';
        soundClip.innerHTML = '';
        recording = true;      
      } else {
        mediaRecorder.stop();
        console.log('Stop Recording');
        record.textContent = 'RECORD';
        recording = false;
      }
    }

    mediaRecorder.onstop = function() {
      const keyword = prompt('Keyword:', 'Enter Here');
      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      clipContainer.classList.add('clip');
      audio.setAttribute('conrtrols', '');

      if (keyword === null) keyword = "Undefined";
      else clipLabel.textContent = keyword;

      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(audio);
      soundClip.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, {'type' : 'audio/ogg; codecs=opus'});
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;

      clipLabel.onclick = function() {
        const existKeyword = clipLabel.textContent;
        const newKeyword = prompt('Change the keyword?');
        if (newKeyword === null) clipLabel.textContent = existKeyword;
        else clipLabel.textContent = newKeyword;
      }

      save.onclick = function() {
        let fd = new FormData();
        fd.append('keyword', clipLabel.textContent);
        fd.append('audio', blob);
        $.ajax({
          type: 'POST',
          url: './audio',
          data: fd,
          processData: false,
          contentType: false,
        })
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  function fail(error) {
    console.log('Error occuried: ' + error);
  }

  navigator.mediaDevices.getUserMedia(constraints)
  .then(success, fail);
} else {
  console.log('not supported');
}