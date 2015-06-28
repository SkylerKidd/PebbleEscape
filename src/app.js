var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Settings = require('settings');

var main_window = new UI.Window({
  fullscreen: true,
});

var main_time = new UI.TimeText({
  position: new Vector2(0, 65),
  size: new Vector2(144, 30),
  font: 'roboto-bold-subset-49',
  textAlign: 'center',
  text: '%I:%M'
});

// temp/hardcoded variables ---------remove---------
var call_number = '+14258762036';
var sms_data = [
  {recipiants: ['+14258762036'], message: 'Yo, I think I might be dead here in a second, so you should call me. :l'},
  {recipiants: [], message: ''},
  {recipiants: [], message: ''}
];

// Prog Variables
var escalation_level = 0;
Settings.config({
  url: 'http://config.phoneyscape.com/',
  },
  function(e) {
    console.log('Opening configurable.');
  },
  function(e) {
    console.log('Closed configurable.');
  }
);


var options = Settings.option();
console.log(JSON.stringify(options));

if (options.call){
  call_number = options.call;
  console.log('call_number: ' + call_number);
}


for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  console.log(JSON.stringify(key), JSON.stringify(localStorage.getItem(key)));
}

// Selection Actions
main_window.on('longpress', 'down', function(e) {

});

// Main Actions
main_window.on('click', 'up', function(e) {
  Vibe.vibrate('short');
  console.log(escalation_level);
  escalation_level += 1;
  setTimeout(function(){
    escalation_level = 0;
  }, 10000);
});

// Text safety net
main_window.on('click', 'select', function(e) {
  ajax({
    url: 'https://calling.phoneyscape.com/call',
    type: 'json',
    method: 'POST',
    data: {
      to: call_number,
    },
  }, function(d){
    Vibe.vibrate('short');
    console.log('Successful call.');
  }, function(error){
    Vibe.vibrate('double');
    if (error){
      console.log('Failed call:' + error.message);
    } else {
      console.log('Failed call. Error not returned.');
    }
  });
});

// Call self
main_window.on('click', 'down', function(e){
  ajax({
    url: 'https://calling.phoneyscape.com/call',
    type: 'json',
    method: 'POST',
    data: {
      to: call_number,
    },
  }, function(d){
    Vibe.vibrate('short');
    console.log('Successful call.');
  }, function(error){
    Vibe.vibrate('double');
    if (error){
      console.log('Failed call:' + error.message);
    } else {
      console.log('Failed call. Error not returned.');
    }  });
});

main_window.add(main_time);
main_window.show();
