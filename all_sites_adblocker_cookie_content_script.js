(function () {
	"use strict";

	var descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
	if (!descriptor || !descriptor.get || !descriptor.set) {
		return;
	}

	// Ensure the page never keeps an __adblocker cookie, so Raptive's recovery script doesn't load the Ad-Shield wall
	descriptor.set.call(document, "__adblocker=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/");

	Object.defineProperty(Document.prototype, "cookie", {
		configurable: true,
		enumerable: descriptor.enumerable,
		get: function () {
			return descriptor.get.call(this);
		},
		set: function (value) {
			if (/^\s*__adblocker\s*=/.test(String(value))) {
				return;
			}
			descriptor.set.call(this, value);
		}
	});
})();
