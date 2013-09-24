// Copyright 2013 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @version v0.1
 */


(function(){
    var _detectBrowser = function(userAgent, language) {
        var version, webkitVersion, iOSAgent, iOSDevice, iOSMajorVersion, iOSMinorVersion, browser = {};
        userAgent = (userAgent || navigator.userAgent).toLowerCase();
        language = language || navigator.language || navigator.browserLanguage;
        version = browser.version = (userAgent.match(/.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/) || [])[1];
        webkitVersion = (userAgent.match(/webkit\/(.+?) /) || [])[1];
        iOSAgent = (userAgent.match(/\b(iPad|iPhone|iPod)\b.*\bOS (\d)_(\d)/i) || []);
        iOSDevice = iOSAgent[1];
        iOSMajorVersion = iOSAgent[2];
        iOSMinorVersion = iOSAgent[3];
        browser.windows = browser.isWindows = !!/windows/.test(userAgent);
        browser.mac = browser.isMac = !!/macintosh/.test(userAgent) || (/mac os x/.test(userAgent) && !/like mac os x/.test(userAgent));
        browser.lion = browser.isLion = !!(/mac os x 10[_\.][7-9]/.test(userAgent) && !/like mac os x 10[_\.][7-9]/.test(userAgent));
        browser.iPhone = browser.isiPhone = (iOSDevice === "iphone");
        browser.iPod = browser.isiPod = (iOSDevice === "ipod");
        browser.iPad = browser.isiPad = (iOSDevice === "ipad");
        browser.iOS = browser.isiOS = browser.iPhone || browser.iPod || browser.iPad;
        browser.iOSMajorVersion = browser.iOS ? iOSMajorVersion * 1 : undefined;
        browser.iOSMinorVersion = browser.iOS ? iOSMinorVersion * 1 : undefined;
        browser.android = browser.isAndroid = !!/android/.test(userAgent);
        browser.silk = browser.isSilk = !!/silk/.test(userAgent);
        browser.opera = /opera/.test(userAgent) ? version : 0;
        browser.isOpera = !!browser.opera;
        browser.msie = /msie/.test(userAgent) && !browser.opera ? version : 0;
        browser.isIE = !!browser.msie;
        browser.isIE8OrLower = !!(browser.msie && parseInt(browser.msie, 10) <= 8);
        browser.isIE9OrLower = !!(browser.msie && parseInt(browser.msie, 10) <= 9);
        browser.isIE10 = !!(browser.msie && parseInt(browser.msie, 10) === 10);
        browser.mozilla = /mozilla/.test(userAgent) && !/(compatible|webkit|msie)/.test(userAgent) ? version : 0;
        browser.isMozilla = !!browser.mozilla;
        browser.webkit = /webkit/.test(userAgent) ? webkitVersion : 0;
        browser.isWebkit = !!browser.webkit;
        browser.chrome = /chrome/.test(userAgent) ? version : 0;
        browser.isChrome = !!browser.chrome;
        browser.mobileSafari = /apple.*mobile/.test(userAgent) && browser.iOS ? webkitVersion : 0;
        browser.isMobileSafari = !!browser.mobileSafari;
        browser.iPadSafari = browser.iPad && browser.isMobileSafari ? webkitVersion : 0;
        browser.isiPadSafari = !!browser.iPadSafari;
        browser.iPhoneSafari = browser.iPhone && browser.isMobileSafari ? webkitVersion : 0;
        browser.isiPhoneSafari = !!browser.iphoneSafari;
        browser.iPodSafari = browser.iPod && browser.isMobileSafari ? webkitVersion : 0;
        browser.isiPodSafari = !!browser.iPodSafari;
        browser.isiOSHomeScreen = browser.isMobileSafari && !/apple.*mobile.*safari/.test(userAgent);
        browser.safari = browser.webkit && !browser.chrome && !browser.iOS && !browser.android ? webkitVersion : 0;
        browser.isSafari = !!browser.safari;
        browser.language = language.split("-", 1)[0];
        browser.current = browser.msie ? "msie" : browser.mozilla ? "mozilla" : browser.chrome ? "chrome" : browser.safari ? "safari" : browser.opera ? "opera" : browser.mobileSafari ? "mobile-safari" : browser.android ? "android" : "unknown";
        return browser;
    };
    mic_touch=mic_touch||{};
    mic_touch.browser = _detectBrowser();
}());