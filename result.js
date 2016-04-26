var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-76571000-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


var msgPageLoad = "Please close this tab.\nWait for the other tab to finish loading or refresh the webPage and click on Page Analyzer button again.";
var lstHtml4tags = ["a",
"abbr",
"address",
"area",
"b",
"base",
"basefont",
"bdo",
"blockquote",
"body",
"br",
"button",
"caption",
"cite",
"code",
"col",
"colgroup",
"dd",
"del",
"dfn",
"div",
"dl",
"dt",
"em",
"fieldset",
"form",
"h1",
"h2",
"h3",
"h4",
"h5",
"h6",
"head",
"hr",
"html",
"i",
"iframe",
"img",
"input",
"ins",
"kbd",
"label",
"legend",
"li",
"link",
"map",
"menu",
"meta",
"noscript",
"object",
"ol",
"optgroup",
"option",
"p",
"param",
"pre",
"q",
"s",
"samp",
"script",
"select",
"small",
"span",
"strong",
"style",
"sub",
"sup",
"table",
"tbody",
"td",
"textarea",
"tfoot",
"th",
"thead",
"title",
"tr",
"u",
"ul",
"var"];

var lstcss2tags = ["background-color",
"background-image",
"background-position",
"background-repeat",
"border-collapse",
"border-color",
"border-spacing",
"border-style",
"bottom",
"color",
"clear",
"display",
"float",
"font-family",
"font-size",
"font-style",
"font-variant",
"font-weight",
"height",
"left",
"line-height",
"list-style",
"list-style-image",
"list-style-position",
"margin",
"overflow",
"padding",
"position",
"right",
"text-align",
"text-decoration",
"text-indent",
"text-transform",
"top",
"width",
"word-spacing",
"visibility",
"z-index"
];
var lstHTML = new Array();
var id = "";
var lstCSS = [];
//var param = "";
var packageJSON = {};
var apiData = [];
var output = {};
var outputTag = {};
var chromePages = false;
//var apiUrl = "http://localhost:8080/api/tag?tag=";
window.addEventListener('load', function() {
    init();
});

function init(){
	id = parseInt(location.hash.slice(1));   
	chrome.tabs.get(id, callback);
}

function callback(tab)
{
	var e = document.getElementById("pagetitle");
	e.innerHTML = "<b>"+tab.title +"</b>"+ ": ("+tab.url+")";
	if (tab.url.startsWith("chrome-extension:")||(tab.url.startsWith("chrome:")))
	{
		alert("Extension does not work on chrome:// and chrome-extension:// webPages.\n Window will close now.");
		window.close();
		return;
	}
	loadPackage('data');
	
}

function apply()
{
	for(agents in output)
	{
		var e = document.getElementById(agents);
		if (e)
		{
			if (output[agents] != -1)
			{
				var newEle = document.createElement("div");
				newEle.style.color = '#ff6666';
				newEle.innerText = "Version "+ output[agents]+" and below.";
				
				var newEleAgent = document.createElement("div");
				newEleAgent.style.color = '#ff6666';
				newEleAgent.innerText = outputTag[agents];

				e.innerHTML = "Incompatibility issues with " + newEle.outerHTML + "Incompatible Feature: <b>" + newEleAgent.outerHTML + "</b></br>";
			}
			else
			{
				var newEle = document.createElement("div");
				newEle.style.color = '#006666';
				newEle.innerText = "No Compatibility Issues were detected.";
				e.innerHTML = newEle.outerHTML ;
			}
		}
	}
}
function loadPackage(_tag)
{
	//console.log("The json file is "+_tag);
	var responseJSON = undefined;
	var xhr = new XMLHttpRequest();
xhr.open("GET", chrome.extension.getURL('/data/'+_tag+'.json'),true);

xhr.onload = function(){
		if (xhr.status != 200)
		{	return;}
			packageJSON = JSON.parse(xhr.responseText);
			//console.log("package returned");
			getData();
	};
	xhr.send(null);
}

function getData()
{
	for(ua in packageJSON.agents)
	{
		output[ua] = -1;
		outputTag[ua] = undefined;
	}
	getPayloadHTML();
	getPayloadCSS();
}

function getPayloadCSS(){
	chrome.tabs.sendMessage(id, {message: 'getCSS'}, parseCSS);
}

