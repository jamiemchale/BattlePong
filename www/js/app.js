/*
 * Please see the included LICENSE.md file for license terms and conditions.
 */
/* jshint browser:true */
(function() {
    document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);
    function onDeviceReady() {
      // set orientation
      intel.xdk.device.setRotateOrientation('portrait');
      init();
    }

    var myFirebaseRef = new Firebase("https://battlepong.firebaseio.com/");
    var myPlayerId = "player1";
    var iHaveTheBall = true;

	// Wait for DOM tree is ready for access
    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.getElementById('gameScene');
        // make canvas full screen
        var width = screen.availWidth;
        var height = screen.availHeight;
        canvas.width = width;
        canvas.height = height;

        // get canvas 2d context
        // With canvas 2d context, you can draw anything freely on the canvas.
        // See https://docs.webplatform.org/wiki/tutorials/canvas/canvas_tutorial
        // for tutorials of using canvas.
        var context = canvas.getContext('2d');

        // load and draw image on the canvas
        var img = new Image();
        img.onload = function() {
            context.drawImage(img, (width - img.width) / 2, (height - img.height) / 2);
        };
        img.src = "asset/logo.png";
    }, false);

    function init() {

      myFirebaseRef.child('players').set({
          'player1': { score: 0},
          'player2': { score: 0}
      });
      watchForThrow();
      watchScores();
      watchAcceleration();
    }

    function throwball (yPercent, velocity) {
      iHaveTheBall = false;
      myFirebaseRef.child('throws').push({
        'ypercent': yPercent,
        'velocity': velocity,
        'complete': false,
        'caught': false,
        'thrower': myPlayerId
      });
    }

    function watchAcceleration() {
      function onSuccess(acceleration) {
          $('#acceleration').text(Math.abs(acceleration.y));
          if (iHaveTheBall && Math.abs(acceleration.y) > 3) {
            throwball(20, Math.abs(acceleration.y));
          }
      };

      function onError() {
          alert('onError!');
      };

      var options = { frequency: 3000 };
      var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    function watchForThrow () {
      myFirebaseRef.child("throws").on("child_added", function(snapshot,  prevChildKey) {
        if (snapshot.val().complete == false)
          startRoll(snapshot.key(), snapshot.val());
      });
    }

    function startRoll (id, snap) {
      catchBall(id);
      // missBall(id, snap.thrower);
    }

    function catchBall (throwId) {
      myFirebaseRef.child("throws").child(throwId).update({
        complete: true,
        caught: true,
      });

      updateScore(myPlayerId, 10);
    }

    function missBall (throwId, from) {
      myFirebaseRef.child("throws").child(throwId).update({
        complete: true
      });

      updateScore(from, 10);
    }

    function watchScores() {
      myFirebaseRef.child('players/player1/score').on('value', function(snap) {
        $('#score-player1').text(snap.val());
      });

      myFirebaseRef.child('players/player2/score').on('value', function(snap) {
        $('#score-player2').text(snap.val());
      });
    }

    function updateScore(playerId, change) {
      var scoreRef = myFirebaseRef.child('players').child(playerId).child('score');
      scoreRef.transaction(function(currentScore) {
        return currentScore+change;
      });
    }

}());
