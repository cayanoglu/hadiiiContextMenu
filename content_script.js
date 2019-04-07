/**
 * @author cayanoglu
 */
/*
 background-image:url('chrome-extension://__MSG_@@extension_id__/background.png');
 https://developer.chrome.com/extensions/i18n.html#overview-predefined
 */


    function convertImgToBase64(url, callback, outputFormat){
        var canvas = document.createElement('CANVAS'), ctx = canvas.getContext('2d'), img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            canvas = null;
        };
        img.src = url;
    };
    
    function onMessage(response, sender, sendResponse){
       
        if (response && response.info && response.info.mediaType=='image') {
          console.warn('Received mediaType', response);
            convertImgToBase64(response.info.srcUrl, function(v){
            
            
                var c = document.createElement('textarea');
                c.setAttribute('style', 'width:400px;height:400px;position:fixed;right:10px;top:10px;');
                c.ondblclick = function(){
                    this.parentElement.removeChild(this);
                };
                document.body.appendChild(c);
                c.value = v;
            });
            
        }
    }
    
    chrome.extension.onMessage.addListener(onMessage);
    
    /*
     var navigateUriBase = 'http://local.hadiii.com/fsq/';
     var navigateFsqBase = 'https://foursquare.com/';
     var containerID = uniqid('ayanoglu');
     var fsqVenueID, webVenueUrl;
     function onMessage(response, sender, sendResponse) {
     
     if (response.action == "use_venue") {
     //https://tr.foursquare.com/v/sur-bal%C4%B1k/4ed3b46a5c5c9528fd1e46d7
     
     var url = response.url;
     fsqVenueID = url.split("/")[url.split("/").length - 1];
     console.warn('Using venue : ' + response.title + ' , id : ' + fsqVenueID + ' , url:' + response.url);
     
     showEditor(fsqVenueID, response.title, null);
     
     }
     else
     console.warn('Received : ' + response.message + ' , url:' + response.url);
     
     
     
     
     }
     
     chrome.extension.onMessage.addListener(onMessage);
     
     
     
     function buildUI() {
     
     var d = window.parent ? window.parent.document : window.document;
     uiContainer = d.getElementById('ayanoglu-maps-hacker');
     
     if (!uiContainer) {
     
     
     uiContainer = $n('div', 'z-Index:1000000000;border-radius:7px;position:fixed;top:5px;right:5px;' +
     'padding:10px;background-color:rgba(255,255,128,0.8);font-size:16px;font-family: Calibri, Arial, Helvetica, sans-serif;');
     uiContainer.$att({
     'id': 'ayanoglu-venue-hacker'
     });
     var onVenue = /foursquare\.com\/v\//.test(window.location);
     var onTarget = /foursquare\.com/.test(window.location);
     //                 https://tr.foursquare.com/v/sur-bal%C4%B1k/4ed3b46a5c5c9528fd1e46d7
     
     var btnText, action;
     switch (true) {
     
     case onVenue:
     btnText = "Bu Yeri Kullan";
     action = "use_venue";
     break;
     case onTarget:
     btnText = "Sayfaya Dön";
     action = "return_to_base";
     break;
     case !textEditor:
     btnText = "Sayfayı Kullan";
     action = "use_page";
     break;
     default:
     btnText = "Yerini belirle";
     action = "navigate_map";
     }
     
     
     
     var oMap = $n('div', 'cursor:pointer;font:inherit;color:black;').$text(btnText);
     
     oMap.onclick = function() {
     if (action == "use_page") {
     showEditor(null, document.title, null);
     return;
     }
     var url = navigateFsqBase;
     chrome.extension.sendMessage({
     action: action,
     url: url
     }, function(response) {
     console.warn(response.message);
     });
     };
     
     uiContainer.add([oMap]);
     
     d.body.appendChild(uiContainer);
     
     
     };
     
     console.warn('UI Loaded');
     }
     var oldQValue = "";
     function printCoords() {
     var d = window.parent ? window.parent.document : window.document;
     var q = $gid('gbqfq');
     if (q) {
     if (q.value.length > 0 && q.value != oldQValue) {
     uiContainer.clear();
     
     var fsq_explore_url = "https://tr.foursquare.com/explore?ll=" + encodeURIComponent(q.value);
     var explore = $n('div', 'cursor:pointer;color:navy;margin:5px;');
     explore.url = fsq_explore_url;
     explore.$text("Find In Foursquare");
     explore.onclick = function() {
     window.open(this.url, "fsq-explore");
     };
     
     uiContainer.add(explore);
     
     var fsq_add_url = "https://foursquare.com/add_venue?venuename=newVenue&ll=" + encodeURIComponent(q.value);
     var newVenue = $n('div', 'cursor:pointer;color:navy;margin:5px;');
     newVenue.url = fsq_add_url;
     newVenue.$text("Add to Foursquare");
     newVenue.onclick = function() {
     window.open(this.url, "fsq-add");
     };
     uiContainer.add(newVenue);
     
     
     oldQValue = q.value;
     
     
     uiContainer.show();
     }
     }
     setTimeout(printCoords, 1000);
     }
     
     // Will print current coords each second
     
     var uiContainer;
     
     var sStart = false;
     function selectStart() {
     sStart = true;
     };
     var textEditor = null;
     var buttonStyle = 'font-size:16px;font-family: Calibri, Arial, Helvetica, sans-serif;background-color:rgb(254,202,82);' +
     'padding:6px 9px 6px 9px;border:1px solid rgb(244,221,146);border-radius:5px;cursor:pointer;';
     
     
     
     function showEditor(venueID, venueName, text) {
     if (!textEditor) {
     
     var ed = $n('div', 'z-Index:1000000000000;font-size:16px;font-family: Calibri, Arial, Helvetica, sans-serif;' +
     'padding:20px 20px 55px 20px;position:fixed;border:1px solid rgb(224,224,224);' +
     'background-color:rgb(255,255,213);border-radius:6px;');
     
     var c = $n('div');
     var spinner = $n("img", 'display:none;position:absolute;left:40%;bottom:100px;');
     spinner.src = "http://www.hadiii.com/graphics/web/controls/processing.gif";
     
     c.add(spinner);
     
     var closer = $n("div", buttonStyle);
     closer.$style("position:absolute;bottom:10px;right:20px;");
     closer.$text("Kapat");
     closer.onclick = function() {
     textEditor.hide();
     };
     c.add(closer);
     
     var send = $n("div", buttonStyle);
     send.$style("position:absolute;bottom:10px;right:100px;");
     send.$text("Kaydet");
     
     var notifyDv = $n("div", 'position:absolute;bottom:10px;right:200px;left:30px;' +
     'font-size:15px;font-family: Calibri, Arial, Helvetica, sans-serif;color:red;display:none');
     
     c.add(notifyDv);
     
     function saveVenue() {
     spinner.show();
     send.hide();
     notifyDv.hide();
     var xhr = new XMLHttpRequest();
     xhr.open("POST", "http://local.hadiii.com/", true);
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
     xhr.setRequestHeader("-pre-handle-request-type-", "update-venue-base");
     xhr.onreadystatechange = function() {
     if (xhr.readyState == 4) {
     spinner.hide();
     send.show();
     var resp;
     
     try {
     resp = eval("(" + xhr.responseText + ")");
     }
     catch (e) {
     resp = {
     meta: {
     done: false,
     error: "Output text cannot be parsed",
     text: xhr.responseText
     }
     };
     }
     
     if (resp.meta.done) {
     venueTipArea.$text('');
     console.info({
     "response": resp.response
     });
     }
     else {
     notifyDv.show();
     notifyDv.$text(resp.meta.error.friendlyMessage ? resp.meta.error.friendlyMessage : resp.meta.error.message);
     console.error({
     "exception": resp.meta.error
     });
     }
     
     }
     else {
     
     }
     }
     var data = {
     "source-url": self.location.href,
     "source-name": document.title,
     "venue-id": venueIDInput.value,
     "tip-text": venueTipArea.value
     };
     var qArr = [];
     var query = "";
     for (var key in data) {
     qArr.push(key + "=" + encodeURIComponent(data[key]));
     }
     query = qArr.join("&");
     
     xhr.send(query);
     };
     
     send.onclick = saveVenue;
     
     c.add(send);
     
     
     var venueNameDv = $n('div', 'margin:5px 0px 5px 0px;font-weight:bold;')
     c.add(venueNameDv);
     
     var venueIDInput = $n('input', '', {
     type: "text"
     });
     
     c.add([venueIDInput, $n('br')]);
     
     var venueTipArea = $n("textarea", "width:400px;height:100px;font:inherit;");
     
     
     c.add(venueTipArea);
     
     ed.add(c);
     document.body.appendChild(ed);
     
     
     ed.switchSetVenue = function() {
     send.$text("Yerini belirle");
     send.onclick = function() {
     
     chrome.extension.sendMessage({
     action: "navigate_map",
     url: navigateFsqBase
     }, function(response) {
     console.warn(response.message);
     });
     };
     }
     ed.switchSaveVenue = function() {
     send.$text("Kaydet");
     send.onclick = saveVenue;
     }
     ed.setTip = function(v) {
     if (v && v.length > 0)
     venueTipArea.$text(v);
     }
     ed.setVenueID = function(v) {
     if (v)
     venueIDInput.$text(v);
     }
     
     ed.setVenueName = function(v) {
     if (v)
     venueNameDv.$text(v);
     }
     
     textEditor = ed;
     
     
     };
     
     if (!venueID || venueID.length == 0) {
     textEditor.switchSetVenue();
     }
     else {
     textEditor.setVenueID(venueID);
     textEditor.switchSaveVenue();
     }
     
     textEditor.setTip(text);
     textEditor.setVenueName(venueName);
     
     
     pos = {
     x: parseInt(uiContainer.style.left) + uiContainer.offsetWidth + 20,
     y: parseInt(uiContainer.style.top)
     }
     
     textEditor.style.top = pos.y + "px";
     textEditor.style.right = pos.x + "px";
     textEditor.show();
     }
     
     
     function afterSelect() {
     if (sStart === true) {
     var sel;
     if (document.selection) {
     sel = document.body.createTextRange();
     }
     else
     if (window.getSelection) {
     sel = window.getSelection();
     }
     
     var selStr = sel.toString();
     if (selStr.length > 10) {
     showEditor(fsqVenueID, undefined, selStr);
     chrome.extension.sendMessage({
     action: "venue_data_updated",
     data: {
     name: document.title,
     sources: [{
     source: "web",
     key: window.location,
     tip: selStr,
     }],
     
     },
     url: window.location.href
     }, function(response) {
     console.warn(response);
     });
     }
     
     
     
     
     sStart = false;
     }
     };
     
     var loop = 0;
     function initialize() {
     
     chrome.extension.sendMessage({
     action: "content_loaded",
     url: window.location.href
     }, function(response) {
     console.warn(response.message);
     });
     
     var b = $n(document.body);
     
     b.onselectstart = selectStart;
     b.onmouseup = afterSelect;
     
     buildUI();
     
     
     }
     
     domReady.ready(initialize, true);
     
     */

