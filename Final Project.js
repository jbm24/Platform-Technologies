var moment = require('moment')().format('HH:mm:ss');
var five = require("johnny-five"), board, lcd;
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

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO people_data (no_of_people, time_of_last) VALUES ('"+ count + "','"+ moment +"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});


board.on("ready", function() {

  //lcd initialization
  lcd = new five.LCD({
    pins: [12, 11, 5, 4, 3, 2],
    backlight: 13
  });

  // Create a new `motion` hardware instance.
  var motion = new five.Motion(7);

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

  // lcd writing
  lcd.cursor(0, 0);
  lcd.print("# of people:");

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  motion.on("motionstart", function() {
    console.log("motionstart");
  });

  var getCount = "SELECT id FROM people_data ORDER BY id DESC;"
  con.query(getCount, function (err, result) {
  if (err) throw err;
  id = result[0].id;
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
    var grab = "SELECT no_of_people FROM people_data ORDER BY id DESC";
    con.query(grab, function (err, results) {
      if (err) throw err;
      lcd.cursor(1, 0).print(results[0].no_of_people);
    });
  });

});