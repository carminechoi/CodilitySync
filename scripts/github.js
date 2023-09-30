export class Github {
	constructor() {}

	async isAuthorized() {
		const result = await chrome.storage.sync.get(["accessToken"]);
		if (result && result.accessToken) {
			return true;
		} else {
			return false;
		}
	}

	async fetchUserRepositories() {
		try {
			const result = await chrome.storage.sync.get(["accessToken"]);
			const accessToken = result.accessToken;

			const response = await fetch(`https://api.github.com/user/repos`, {
				headers: {
					Authorization: `token ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error(
					`Failed to fetch repositories: ${response.status} ${response.statusText}`
				);
				return [];
			}

			const repositories = await response.json();
			return repositories;
		} catch (error) {
			console.error("Error fetching repositories:", error);
			return [];
		}
	}
}

export default new Github();
