$(document).ready(function() {
  // GLOBAL VARIABLES
  var countdown;
  var delay = 0;
  var upDownToggle = 1;
  var running = false;
  var redTimeout;
  var yellowTimeout;
  var greenTimeout;

  // SOUNDS

  var tick = new Howl({
    src: ['./sounds/tick.ogg', './sounds/tick.mp3']
  });
  var start = new Howl({
    src: ['./sounds/start.ogg', './sounds/start.mp3']
  });
  var end = new Howl({
    src: ['./sounds/end.ogg', './sounds/end.mp3']
  });

  window.Howler.volume(0.4);

  // FUNCTIONS

  function redLightOn() {
    $('#red-light').css("backgroundColor", "#FF4E4E");
    $('#red-light').css("border", "solid 0.25em #AD0A0A");
  }

  function redLightOff() {
    $('#red-light').css("backgroundColor", "#6E0000");
    $('#red-light').css("border", "solid 0.25em #440000");
  }

  function yellowLightOn() {
    $('#yellow-light').css("backgroundColor", "#FFF43C");
    $('#yellow-light').css("border", "solid 0.25em #B6AC04");
  }

  function yellowLightOff() {
    $('#yellow-light').css("backgroundColor", "#867C00");
    $('#yellow-light').css("border", "solid 0.25em #5B5400");
  }

  function greenLightOn() {
    $('#green-light').css("backgroundColor", "#53C6A3");
    $('#green-light').css("border", "solid 0.25em #008B61");
  }

  function greenLightOff() {
    $('#green-light').css("backgroundColor", "#007356");
    $('#green-light').css("border", "solid 0.25em #005842");
  }

  function getRandDuration(min, max) {
    return Math.random() * (max - min) + min;
  }

  function timer() {
    if (delay <= 0) {
      document.getElementById("timer").innerHTML = "";
      redLightOn();
      $("#parent-wrapper").fadeIn();
      cycleLights();
      clearInterval(countdown);
      return;
    }
    tick.play();
    document.getElementById("timer").innerHTML = delay;
    delay--;
  }

  function cycleLights() { //Core recursive function that runs the game.
    redTimeout = setTimeout(function() {
      redLightOff();
      greenLightOn();
      start.play();
      yellowTimeout = setTimeout(function() {
        greenLightOff();
        yellowLightOn();
        greenTimeout = setTimeout(function() {
          yellowLightOff();
          redLightOn();
          end.play();

          cycleLights();

        }, $("#yellow-duration").val()); //Duration until red light start
      }, getRandDuration(250, $("#green-duration-max").val())); //Duration until yellow light start.
    }, getRandDuration(250, $("#red-duration-max").val())); //Duration until green light start.
  }

  $("#up-down-arrow").click(function() { //Display settings.

    if (upDownToggle % 2 == 0) {
      $("#up-down-arrow").html('&#9660;');
      $('#settings').animate({
        "margin-top": "-12rem"
      }, 500, function() {});
    } else {
      $("#up-down-arrow").html("&#9650;");
      $('#settings').animate({
        "margin-top": "2.5rem"
      }, 500, function() {});
    }
    upDownToggle++;
  });

  $("#info-icon").click(function() { //Display info dialog.
    $("#dialog").dialog({
      minWidth: $(window).width() * .66,
      modal: true,
      resizable: false,
      draggable: false
    });
  });

  $("#red-light").click(function() { //Stop the game by clicking on the red light.
    clearInterval(countdown);
    window.clearTimeout(redTimeout);
    window.clearTimeout(yellowTimeout);
    window.clearTimeout(greenTimeout);
    greenLightOff();
    yellowLightOff();
    redLightOff();
    running = false;
  });

  $("#green-light").click(function() { //Start the game by clicking on the green light.
    if (!running) {
      running = true;
      greenLightOff();
      delay = $("#delay-start").val();
      if (delay > 0) {
        $("#parent-wrapper").fadeOut();
      }
      countdown = setInterval(timer, 1000); //At the end of interval, it begins the game
    }
  });

  $("#volume").change(function() {
    window.Howler.volume($("#volume").val());
  });
});
