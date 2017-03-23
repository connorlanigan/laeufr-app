var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");
var Timer = require("FuseJS/Timer");
var distance_m = Observable(0);
var totalSeconds = Observable(0);
var run_active = true;
var lastLocation = {lat : 0.0, lon:0.0};


   // Immediate
   var immediateLocation = JSON.stringify(GeoLocation.location);


 var running_timer =   Timer.create(function() {

if(run_active)
totalSeconds.value += 1;

     GeoLocation.getLocation(3000).then(function(location) {

if(lastLocation.lat > 0)
{
  distance_m.value += (calcCrow(lastLocation.lat, lastLocation.lon, location.latitude, location.longitude)*1000);
  console.log(distance_m);
}

lastLocation.lat = location.latitude;
lastLocation.lon = location.longitude;


     }).catch(function(fail) {
         console.log("getLocation fail " + fail);
     });


   }, 1000,true);




   // Timeout
   var timeoutLocation = Observable("");
   var timeoutMs = 1000;


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
       running_timer.stop();
       run_active = false;
       router.goto("dashboard");
 }


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
