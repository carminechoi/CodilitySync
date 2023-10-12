function getQueryParam(url, param) {
	const queryString = url.substring(url.indexOf("?") + 1);
	const params = new URLSearchParams(queryString);
	return params.get(param);
}

async function main() {
	// Extract the 'code' query parameter value
	const authCode = getQueryParam(window.location.search, "code");

	if (authCode) {
		chrome.runtime.sendMessage({
			action: "handleOAuthFlow",
			authCode: authCode,
		});

		chrome.runtime.sendMessage({
			action: "redirectToSetupPage",
		});
	} else {
		console.error("No authorization code found in the redirect URL.");
	}
}

main();
