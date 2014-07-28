'user strict';

var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {

  var meter
  , endsOfGame = true
  , showingWin = false;

  var button2  = new five.Button(2);
  var button4  = new five.Button(4);
  var startBtn = new five.Button(12);

  var leds = [
    new five.Led(7),
    new five.Led(3),
    new five.Led(5),
    new five.Led(9),
    new five.Led(10),
    new five.Led(11),
    new five.Led(8)
  ];

  function resetAllLeds() {
    for (var i = 0; i < leds.length; i++) {
      leds[i].off();
    }
  }

  resetAllLeds();

  leds[0].on()
  leds[6].on()

  // Start
  //
  startBtn.on('down', function() {
    meter      = 0;
    endsOfGame = true;
    showingWin = false;
    resetAllLeds();

    var i = 0;
    function countDown() {
      resetAllLeds();
      if (i < 3) {
        leds[i].on();
        leds[6-i].on();
        i++;
        setTimeout(countDown, 1000);
      } else {
        leds[3].on();
        endsOfGame = false;
      }
    }

    countDown();
  });


  function evaluate(meter, scale) {

    if (scale == null) scale = 10;

    if (meter <= -scale) { // Win
      leds[0].on();
      leds[1].off();
      endsOfGame = true;
      console.log('Green Won!!!');
      showWinLight(0);
    }
    else if (-scale < meter && meter <= -scale * 2/5) { // Level -2
      leds[1].on();
      leds[2].off();
    }
    else if (-scale * 2/5 <  meter && meter <= -scale * 1/5) { // Level -1
      leds[1].off();
      leds[2].on();
      leds[3].off();
    }
    else if ( -scale * 1/5 <  meter && meter <   scale * 1/5) { // Level 0
      leds[2].off();
      leds[3].on();
      leds[4].off();
    }
    else if (  scale * 1/5 <= meter && meter <   scale * 2/5) { // Level 1
      leds[3].off();
      leds[4].on();
      leds[5].off();
    }
    else if (scale * 2/5 <= meter && meter <   scale) { // Level 2
      leds[4].off();
      leds[5].on();
    }
    else if (scale <= meter) { // Win
      leds[5].off();
      leds[6].on();
      endsOfGame = true;
      console.log('Blue Won!!!');
      showWinLight(1);
    }
  };


  button2.on("down", function() {
    console.log('btn2')
    if (!endsOfGame) {
      evaluate(++meter);
    }
  });

  button4.on("down", function() {
    console.log('btn4')
    if (!endsOfGame) {
      evaluate(--meter);
    }
  });

  function showWinLight(who) {
    showingWin = true;
    var y = (who === 0) ? 3 : 0;
    var i = 1;
    leds[i].fadeIn(80);

    function showLight() {
      if (showingWin) {
        leds[i].fadeOut(80);
        i = (i + y) % 5 + 1;
        leds[i].fadeIn(80, showLight);
      }
    }

    showLight();
  }

});
