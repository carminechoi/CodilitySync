export class OAuth {
	constructor() {
		this.auth_url = "https://github.com/login/oauth/authorize";
		this.client_id = "7c89607e07edc93ace0e";
		// this.redirect_uri = chrome.identity.getRedirectURL("github_oauth");
		this.scope = "repo";
	}

	// Redirect the user to the GitHub OAuth page.
	authenticate() {
		console.log("authenticate");
		const url = `${this.auth_url}?client_id=${this.client_id}&scope=${this.scope}`;
		chrome.tabs.create({ url: url, active: true });
	}
}

export default new OAuth();
