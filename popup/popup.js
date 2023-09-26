// let authTabId = null;

function authenticate(event) {
	// Redirect the user to the GitHub OAuth page.
	const AUTH_URL = "https://github.com/login/oauth/authorize";
	const CLIENT_ID = "7c89607e07edc93ace0e";
	const SCOPE = "repo";
	const url = `${AUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPE}`;

	chrome.tabs.create({ url: url, active: true });
}

document.getElementById("authenticate").addEventListener("click", authenticate);
