import { Github } from "../services/github-service.js";
import {
	GITHUB_AUTH_URL,
	GITHUB_CLIENT_ID,
	GITHUB_REDIRECT_URI,
	GITHUB_AUTH_SCOPE,
	GITHUB_CLIENT_SECRET,
	README_TEMPLATE,
	FILE_EXTENSIONS,
} from "../constants.js";

const github = new Github();
let oauthTab = null;

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.action) {
		case "createOAuthTab":
			createOAuthTab();
			break;
		case "handleOAuthFlow":
			handleOAuthFlow(message.authCode, sendResponse);
			break;
		case "redirectToSetupPage":
			redirectToSetupPage();
			break;
		case "fetchUserRepositories":
			fetchUserRepositories(sendResponse);
			break;
		case "submitSetupForm":
			submitSetupForm(message.name, message.type, message.isPrivate);
			break;
		case "handleCodility":
			handleCodility(message.data);
			break;
		default:
	}

	return true;
});

// Actions
function createOAuthTab() {
	const url = `${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=${GITHUB_AUTH_SCOPE}`;
	chrome.tabs.create({ url: url, active: true }, (tab) => {
		oauthTab = tab;
	});
}

function handleOAuthFlow(authCode, sendResponse) {
	github
		.exchangeCodeForToken(authCode, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
		.then(() => {
			github.fetchUserDetails();
			sendResponse(true);
		});
}

function redirectToSetupPage() {
	if (oauthTab) {
		chrome.tabs.update(oauthTab.id, { url: "pages/setup/setup.html" });
		chrome.action.setPopup({ popup: "pages/setup/setup.html" });
	}
}

function fetchUserRepositories(sendResponse) {
	github.fetchUserRepositories().then((repositories) => {
		sendResponse(repositories);
	});
}

function submitSetupForm(name, type, isPrivate) {
	github.setRepository(name).then(() => {
		if (type === "new") {
			github.createRepository(isPrivate);
		}
	});

	chrome.action.setPopup({
		popup: "pages/complete/complete.html",
	});

	if (oauthTab) {
		chrome.tabs.get(oauthTab.id, () => {
			chrome.tabs.remove(oauthTab.id);
			oauthTab = null;
		});
	}
}

function handleCodility(data) {
	const codilityData = data;

	// Create README.md
	const readmePath = `${codilityData.title}/README.md`;
	const readmeContent = README_TEMPLATE(
		codilityData.title,
		codilityData.difficulty,
		codilityData.description
	);
	const readmeCommit = `Add README.md for ${codilityData.title}`;

	github.upsertFile(readmePath, readmeContent, readmeCommit).then(() => {
		// Create code file
		const codePath = `${codilityData.title}/${codilityData.title}.${
			FILE_EXTENSIONS[codilityData.language]
		}`;
		const codeContent = codilityData.code;
		const codeCommit = `Task Score: ${codilityData.taskScore} | Correctness Score: ${codilityData.correctnessScore}`;
		github.upsertFile(codePath, codeContent, codeCommit);
	});
}
