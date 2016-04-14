chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
	console.log(sender.tab ? "from a content script":"from the extension");
	//alert(msg.greeting);
    if (msg.message == 'getHTML') {
		sendResponse({payload: document.all[0].outerHTML});
		//console.log("payload HTML sent");
    }
	else if(msg.message == 'getCSS')
	{
	
		//console.log("payload CSS sent");
		//ff();
		fetch_AllCSS();
		//console.log("Total elements are:" + lstAllcss.length);
		//sendResponse({payload: lstAllcss,title: tabTitle, url: tabURL});
		sendResponse({payload: lstAllcss});
	}
}
);

var lstAllcss = [];

function fetch_AllCSS(){
	
	
	var lstCss = document.styleSheets;
	//console.log(lstCss.length);
	lstAllcss = [];
	for(i=0;i<lstCss.length;i++){
		var lstcssRules = lstCss[i].cssRules;
		if (lstcssRules)
		{
		for(j=0;j<lstcssRules.length;j++)
		{
				addCSSRules(lstcssRules[j]);
		}
		}
	}
}

function addCSSRules(cssRule)
{
	if (cssRule instanceof CSSImportRule)
	{
		var lstofcssRules = cssRule.styleSheet.cssRules;
		if(lstofcssRules)
		{
			for(i=0;i<lstofcssRules.length;i++)
		{
			addCSSRules(lstofcssRules[i]);
		}
	}
	return;
	}
	var lstStyle = cssRule.style;
	if (lstStyle)
			{
					for(k=0;k<lstStyle.length;k++)
			{
				if (lstAllcss.indexOf(lstStyle[k].toLowerCase()) == -1)
				{
					lstAllcss.push(lstStyle[k].toLowerCase());
				}
			}
			}
}
