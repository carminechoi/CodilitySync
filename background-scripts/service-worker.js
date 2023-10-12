import { Github } from "../scripts/github.js";
import * as Constants from "../constants.js";

const github = new Github();
let oauthTab = null;

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.action) {
		case "createOAuthTab":
			createOAuthTab();
			break;
		case "handleOAuthFlow":
			handleOAuthFlow(message.authCode);
			break;
		case "redirectToSetupPage":
			redirectToSetupPage();
			break;
		case "fetchUserRepositories":
			fetchUserRepositories();
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
	const url = `${Constants.GITHUB_AUTH_URL}?client_id=${Constants.GITHUB_CLIENT_ID}&redirect_uri=${Constants.GITHUB_REDIRECT_URI}&scope=${Constants.GITHUB_AUTH_SCOPE}`;
	chrome.tabs.create({ url: url, active: true }, (tab) => {
		oauthTab = tab;
	});
}

function handleOAuthFlow(authCode) {
	github
		.exchangeCodeForToken(
			authCode,
			Constants.GITHUB_CLIENT_ID,
			Constants.GITHUB_CLIENT_SECRET
		)
		.then(() => {
			github.fetchUserDetails();
		});
}

function redirectToSetupPage() {
	if (oauthTab) {
		chrome.tabs.update(oauthTab.id, { url: "pages/setup/setup.html" });
		chrome.action.setPopup({ popup: "pages/setup/setup.html" });
	}
}

function fetchUserRepositories() {
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
	const readmeContent = Constants.README_TEMPLATE(
		codilityData.title,
		codilityData.difficulty,
		codilityData.description
	);
	const readmeCommit = `Add README.md for ${codilityData.title}`;

	github
		.upsertFileOrDirectory(readmePath, readmeContent, readmeCommit)
		.then(() => {
			// Create code file
			const codePath = `${codilityData.title}/${codilityData.title}.${
				Constants.FILE_EXTENSIONS[codilityData.language]
			}`;
			const codeContent = codilityData.code;
			const codeCommit = `Task Score: ${codilityData.taskScore} | Correctness Score: ${codilityData.correctnessScore}`;
			github.upsertFileOrDirectory(codePath, codeContent, codeCommit);
		});
}
