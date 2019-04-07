var photoTab;
var base64Tab;
var movieTab = false;
/**
 * @link https://developer.chrome.com/extensions/contextMenus
 * @link chrome://extensions/
 */
var mnu = [{
	'title' : 'Add dates',
	'contexts' : ['editable'],
	'onclick' : function(info, tab)
	{
		console.log("info", info);
		info.selectionText = 'okeee';

	}
}, {
	'title' : 'Search Movie of IMDB',
	'contexts' : ['link'],
	'documentUrlPatterns' : ['http://www.imdb.com/*'],
	'targetUrlPatterns' : ['http://www.imdb.com/title/tt*'],
	'onclick' : function(info, tab)
	{
		var sUrl = info.linkUrl;

		var re = new RegExp('.*\.com\/title\/(tt[\\d]+)\/.*', 'i');
		var ms = sUrl.match(re);
		if (ms == null)
			return;
		var title = ms[1];
		if (!title)
			return;
		console.log("info", info, sUrl, title);
		//   alert(ms);

		var url = "http://www.fullhdfilmizlesene.org/arama?ara=" + title;
		var args = {
			url : url,
			selected : true
		};
		if (movieTab !== false && movieTab.id !== chrome.tabs.TAB_ID_NONE) {

			chrome.tabs.update(movieTab.id, args, function(tab)
			{

			});
		}
		else {
			chrome.tabs.create(args, function(tab)
			{
				movieTab = tab;
			});
		}
		console.log("movieTab", movieTab);
	}
}, {
	'title' : 'Tweet "%s"',
	'contexts' : ['selection'],
	'onclick' : function(info, tab)
	{
		console.log("info", info); 
		var tag = 'fetödoğanelele';
		var d = document, l = d.location, e = encodeURIComponent;
		var f = 'https://twitter.com/intent/tweet';
		var p = '?url=' + e(tab.url) 
		+ '&text=' + e(info.selectionText + ' #'  + tag)  
		+ '&related=habermakale%3AHaberler';
		var url = f + p;

		chrome.tabs.create({
			url : url
		}, function(tab)
		{
		});

	}
}, {
	'title' : 'Search Google Contacts for "%s"',
	'contexts' : ['selection'],
	'onclick' : function(info, tab)
	{
		console.log("info", info);
		var url = "https://mail.google.com/mail/u/0/?ui=2&shva=1#contacts/search/" + info.selectionText;
		chrome.tabs.create({
			url : url
		}, function(tab)
		{
		});

	}
}, {
	'title' : 'Get Torrents for "%s"',
	'contexts' : ['selection'],
	'onclick' : function(info, tab)
	{
		console.log("info", info);
		var url = "http://isohunt.to/torrents/?ihq=" + info.selectionText;
		chrome.tabs.create({
			url : url
		}, function(tab)
		{
		});

	}
},
// {
// 'title' : 'Add photo to Hahhaaa.com',
// 'contexts' : ['image'],
// 'onclick' : function(info, tab) {
// console.warn("info", info);
// srcUrl = info.srcUrl;
// var url = "http://www.hahhaaa.com/#url=" + srcUrl;
// var args = {
// selected : true
// };
// if (photoTab) {
// chrome.tabs.sendMessage(photoTab.id, {
// url : url,
// hash : "url=" + srcUrl
// }, function() {
// });
//
// chrome.tabs.update(photoTab.id, args, function(tab) {
//
// });
// } else {
// args.url = url;
// chrome.tabs.create(args, function(tab) {
// photoTab = tab;
// });
// }
//
// }
// },
{
	'title' : 'Get Image base64',
	'contexts' : ['image'],
	'onclick' : function(info, tab)
	{

		var srcUrl = info.srcUrl;
		var url = "http://new.hadiii.com/#base64source=" + srcUrl;
		var args = {
			selected : true,
			url : url
		};
		if (base64Tab) {
			chrome.tabs.update(base64Tab.id, args, function(tab)
			{

			});
		}
		else {
			chrome.tabs.create(args, function(tab)
			{
				base64Tab = tab;
			});
		}
	}
}];
var ctxMenu={
                movieTr:{

                        
                        'title' : 'Search Movie of IMDB',
                        'contexts' : ['link'],
//                        'documentUrlPatterns' : ['http(s)?:\/\/www.imdb.com\/*'],
                        'targetUrlPatterns' : ['https://www.imdb.com/title/tt*'],
                        'onclick' : function(info, tab)
                        {
                                var sUrl = info.linkUrl;
                 
                                var re = new RegExp('.*\\.com\/title\/(tt[\\d]+)\/.*', 'i');
                                var ms = sUrl.match(re);
                                if (ms == null)
                                        return;
                                var title = ms[1];
                                if (!title)
                                        return;
                                console.log("info", info, sUrl, title);
                                // alert(ms);

                                var url = "https://720p-izle.com/ara.asp?a=" + title; 
                                var args = {
                                        url : url,
                                        selected : true
                                };
                                chrome.tabs.create(args, function(tab)
                                                {
                                                        movieTab = tab;
                                                });
                                return;
//                                
//                                if ( typeof movieTab!=='undefined'   && movieTab.id !== chrome.tabs.TAB_ID_NONE) {
                //
//                                        chrome.tabs.update(movieTab.id, args, function(tab)
//                                        {
                //
//                                        });
//                                }
//                                else {
//                                        chrome.tabs.create(args, function(tab)
//                                        {
//                                                movieTab = tab;
//                                        });
//                                }
//                                console.log("movieTab", movieTab);
                        }


                }
}

for ( var key in ctxMenu ) {
        if ( ctxMenu.hasOwnProperty(key) ) {
                var mo = ctxMenu[key];
                if ( mo.disabled === true )
                        continue;
                chrome.contextMenus.create(mo);
        }
}

//for (var i = 0; i < mnu.length; i++) {
//	chrome.contextMenus.create(mnu[i]);
//};

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo)
{
	if (photoTab && photoTab.id == tabId)
		photoTab = null;
	if (movieTab && movieTab.id == tabId)
		movieTab = false;
});

var filters = {// TODO(aa): Cannot use urlPrefix because all the url fields lack the protocol
	// part. See crbug.com/140238.
	/*
	 url: [{
	 urlContains: '*.google.com/*',
	 }
	 ,
	 {
	 urlContains: 'localhost/*'
	 }
	 ,
	 {
	 urlContains: '*.hadiii.com/*'
	 }
	 ]
	 */
};

function onNavigate(details)
{
	thisTabId = details.tabId;
	chrome.tabs.sendMessage(details.tabId, {
		message : 'Navigation Complete new',
		args : details
	}, function()
	{
	});
};

chrome.webNavigation.onCommitted.addListener(onNavigate, filters);
