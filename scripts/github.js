export class Github {
	constructor() {}

	async fetchUserRepositories() {
		const accessTokenStorage = await chrome.storage.sync.get(["accessToken"]);
		const accessToken = accessTokenStorage.accessToken;

		fetch(`https://api.github.com/user/repos`, {
			headers: {
				Authorization: `token ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((repositories) => {
				return repositories;
			})
			.catch((error) => {
				console.error("Error fetching repositories:", error);
			});
	}
}

export default new Github();
