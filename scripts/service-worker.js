import OAuth from "../scripts/oauth.js";
import Github from "./github.js";
import { GITHUB_REDIRECT_URI } from "../config.production.js";

const github = new Github();

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.codilityData) {
		const codilityData = message.codilityData;
		console.log(codilityData);
	}
	if (message.action == "fetchUserDetails") {
		github.fetchUserDetails();
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
