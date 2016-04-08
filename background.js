var htmltext = "";
var dp = new DOMParser();
var lst1 = new Array();
chrome.browserAction.onClicked.addListener(function (tab) {
	var url = chrome.extension.getURL('result.html#'+tab.id);
    chrome.tabs.create({url:url});
});

//+encodeURI(tab.title)+'#'+encodeURI(tab.url)


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.tagdata == "true")
	{
      sendResponse({"taglist": lst1.join()});
	}
  });