function getProcessNameForBrowser(a) {
    switch (a) {
        case "Opera":
            return "opera";
        case "Vivaldi":
            return "vivaldi";
        case "Yandex Browser":
            return "browser";
        case "UC Browser":
            return "UCBrowser";
        case "Sleipnir":
            return "Sleipnir";
        default:
            return "chrome"
    }
}

function getProcessName() {
    if (null !== cachedProcessName) return cachedProcessName;
    var a = window.bowser.name;
    return void 0 === a ? "chrome" : cachedProcessName = getProcessNameForBrowser(a)
}

function sendWindowUrl(a, b) {
    chrome.windows.getLastFocused(null, function(c) {
        if (chrome.runtime.lastError) return void serverManager.send(getProcessName(), null, null, !1);
        if (!c.focused) return void serverManager.send(getProcessName(), null, null, !1);
        var d = c.id;
        return a === chrome.windows.WINDOW_ID_NONE && "focusChanged" === b && (a = d), a !== d ? void console.log("event occured on window that is not in focus. suppressing.", a, d) : void chrome.tabs.getSelected(a, function(a) {
            chrome.runtime.lastError ? serverManager.send(getProcessName(), null, null, !1) : serverManager.send(getProcessName(), a.title, a.url, a.incognito)
        })
    })
}
var serverManager = function() {
        function a() {
            b(), setInterval(b, 25*1000)
        }

        function b() {
            console.log("refreshServers started");
            for (var a = 0; 10 > a; a++)
				if(c(42870 + a))
					break;
        }

        function c(a) {
            var b = d(a);
            if (-1 == b) {
                var c = new WebSocket("ws://127.0.0.1:" + a + "/manictime-document/");
                c.onopen = function() {
                    console.log(a, "connection opened: port:" + a), i.push({
                        port: a,
                        ws: c
                    }), null != j && c.send(j)
                }, c.onclose = function() {
                    e(a)
                }, c.onerror = function(b) {
                    e(a)
                }
            }else
				return true;
        }
		
		

        function d(portNumber) { /* getActiveSocketIndex(portNumber) */
			i = i.filter(function(o){
				var OPEN = 1;
				var CONNECTING = 0;
				var keep = false;
				
				keep |= o.ws.readyState == OPEN;
				keep |= o.ws.readyState == CONNECTING;
				
				return keep;
			});
            return i.findIndex(function(b){
				return b.port === portNumber;
            })
        }

        function e(a) {
            var b = d(a);
            b > -1 && i.splice(b, 1)
        }

        function f() {
            return i
        }

        function g(a, b, c, d) {
            var e = JSON.stringify({
                ProcessName: a,
                Title: b,
                Url: c,
                IsPrivate: d
            });
            j = e, console.log(i);
            for (var f = 0; f < i.length; f++) i[f].ws.send(e), console.log("message sent", e)
        }

        function h() {
            var a = "";
            if (i.length <= 0) a = "ManicTime client is not connected.";
            else {
                for (var b = "", c = 0; c < i.length; c++) b += ("" != b ? ", " : "") + i[c].port;
                a = "ManicTime client is connected on port(s):<br />" + b + "."
            }
            return a
        }
        var i = [],
            j = null;
        return {
            init: a,
            send: g,
            getServers: f,
            getServerInfo: h
        }
    }(),
    cachedProcessName = null;
