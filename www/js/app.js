/*
 * Please see the included LICENSE.md file for license terms and conditions.
 */
/* jshint browser:true */
(function() {
    document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);               
    function onDeviceReady(){
    // set orientation
    intel.xdk.device.setRotateOrientation('portrait');
}        

    var myFirebaseRef;
    var myPlayerId = "player1";
	// Wait for DOM tree is ready for access
    document.addEventListener('DOMContentLoaded', function() {


    }, false);

    init();

    function init() {
      myFirebaseRef = new Firebase("https://battlepong.firebaseio.com/");
      myFirebaseRef.child('players').set({
          'player1': { score: 0},
          'player2': { score: 0}
      });
      watchForThrow();
      throwball(20, 100);
        $( "#player1" ).click(function() {
            player = "player1";
            $(".confirmPlayer").hide();
            $(".paddle").show();
        });
        $( "#player2" ).click(function() {
            player = "player2";
            $(".confirmPlayer").hide();
            $(".paddle").show();
        });
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
