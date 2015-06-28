var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Settings = require('settings');

// Main Window (Watchface replica)
var main_window = new UI.Window({
  fullscreen: true,
});

// Watchface elements
var main_time = new UI.TimeText({
  position: new Vector2(0, 90),
  size: new Vector2(144, 30),
  font: 'roboto-bold-subset-49',
  textAlign: 'center',
  text: '%I:%M'
});

var main_date = new UI.TimeText({
  position: new Vector2(10, 65),
  size: new Vector2(75,15),
  font: 'roboto-condensed-21',
  textAlign: 'left',
  text: '%B %d'
});

var bar_partition = new UI.Rect({
  position: new Vector2(10, 95),
  size: new Vector2(124, 2),
});

// temp/hardcoded variables ---------remove---------
var call_number = '+14258762036';
var sms_data = [
  {recipients: ['+14258762036'], body: 'Yo, I think I might be dead here in a second, so you should call me. :l'},
  {recipients: [], body: ''},
  {recipients: [], body: ''}
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

if (options.recipients) {
  sms_data = options.recipients;
  console.log('sms_data: ' + sms_data);
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

// Text recipients
main_window.on('click', 'select', function(e) {
  ajax({
    url: 'https://calling.phoneyscape.com/sms',
    type: 'json',
    method: 'POST',
    data: {
      to: sms_data[escalation_level].recipients,
      body: sms_data[escalation_level].body
    },
  }, function(d){
    Vibe.vibrate('short');
    console.log('Successful text(s).');
  }, function(error){
    Vibe.vibrate('double');
    if (error){
      console.log('Failed text(s):' + error.message);
    } else {
      console.log('Failed text(s). Error not returned.');
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
main_window.add(main_date);
main_window.add(bar_partition);
main_window.show();
