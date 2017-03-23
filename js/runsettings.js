var navigation_back = function()
{
      router.goto("dashboard");
}


var startrun = function()
{
      router.goto("run");
}


module.exports = {
	navigation_back: navigation_back,
  startrun : startrun
};
