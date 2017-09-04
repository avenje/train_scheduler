$(document).ready(function() {
      // Initialize Firebase
      var currentTime = new moment ().format("HH:mm");

      $("#currentTime").text("Current time is:  " + currentTime);

      var timeEntered = $('.timeEntered').val();

      if (!moment(timeEntered,'HH:mm').isValid()) {
        console.log('Invalid Date');
      } else {
        console.log('Valid Date');
      }

      var config = {
        apiKey: "AIzaSyCEpaBZSXnZnx_-umoXagNR-FoDBEluXkg",
        authDomain: "eurorail-schedule.firebaseapp.com",
        databaseURL: "https://eurorail-schedule.firebaseio.com",
        projectId: "eurorail-schedule",
        storageBucket: "eurorail-schedule.appspot.com",
        messagingSenderId: "614693859028"
      };

      firebase.initializeApp(config);

      var database = firebase.database();

    // Button for adding trains
    $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var dest = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var trainRate = $("#rate-input").val().trim();
    var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % trainRate;
    var minutesTillTrain = trainRate - tRemainder;
    var NextArrival = moment().add(minutesTillTrain, "minutes");
    var minutesAway = moment(NextArrival).format("HH:mm");

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: dest,
      start: trainStart,
      rate: trainRate,
      minutesAway: minutesAway,
      minutesTillTrain: minutesTillTrain
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });

  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var dest = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;
  // Hardcore math using moment.js
  var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % trainRate;
  var minutesTillTrain = trainRate - tRemainder;
  var NextArrival = moment().add(minutesTillTrain, "minutes");
  var minutesAway = moment(NextArrival).format("HH:mm");

  // Add data to table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + trainRate + "</td><td>" + minutesAway + "</td><td>" + minutesTillTrain + "</td><td>");
});

  //Refreshes train data every minute
  setInterval(function(){
    location.reload();
  }, 60000)
});