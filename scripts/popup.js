var port = chrome.runtime.connect({name: 'ManicTime Popup'});
port.postMessage('Connecting');
port.onMessage.addListener(function(msg) {
	document.getElementById('status').innerHTML = msg;
});