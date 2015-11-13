/*
 * Please see the included LICENSE.md file for license terms and conditions.
 */
/* jshint browser:true */
(function() {
    var myFirebaseRef;
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

        myFirebaseRef = new Firebase("https://battlepong.firebaseio.com/");

        watchForRoll();
        throwball(20, 100);

    }, false);

    function throwball (yPercent, velocity) {
      myFirebaseRef.child('throws').push({
        'ypercent': yPercent,
        'velocity': velocity,
        'complete': true,
        'caught': false,
        'thrower': 'player1'
      });
    }

    function watchForRoll () {
      myFirebaseRef.child("throws").on("child_added", function(snapshot,  prevChildKey) {
        if (snapshot.val().complete == false)
          startRoll(snapshot.val());
      });
    }

    function startRoll (snap) {
      console.log(snap);
    }

}());
