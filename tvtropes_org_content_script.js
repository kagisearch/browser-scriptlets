(function () {
	"use strict";

	var nativeSetTimeout = window.setTimeout;
	var nativeToString = Function.prototype.toString;
	var detectionTimerPattern = /offsetHeight\s*===?\s*0|installedModules/;
	var nativeOnError = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "onerror");
	var adScriptPattern = /googlesyndication\.com|doubleclick\.net|googletagservices\.com|googletagmanager\.com\/gtag|cdn\.bigcrunch\.com\/ads\.js/;

	// Ensure TV Tropes' timers that measure hidden ad slots or inspect Prebid never run, so neither check can report an ad blocker
	window.setTimeout = function (handler) {
		if (typeof handler === "function" && detectionTimerPattern.test(nativeToString.call(handler))) {
			return 0;
		}
		return nativeSetTimeout.apply(this, arguments);
	};

	// Ensure blocked ad scripts never report their failed load, so the page can't count them, while other scripts keep their error handler
	Object.defineProperty(HTMLScriptElement.prototype, "onerror", {
		configurable: true,
		get: nativeOnError.get,
		set: function (handler) {
			var script = this;
			nativeOnError.set.call(script, typeof handler !== "function" ? handler : function () {
				return adScriptPattern.test(script.src) ? undefined : handler.apply(this, arguments);
			});
		}
	});
})();
