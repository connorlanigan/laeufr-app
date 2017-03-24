var Observable = require("FuseJS/Observable");
var GeoLocation = require("FuseJS/GeoLocation");
var Timer = require("FuseJS/Timer");
var distance_m = Observable(0);
var totalSeconds = Observable(0);
var run_active = true;
var lastLocation = {lat : 0.0, lon:0.0};
var duration_value = Observable("0000");
var distance_value = Observable("0000");
var distance_type =Observable("METER");
var duration_type = Observable("SECONDS");
var FileSystem = require("FuseJS/FileSystem");

var audioplayer = Observable(true);
var audioplayer_file = Observable("Assets/sounds/start_your_run.wav");

function playSound(path)
{

  audioplayer.value = true;
  audioplayer_file.value = path;
  audioplayer.value = false;
}




   // Immediate
 var immediateLocation = JSON.stringify(GeoLocation.location);
 var running_timer =   Timer.create(function() {



if(run_active)
totalSeconds.value += 1;


if(totalSeconds.value < 60) //seconds
{


duration_value.value =   formatNum(totalSeconds.value,4);
duration_type.value ="SECONDS";
}
else if(totalSeconds.value >= 60) //minutes
{


var seconds = secondsToTime(totalSeconds.value).s;
var minutes = secondsToTime(totalSeconds.value).m;


duration_value.value = formatNum(minutes,2)+":"+formatNum(seconds,2);
duration_type.value =" MINUTES";
}
else //Hours
{
duration_value.value = totalSeconds.value/60;
duration_type.value ="HOURS";
}


GeoLocation.getLocation(3000).then(function(location) {

if(lastLocation.lat > 0)
{
  distance_m.value += (calcCrow(lastLocation.lat, lastLocation.lon, location.latitude, location.longitude)*1000);
//  console.log(distance_m);
}

lastLocation.lat = location.latitude;
lastLocation.lon = location.longitude;





     }).catch(function(fail) {
         console.log("getLocation fail " + fail);
     });


   }, 1000,run_active);




   // Timeout
   var timeoutLocation = Observable("");
   var timeoutMs = 1000;


   // Continuous
   var continuousLocation = GeoLocation.observe("changed").map(JSON.stringify);

   function startContinuousListener() {

      playSound("Assets/sounds/start_your_run.wav");

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
       audioplayer.value = false;
       run_active = false;


       addRun({"distance" : distance_m.value, "totalseconds" : totalSeconds.value});
       router.goto("dashboard");
 }

 function secondsToTime(secs)
 {
     secs = Math.round(secs);
     var hours = Math.floor(secs / (60 * 60));

     var divisor_for_minutes = secs % (60 * 60);
     var minutes = Math.floor(divisor_for_minutes / 60);

     var divisor_for_seconds = divisor_for_minutes % 60;
     var seconds = Math.ceil(divisor_for_seconds);

     var obj = {
         "h": hours,
         "m": minutes,
         "s": seconds
     };
     return obj;
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

   var runs = [];


   function addRun(run)
   {
     runs.push(run);
   }

   function formatNum(num,letters)
   {
    var missing_nums = letters-num.toString().length;
    var beforeString = "";

    for(var i = 0;i<missing_nums;i++)
     beforeString += "0";

   return beforeString+num;
   }



 module.exports = {
     immediateLocation: immediateLocation,
     distance_m : distance_m,
     timeoutLocation: timeoutLocation,
     continuousLocation: continuousLocation,
     startContinuousListener: startContinuousListener,
     totalSeconds :  totalSeconds,
     stopContinuousListener: stopContinuousListener,
     finishrun: finishrun,
     distance_type : distance_type,
     duration_type : duration_type,
     distance_value : distance_value,
    duration_value : duration_value,
    audioplayer : audioplayer,
    audioplayer_file : audioplayer_file
 };