function parseCSS(response) {
	//console.log("css data fetched");
	if ((response == undefined)||(response.payload == undefined))
	{
		document.getElementById("pagetitle").innerText = msgPageLoad;
		return;
	}
	lstCSS = response.payload;
	lstCSS = lstCSS.sort();
	lstcss2tags.forEach(removecss2);
	//console.log(lstCSS.join());
	startProcess(lstCSS);
	apiProcessing();
	apply();
}

function apiProcessing(){
	//console.log("In api processing func");
	for(i=0;i<apiData.length;i++)
	{
		var val = apiData[i].value;
		//console.log(val);
		var tag = apiData[i].tag;
		//console.log(tag);
		for(ua in packageJSON.agents)
		{
			
			if ((val[ua])&&(val[ua].n)&&(Number(val[ua].n)>Number(output[ua])))
			{
				//console.log("val changed"+tag+" "+ua+" "+val[ua].n);
				output[ua]= val[ua].n;
				outputTag[ua] = tag;
				
			}
		}
	}
}

function startProcess(lst)
{
	for(i=0;i<lst.length;i++)
	{
		for(tag in packageJSON.data)
		{
			if((lst[i] == tag.toLowerCase())||(("css-"+lst[i]) == tag.toLowerCase()))
			{
				processTag(tag,packageJSON.data[tag]);
				break;
			}
		}
	}
}

function processTag(tag,responseJSON)
{
	//key is each browser
	var _val = {};
	for(key in responseJSON.stats)
			{
				console.log(key);
				var arr_n = [];
				var arr_y = [];
				var arr_x = [];
				var arr_a = [];
				var obj = responseJSON.stats[key];
				//if (key == "and_uc")
					console.log(obj);
				for(key2 in obj)
				{
					console.log(key2);
					if (obj[key2] == "n")
						arr_n.push(key2);
					else if(obj[key2] == "y")
						arr_y.push(key2);
					else if(obj[key2] == "x")
					{
						arr_x.push(key2);
					}
					else if(obj[key2] == "a")
					{
						arr_a.push(key2);
					}
					else
					{
						//console.log("Wierd status found"+tag+" "+ key+" "+key2+" "+obj[key2]);
						//v2
					}
				}
				console.log(arr_n.join());
				console.log(arr_y.join());
				//continue;
				var max_n = -1;
				for(element in arr_n){
					//alert(element);
					try{
						if (key == "and_uc")
							console.log(element);
						var version = Number(element);
						if (version > max_n)
						{
							max_n = version;
							if (key == "and_uc")
							{
								console.log(version);
								console.log(max_n);
							}
						}
					}
					catch(e){
						console.log("Number conversion error:"+arr_n[i]);
					}
				}
				//console.log("Max_n"+max_n);
				//continue;
				
				var min_y = 10000;
				for(var j=0;j<arr_y.length;j++){
					try{
						var version = Number(arr_y[j]);
						if (version < min_y)
						{
							min_y = version;
						}
					}
					catch(e){
						console.log("Number conversion error:"+arr_y[j]);
					}
				}
				var obj_browserval = {};
				if (min_y < 10000)
				{
					obj_browserval.y = min_y;
				}
				if (max_n > -1)
				{
					obj_browserval.n = max_n;
				}
					
				_val[key]=obj_browserval;
				//break;
			}
			//console.log("Response is"+responseJSON);
			var _apiObj = {};
			_apiObj.tag = tag;
			_apiObj.value = _val;
			apiData.push(_apiObj);
}

function getPayloadHTML(){
	//console.log("payload called");
	chrome.tabs.sendMessage(id, {message: 'getHTML'}, parseHTML);
}

function parseHTML(response) {
	if ((response == undefined)||(response.payload == undefined))
	{
		alert(msgPageLoad);
		document.getElementById("pagetitle").innerText = msgPageLoad;
		return;
	}
	lstHTML = response.payload;
	lstHtml4tags.forEach(removehtml4);
	startProcess(lstHTML);
}

function removehtml4(item,index){
	var fIndex = lstHTML.indexOf(item);
	if (fIndex > -1)
		lstHTML.splice(fIndex,1);
}

function removecss2(item,index){
	var fIndex = lstCSS.indexOf(item);
	if (fIndex > -1)
		lstCSS.splice(fIndex,1);
}