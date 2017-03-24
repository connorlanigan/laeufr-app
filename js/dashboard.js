var Storage = require("FuseJS/Storage");
var Observable = require("FuseJS/Observable");
var storedRuns = Observable("");

var push_casualrun = function()
{
      router.goto("runsettings");
}

var delete_history = function()
{
     Storage.writeSync("storage.json", JSON.stringify([]));
     storedRuns.value = "";
}

var storageRuns = Storage.readSync("storage.json");


if(storageRuns != "")
    storedRuns = JSON.parse(storageRuns);

console.log("Found: "+storedRuns.value );


module.exports = {
	push_casualrun: push_casualrun,
  storedRuns : storedRuns,
  delete_history : delete_history
};
