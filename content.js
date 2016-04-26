chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
	console.log(sender.tab ? "from a content script":"from the extension");
	//alert(msg.greeting);
    if (msg.message == 'getHTML') {
		//sendResponse({payload: document.all[0].outerHTML});
		fetch_AllHTML();
		sendResponse({payload: lstAllhtml});
    }
	else if(msg.message == 'getCSS')
	{
		fetch_AllCSS();
		sendResponse({payload: lstAllcss});
	}
}
);
var lstAllhtml = [];
var lstAllcss = [];

function fetch_AllHTML(){
	var dp = new DOMParser();
	var dpout = dp.parseFromString(document.all[0].outerHTML,'text/html');
	lstAllhtml = [];
	getAllTags(dpout);
	lstAllhtml = lstAllhtml.sort();
}

function getAllTags(content)
        {		
            for(i=0; i<content.all.length;i++)
                {
                    if (lstAllhtml.indexOf(content.all[i].tagName.toLowerCase()) == -1)
			{
				lstAllhtml.push(content.all[i].tagName.toLowerCase());
			}      
                }
				return;
			if (lstAllhtml.indexOf(content.nodeName.toLowerCase()) == -1)
			{
				lstAllhtml.push(content.nodeName.toLowerCase());
				console.log(lstAllhtml.indexOf(content.nodeName.toLowerCase())+ content.nodeName.toLowerCase());
			}
            if(content.hasChildNodes()==false)
                return;
            else{
                    for(i=0;i<content.childElementCount;i++){
                            getAllTags(content.childNodes[i])
                        }
                }
        }

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
