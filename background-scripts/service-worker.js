// import OAuth from "../content-scripts/oauth.js";
import { Github } from "../scripts/github.js";
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_REDIRECT_URI,
} from "../../config.production.js";

const github = new Github();

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("message");
	switch (message.action) {
		case "createOAuthTab":
			const authoriation_url = "https://github.com/login/oauth/authorize";
			const client_id = GITHUB_CLIENT_ID ?? "";
			const redirect_uri = GITHUB_REDIRECT_URI ?? "";
			const scope = "repo";
			const url = `${authoriation_url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
			chrome.tabs.create({ url: url, active: true });
			break;
		case "setAccessToken":
			console.log("before setAccessToken");
			github.setAccessToken(message.accessToken);
			console.log("in here");
			break;
		case "fetchUserDetails":
			github.fetchUserDetails();
			break;
		case "fetchUserRepositories":
			github.fetchUserRepositories().then((repositories) => {
				sendResponse(repositories);
			});
			break;
		case "selectRepository":
			// if (message.type === "new") {
			// 	await github.createRepository(message.name, message.isPrivate);
			// }
			// await github.setRepository(message.name);
			break;
		default:
			console.log("default");
	}
	// if (message.codilityData) {
	// 	const codilityData = message.codilityData;
	// 	console.log(codilityData);
	// }
	// if (message.action == "setAccessToken") {
	// 	console.log("before setAccessToken");
	// 	github.setAccessToken(message.accessToken);
	// 	console.log("in here");
	// }
});

// Listen for changes in the active tab's URL
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
// 	if (
// 		changeInfo.status === "complete" &&
// 		tab.url.startsWith(GITHUB_REDIRECT_URI)
// 	) {
// 		await OAuth.handleOAuthRedirect(tab.url);
// 	}
// });
