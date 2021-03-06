command = require('./command');
var NodeWebcam = require('node-webcam')
const fs = require('fs');
const request = require('request');

const {baseURL} = require('./baseURL');
const url = require('url');
const { URL } = url;

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr){ sys.puts(stdout); return stdout; }

var Webcam = NodeWebcam.create();
/*
async function ttsCommand(msg) {
  var commandLine = 'python3 /root/tts.py ' + msg;
  await execPromise(commandLine);
}

const execPromise = str => {
  return new Promise ((resolve, reject) => {
    exec(str, (err, stdout, stderr) => {
      if(err) reject (err);
      else resolve(stdout);
  })
  })
};
*/
const captureImage = path => new Promise ((resolve, reject) => {
  Webcam.capture(path, (err, data) => {
      if (err) reject(err)
      else resolve(data);
  })
});

const fileSend = (url, key, filepath, filename) =>
 new Promise((resolve, reject) => {
   const r = request.post(url, (err, response, body) => {
     if (err) reject(err);
     else resolve(body);
   });
   const form = r.form();
   form.append(key, fs.createReadStream(filepath), {
     filename
   });
 });

module.exports = {
  videoModule : async function(){
    while(1){
    await captureImage('/root/video');

    result = await fileSend(
      url.resolve(baseURL, '/videostream'),
      'abc',
      '/root/video.jpg',
      'video.jpg'
     )
  }

  }
};
