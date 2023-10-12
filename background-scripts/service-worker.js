// import OAuth from "../content-scripts/oauth.js";
import { Github } from "../scripts/github.js";
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_REDIRECT_URI,
} from "../../config.production.js";

const github = new Github();
let oauthTab = null;

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.action) {
		case "createOAuthTab":
			const authoriation_url = "https://github.com/login/oauth/authorize";
			const scope = "repo";
			const url = `${authoriation_url}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=${scope}`;
			chrome.tabs.create({ url: url, active: true }, (tab) => {
				oauthTab = tab;
			});
			break;
		case "handleOAuthFlow":
			github
				.exchangeCodeForToken(
					message.authCode,
					GITHUB_CLIENT_ID,
					GITHUB_CLIENT_SECRET
				)
				.then(() => {
					github.fetchUserDetails();
				});
			break;
		case "redirectToSetupPage":
			if (oauthTab) {
				chrome.tabs.update(oauthTab.id, { url: "pages/setup/setup.html" });
				chrome.action.setPopup({ popup: "pages/setup/setup.html" });
			}
			break;
		case "fetchUserRepositories":
			github.fetchUserRepositories().then((repositories) => {
				sendResponse(repositories);
			});
			break;
		case "selectRepository":
			if (message.type === "new") {
				github.createRepository(message.name, message.isPrivate);
			}
			github.setRepository(message.name);
			break;
		default:
			console.log("default");
	}
});