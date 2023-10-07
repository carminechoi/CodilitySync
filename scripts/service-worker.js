import OAuth from "../scripts/oauth.js";
import { GITHUB_REDIRECT_URI } from "../config.production.js";

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.codilityData) {
		const codilityData = message.codilityData;
		console.log(codilityData);
	}
});

// Listen for changes in the active tab's URL
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (
		changeInfo.status === "complete" &&
		tab.url.startsWith(GITHUB_REDIRECT_URI)
	) {
		await OAuth.handleOAuthRedirect(tab.url);
	}
});
