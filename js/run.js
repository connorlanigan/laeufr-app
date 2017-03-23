var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");
var Timer = require("FuseJS/Timer");

var lastcoordinates = {lat : 0.0, lon : 0.0};

var distance_m = Observable(0);
var totalSeconds = Observable(0);

var run_active = true;

 // Immediate
 var immediateLocation = JSON.stringify(GeoLocation.location);


 // Timeout
 var timeoutLocation = Observable("");
 var timeoutMs = 5000;



 Timer.create(function() {

   console.log(totalSeconds.value);

   var parsedLocation = JSON.parse(immediateLocation);
   lastcoordinates.lat = parsedLocation.latitude;
   lastcoordinates.lon =  parsedLocation.longitude;

   if(lastcoordinates.lat >0)
   {
   distance_m.value += calcCrow(lastcoordinates.lat, lastcoordinates.lon, parsedLocation.latitude, parsedLocation.longitude)*1000;
   console.log("Distance: "+distance_m.value);
   console.log("lat: "+lastcoordinates.lat);
   console.log("lon: "+lastcoordinates.lon);
    }


   totalSeconds.value += 1;

   }, 1000, true);



 GeoLocation.getLocation(timeoutMs).then(function(location) {

   console.log("Location updated");


     timeoutLocation.value = JSON.stringify(location);

 }).catch(function(fail) {
     console.log("getLocation fail " + fail);
 });

 // Continuous
 var continuousLocation = GeoLocation.observe("changed").map(JSON.stringify);

 function startContinuousListener() {
     var intervalMs = 1000;
     var desiredAccuracyInMeters = 10;
     GeoLocation.startListening(intervalMs, desiredAccuracyInMeters);
 }

 function stopContinuousListener() {
     GeoLocation.stopListening();
 }

 var finishrun = function()
 {
       stopContinuousListener();
       run_active = false;
       router.goto("dashboard");
 }

 startContinuousListener();

 //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
   function calcCrow(lat1, lon1, lat2, lon2)
   {
     var R = 6371; // km
     var dLat = toRad(lat2-lat1);
     var dLon = toRad(lon2-lon1);
     var lat1 = toRad(lat1);
     var lat2 = toRad(lat2);

     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     var d = R * c;
     return d;
   }

   // Converts numeric degrees to radians
   function toRad(Value)
   {
       return Value * Math.PI / 180;
   }


 module.exports = {
     immediateLocation: immediateLocation,
     distance_m : distance_m,
     timeoutLocation: timeoutLocation,
     continuousLocation: continuousLocation,
     startContinuousListener: startContinuousListener,
     totalSeconds :  totalSeconds,
     stopContinuousListener: stopContinuousListener,
     finishrun: finishrun
 };
