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
  var trainStart = $("#start-input").val().trim();
  var trainRate = $("#rate-input").val().trim();
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: dest,
    start: trainStart,
    rate: trainRate
  };

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

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var dest = childSnapshot.val().destination;
  // var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;
  // var tRate= childSnapshot.val().rate;
    // find when the next train is and minutes until next train
  var tRate = childSnapshot.val().frequency;
  // pushed back 1 year to make sure it comes before current time
  var convertedDate = moment(childSnapshot.val().trainName, 'hh:mm');
  var trainTime = moment(convertedDate).format('HH:mm');
  var currentTime = moment();
  // pushed back 1 year to make sure it comes before current time
  var firstTimeConverted = moment(trainTime,'hh:mm');
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % tRate;
  //solved
  var tMinutesTillTrain = tRate - tRemainder;
  //solved
  var nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('HH:mm')

  
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" +
   trainRate + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>");
 },function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  })

//refreashes train data every minute
setInterval(function(){
    location.reload();
  }, 60000)
