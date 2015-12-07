console.log("Hello");
var mediaConstraints = {
  audio: true
};

navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

function onMediaSuccess(stream) {
  var mediaRecorder = new MediaStreamRecorder(stream);
  mediaRecorder.mimeType = 'audio/ogg';
  mediaRecorder.audioChannels = 1;
  mediaRecorder.ondataavailable = function (blob) {
    var blobURL = URL.createObjectURL(blob);
    document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
  };
  mediaRecorder.start(3000);
}

function onMediaError(e) {
  console.log("Media Error", e);
}