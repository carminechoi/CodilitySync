import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_REDIRECT_URI,
} from "../config.production.js";

export class OAuth {
	constructor() {
		this.access_token_url = "https://github.com/login/oauth/access_token";
		this.authoriation_url = "https://github.com/login/oauth/authorize";
		this.client_id = GITHUB_CLIENT_ID ?? "";
		this.client_secret = GITHUB_CLIENT_SECRET ?? "";
		this.redirect_uri = GITHUB_REDIRECT_URI ?? "";
		this.scope = "repo";
	}

	// Redirect the user to the GitHub OAuth page.
	authenticate() {
		const url = `${this.authoriation_url}?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&scope=${this.scope}`;
		chrome.tabs.create({ url: url, active: true });
	}

	// Handle the OAuth redirect and extract the authorization code
	async handleOAuthRedirect(redirectURL) {
		const code = this.getQueryParam(redirectURL, "code");

		// Delete the redirect page after extracting authorization code
		let [tab] = await chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		});

		// Fetch access token
		if (code) {
			const accessToken = await this.exchangeCodeForToken(code);

			chrome.runtime.sendMessage({
				action: "setAccessToken",
				accessToken: accessToken,
			});
			chrome.runtime.sendMessage({ action: "fetchUserDetails" });
		} else {
			console.error("No authorization code found in the redirect URL.");
		}

		// Open Setup page
		chrome.tabs.remove(tab.id);
		chrome.tabs.create({ url: "pages/setup/setup.html", active: true });
	}

	// Extract query parameters from a URL
	getQueryParam(url, name) {
		const match = RegExp(`[?&]${name}=([^&]*)`).exec(url);
		return match && decodeURIComponent(match[1]);
	}

	// Exchange the authorization code for an access token
	async exchangeCodeForToken(code) {
		try {
			const response = await fetch(this.access_token_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					code: code,
					client_id: this.client_id,
					client_secret: this.client_secret,
					redirect_uri: this.redirect_uri,
				}),
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				throw new Error(`Failed to get access token: ${errorData.message}`);
			}

			const data = await response.json();
			return data.access_token;
		} catch (error) {
			console.error(
				"Error exchanging authorization code for access token:",
				error
			);
			throw error;
		}
	}
}

export default new OAuth();
