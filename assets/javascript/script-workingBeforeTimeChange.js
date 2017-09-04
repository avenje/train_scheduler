  // Initialize Firebase
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
// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var dest = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainRate = $("#rate-input").val().trim();
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: dest,
    start: trainStart,
    rate: trainRate
  };

  // if (trainName != numbers) do alert message

  // Uploads train data to the database
  database.ref().push(newTrain);
  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.rate);
  // Alert
  alert("train successfully added");
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
  // train Info
  console.log(trainName," - train name");
  console.log(dest, " - destination");
  console.log(trainStart, " - start time-min");
  console.log(trainRate, " - frequency-HH:mm");
  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var trainMins = moment().diff(moment.unix(trainStart, "X"), "minutes");
  console.log(trainMins, " - train mins");
  // Calculate the total billed rate
  // var empBilled = trainMins * trainRate;
  // console.log(empBilled);
  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" +
   trainRate + "</td><td>" + trainStartPretty + "</td><td>" + trainMins + "</td><td>");
   // + empBilled + "</td></tr>");
 });
// Example Time Math
// -----------------------------------------------------------------------------
// Assume train start date of January 1, 2015
// Assume current date is March 1, 2016
// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case