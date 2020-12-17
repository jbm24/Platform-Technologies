var moment = require('moment')().format('HH:mm:ss');
var five = require("johnny-five");
var board = new five.Board();
var mysql = require('mysql');
var date_ob = new Date();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "platform_tech"
});


var count = 0;
var id = 0;

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO people_data (no_of_people, time_of_last) VALUES ('"+ count + "','"+ moment +"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    id++;
  });
});

console.log(date_ob.getTime());
console.log(moment);

board.on("ready", function() {

  // Create a new `motion` hardware instance.
  var motion = new five.Motion(2);

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("motionstart");
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {
    console.log("motionend");
    count++;
    console.log(count);
    var update = "UPDATE people_data SET no_of_people = '"+ count +"' WHERE id = '"+ id +"'";
    con.query(update, function (err, result) {
      if (err) throw err;
      console.log("1 record updated");
    });
  });

  // "data" events are fired at the interval set in opts.freq
  // or every 25ms. Uncomment the following to see all
  // motion detection readings.
  // motion.on("data", function(data) {
  //   console.log(data);
  // });
});