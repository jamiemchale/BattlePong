/*
 * Please see the included LICENSE.md file for license terms and conditions.
 */
/* jshint browser:true */
(function() {

    var myFirebaseRef;
    var myPlayerId = "player1";
	// Wait for DOM tree is ready for access
    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.getElementById('gameScene');
        // make canvas full screen
        var width = screen.availWidth;
        var height = screen.availHeight;

        // get canvas 2d context
        // With canvas 2d context, you can draw anything freely on the canvas.
        // See https://docs.webplatform.org/wiki/tutorials/canvas/canvas_tutorial
        // for tutorials of using canvas.
    }, false);
    
    
    var paddle = $("#paddle");
    
    if (window.DeviceOrientationEvent) {
  //document.getElementById("doEvent").innerHTML = "DeviceOrientation";
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    // gamma is the left-to-right tilt in degrees, where right is positive
      
      
    var tiltLR = eventData.gamma;
      
      if (tiltLR < 0){
          console.log("left");
          paddle.stop().animate({
              "left": 0
          }, 1000);
      }else if (tiltLR > 0){
          console.log("right");
          paddle.stop().animate({
              "left": window.innerWidth - paddle.width()
          }, 1000);
      }else {
          console.log("stop");
          paddle.stop();
      }

    // beta is the front-to-back tilt in degrees, where front is positive
    //var tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    //var dir = eventData.alpha

    // call our orientation event handler
    //console.log(tiltLR + " LR, " + tiltFB + " FB, " + dir + " dir");
  }, false);
}

    init();

    function init() {
      myFirebaseRef = new Firebase("https://battlepong.firebaseio.com/");
      myFirebaseRef.child('players').set({
          'player1': { score: 0},
          'player2': { score: 0}
      });
      watchForThrow();
      throwball(20, 100);
    }

    function throwball (yPercent, velocity) {
      myFirebaseRef.child('throws').push({
        'ypercent': yPercent,
        'velocity': velocity,
        'complete': false,
        'caught': false,
        'thrower': myPlayerId
      });
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

    function updateScore(playerId, change) {
      var scoreRef = myFirebaseRef.child('players').child(playerId).child('score');
      scoreRef.transaction(function(currentScore) {
        return currentScore+change;
      });
    }

}());
