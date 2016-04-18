var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-76571000-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


var htmltext = "";
var dp = new DOMParser();
var lst1 = new Array();

chrome.browserAction.onClicked.addListener(function (tab) {
	//var url = chrome.extension.getURL('result.html#'+tab.id);
    //chrome.tabs.create({url:url});
	init(tab.id);
});

function init(id)
{
	var url = chrome.extension.getURL('result.html#'+id);
    chrome.tabs.create({url:url});
}

var cM1 = chrome.contextMenus.create(
  {"title": "Analyze this Page...", "onclick": genericOnClick});
  
  function genericOnClick(e,tab){
	// var url = chrome.extension.getURL('result.html#'+tab.id);
    //chrome.tabs.create({url:url});  
	init(tab.id);
  }
  
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.tagdata == "true")
	{
      sendResponse({"taglist": lst1.join()});
	}
  });