chrome.tabs.onUpdated.addListener(function(a, b, c) {
    sendWindowUrl(c.windowId, "updated")
}), chrome.tabs.onCreated.addListener(function(a) {
    sendWindowUrl(a.windowId, "created")
}), chrome.tabs.onActivated.addListener(function(a) {
    sendWindowUrl(a.windowId, "activated")
}), chrome.windows.onFocusChanged.addListener(function(a) {
    sendWindowUrl(a, "focusChanged")
}), chrome.runtime.onConnect.addListener(function(a) {
    a.onMessage.addListener(function() {
        a.postMessage(serverManager.getServerInfo())
    })
}), serverManager.init(), ! function(a, b, c) {
    "undefined" != typeof module && module.exports ? module.exports = c() : "function" == typeof define && define.amd ? define(b, c) : a[b] = c()
}(this, "bowser", function() {
    function a(a) {
        function b(b) {
            var c = a.match(b);
            return c && c.length > 1 && c[1] || ""
        }

        function c(b) {
            var c = a.match(b);
            return c && c.length > 1 && c[2] || ""
        }
        var d, e = b(/(ipod|iphone|ipad)/i).toLowerCase(),
            f = /like android/i.test(a),
            h = !f && /android/i.test(a),
            i = /nexus\s*[0-6]\s*/i.test(a),
            j = !i && /nexus\s*[0-9]+/i.test(a),
            k = /CrOS/.test(a),
            l = /silk/i.test(a),
            m = /sailfish/i.test(a),
            n = /tizen/i.test(a),
            o = /(web|hpw)os/i.test(a),
            p = /windows phone/i.test(a),
            q = (/SamsungBrowser/i.test(a), !p && /windows/i.test(a)),
            r = !e && !l && /macintosh/i.test(a),
            s = !h && !m && !n && !o && /linux/i.test(a),
            t = b(/edge\/(\d+(\.\d+)?)/i),
            u = b(/version\/(\d+(\.\d+)?)/i),
            v = /tablet/i.test(a),
            w = !v && /[^-]mobi/i.test(a),
            x = /xbox/i.test(a);
        /opera/i.test(a) ? d = {
            name: "Opera",
            opera: g,
            version: u || b(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
        } : /opr|opios/i.test(a) ? d = {
            name: "Opera",
            opera: g,
            version: b(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || u
        } : /SamsungBrowser/i.test(a) ? d = {
            name: "Samsung Internet for Android",
            samsungBrowser: g,
            version: u || b(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
        } : /coast/i.test(a) ? d = {
            name: "Opera Coast",
            coast: g,
            version: u || b(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
        } : /yabrowser/i.test(a) ? d = {
            name: "Yandex Browser",
            yandexbrowser: g,
            version: u || b(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
        } : /ucbrowser/i.test(a) ? d = {
            name: "UC Browser",
            ucbrowser: g,
            version: b(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
        } : /mxios/i.test(a) ? d = {
            name: "Maxthon",
            maxthon: g,
            version: b(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
        } : /epiphany/i.test(a) ? d = {
            name: "Epiphany",
            epiphany: g,
            version: b(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
        } : /puffin/i.test(a) ? d = {
            name: "Puffin",
            puffin: g,
            version: b(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
        } : /sleipnir/i.test(a) ? d = {
            name: "Sleipnir",
            sleipnir: g,
            version: b(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
        } : /k-meleon/i.test(a) ? d = {
            name: "K-Meleon",
            kMeleon: g,
            version: b(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
        } : p ? (d = {
            name: "Windows Phone",
            windowsphone: g
        }, t ? (d.msedge = g, d.version = t) : (d.msie = g, d.version = b(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(a) ? d = {
            name: "Internet Explorer",
            msie: g,
            version: b(/(?:msie |rv:)(\d+(\.\d+)?)/i)
        } : k ? d = {
            name: "Chrome",
            chromeos: g,
            chromeBook: g,
            chrome: g,
            version: b(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : /chrome.+? edge/i.test(a) ? d = {
            name: "Microsoft Edge",
            msedge: g,
            version: t
        } : /vivaldi/i.test(a) ? d = {
            name: "Vivaldi",
            vivaldi: g,
            version: b(/vivaldi\/(\d+(\.\d+)?)/i) || u
        } : m ? d = {
            name: "Sailfish",
            sailfish: g,
            version: b(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
        } : /seamonkey\//i.test(a) ? d = {
            name: "SeaMonkey",
            seamonkey: g,
            version: b(/seamonkey\/(\d+(\.\d+)?)/i)
        } : /firefox|iceweasel|fxios/i.test(a) ? (d = {
            name: "Firefox",
            firefox: g,
            version: b(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
        }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(a) && (d.firefoxos = g)) : l ? d = {
            name: "Amazon Silk",
            silk: g,
            version: b(/silk\/(\d+(\.\d+)?)/i)
        } : /phantom/i.test(a) ? d = {
            name: "PhantomJS",
            phantom: g,
            version: b(/phantomjs\/(\d+(\.\d+)?)/i)
        } : /slimerjs/i.test(a) ? d = {
            name: "SlimerJS",
            slimer: g,
            version: b(/slimerjs\/(\d+(\.\d+)?)/i)
        } : /blackberry|\bbb\d+/i.test(a) || /rim\stablet/i.test(a) ? d = {
            name: "BlackBerry",
            blackberry: g,
            version: u || b(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
        } : o ? (d = {
            name: "WebOS",
            webos: g,
            version: u || b(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
        }, /touchpad\//i.test(a) && (d.touchpad = g)) : /bada/i.test(a) ? d = {
            name: "Bada",
            bada: g,
            version: b(/dolfin\/(\d+(\.\d+)?)/i)
        } : n ? d = {
            name: "Tizen",
            tizen: g,
            version: b(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || u
        } : /qupzilla/i.test(a) ? d = {
            name: "QupZilla",
            qupzilla: g,
            version: b(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || u
        } : /chromium/i.test(a) ? d = {
            name: "Chromium",
            chromium: g,
            version: b(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || u
        } : /chrome|crios|crmo/i.test(a) ? d = {
            name: "Chrome",
            chrome: g,
            version: b(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        } : h ? d = {
            name: "Android",
            version: u
        } : /safari|applewebkit/i.test(a) ? (d = {
            name: "Safari",
            safari: g
        }, u && (d.version = u)) : e ? (d = {
            name: "iphone" == e ? "iPhone" : "ipad" == e ? "iPad" : "iPod"
        }, u && (d.version = u)) : d = /googlebot/i.test(a) ? {
            name: "Googlebot",
            googlebot: g,
            version: b(/googlebot\/(\d+(\.\d+))/i) || u
        } : {
            name: b(/^(.*)\/(.*) /),
            version: c(/^(.*)\/(.*) /)
        }, !d.msedge && /(apple)?webkit/i.test(a) ? (/(apple)?webkit\/537\.36/i.test(a) ? (d.name = d.name || "Blink", d.blink = g) : (d.name = d.name || "Webkit", d.webkit = g), !d.version && u && (d.version = u)) : !d.opera && /gecko\//i.test(a) && (d.name = d.name || "Gecko", d.gecko = g, d.version = d.version || b(/gecko\/(\d+(\.\d+)?)/i)), d.windowsphone || d.msedge || !h && !d.silk ? d.windowsphone || d.msedge || !e ? r ? d.mac = g : x ? d.xbox = g : q ? d.windows = g : s && (d.linux = g) : (d[e] = g, d.ios = g) : d.android = g;
        var y = "";
        d.windowsphone ? y = b(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : e ? (y = b(/os (\d+([_\s]\d+)*) like mac os x/i), y = y.replace(/[_\s]/g, ".")) : h ? y = b(/android[ \/-](\d+(\.\d+)*)/i) : d.webos ? y = b(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : d.blackberry ? y = b(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : d.bada ? y = b(/bada\/(\d+(\.\d+)*)/i) : d.tizen && (y = b(/tizen[\/\s](\d+(\.\d+)*)/i)), y && (d.osversion = y);
        var z = y.split(".")[0];
        return v || j || "ipad" == e || h && (3 == z || z >= 4 && !w) || d.silk ? d.tablet = g : (w || "iphone" == e || "ipod" == e || h || i || d.blackberry || d.webos || d.bada) && (d.mobile = g), d.msedge || d.msie && d.version >= 10 || d.yandexbrowser && d.version >= 15 || d.vivaldi && d.version >= 1 || d.chrome && d.version >= 20 || d.samsungBrowser && d.version >= 4 || d.firefox && d.version >= 20 || d.safari && d.version >= 6 || d.opera && d.version >= 10 || d.ios && d.osversion && d.osversion.split(".")[0] >= 6 || d.blackberry && d.version >= 10.1 || d.chromium && d.version >= 20 ? d.a = g : d.msie && d.version < 10 || d.chrome && d.version < 20 || d.firefox && d.version < 20 || d.safari && d.version < 6 || d.opera && d.version < 10 || d.ios && d.osversion && d.osversion.split(".")[0] < 6 || d.chromium && d.version < 20 ? d.c = g : d.x = g, d
    }

    function b(a) {
        return a.split(".").length
    }

    function c(a, b) {
        var c, d = [];
        if (Array.prototype.map) return Array.prototype.map.call(a, b);
        for (c = 0; c < a.length; c++) d.push(b(a[c]));
        return d
    }

    function d(a) {
        for (var d = Math.max(b(a[0]), b(a[1])), e = c(a, function(a) {
                var e = d - b(a);
                return a += new Array(e + 1).join(".0"), c(a.split("."), function(a) {
                    return new Array(20 - a.length).join("0") + a
                }).reverse()
            }); --d >= 0;) {
            if (e[0][d] > e[1][d]) return 1;
            if (e[0][d] !== e[1][d]) return -1;
            if (0 === d) return 0
        }
    }

    function e(b, c, e) {
        var f = h;
        "string" == typeof c && (e = c, c = void 0), void 0 === c && (c = !1), e && (f = a(e));
        var g = "" + f.version;
        for (var i in b)
            if (b.hasOwnProperty(i) && f[i]) {
                if ("string" != typeof b[i]) throw new Error("Browser version in the minVersion map should be a string: " + i + ": " + String(b));
                return d([g, b[i]]) < 0
            }
        return c
    }

    function f(a, b, c) {
        return !e(a, b, c)
    }
    var g = !0,
        h = a("undefined" != typeof navigator ? navigator.userAgent || "" : "");
    return h.test = function(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if ("string" == typeof c && c in h) return !0
        }
        return !1
    }, h.isUnsupportedBrowser = e, h.compareVersions = d, h.check = f, h._detect = a, h
});