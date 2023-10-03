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

	async fetchUserDetails() {
		try {
			const result = await chrome.storage.sync.get(["accessToken"]);
			const accessToken = result.accessToken;

			const response = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `token ${accessToken}`,
				},
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				throw new Error(`Failed to get user details: ${errorData.message}`);
			}

			const userData = await response.json();
			return userData;
		} catch (error) {
			console.error("Error fetching user details:", error);
			throw error;
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

	async createRepository(name) {
		try {
			const accessTokenStorage = await chrome.storage.sync.get(["accessToken"]);
			const accessToken = accessTokenStorage.accessToken;

			const usernameStorage = await chrome.storage.sync.get(["username"]);
			const username = usernameStorage.username;

			const description =
				"Collection of Codility questions - Created using CodilitySync";
			const readmeContent =
				"Collection of Codility questions - Created using [CodilitySync](https://github.com/carminechoi/CodilitySync)";

			// Create new repository
			const createRepoResponse = await fetch(
				"https://api.github.com/user/repos",
				{
					method: "POST",
					headers: {
						Authorization: `token ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: name,
						description: description,
						private: false,
					}),
				}
			);

			if (createRepoResponse.status !== 201) {
				const errorData = await createRepoResponse.json();
				throw new Error(`Failed to create repository: ${errorData.message}`);
			}

			// Create a README.md file
			const createReadmeResponse = await fetch(
				`https://api.github.com/repos/${username}/${name}/contents/README.md`,
				{
					method: "PUT",
					headers: {
						Authorization: `token ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: "Initial commit",
						content: btoa(readmeContent),
					}),
				}
			);

			if (createReadmeResponse.status !== 201) {
				const errorData = await createReadmeResponse.json();
				throw new Error(`Failed to create README: ${errorData.message}`);
			}
		} catch (error) {
			console.error("Error creating repository:", error);
			throw error;
		}
	}
}

export default new Github();
