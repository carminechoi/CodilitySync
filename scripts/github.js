export class Github {
	constructor() {
		this.accessToken = this.getAccessToken();
		this.repository = this.getRepository();
		this.username = this.getUsername();
		this.baseURL = "https://api.github.com";
	}

	// Getters
	async getAccessToken() {
		const result = await chrome.storage.sync.get(["accessToken"]);
		return result.accessToken;
	}

	async getRepository() {
		const result = await chrome.storage.sync.get(["repository"]);
		return result.repository;
	}

	async getUsername() {
		const result = await chrome.storage.sync.get(["username"]);
		return result.username;
	}

	// Setters
	async setAccessToken(accessToken) {
		this.accessToken = accessToken;
		chrome.storage.sync.set({ accessToken: accessToken });
	}

	async setRepository(repository) {
		this.repository = repository;
		chrome.storage.sync.set({ repository: repository });
	}

	async setUsername(username) {
		this.username = username;
		chrome.storage.sync.set({ username: username });
	}

	async isLinked() {
		const result = await chrome.storage.sync.get(["repository"]);
		return !!result.repository;
	}

	async isAuthorized() {
		const result = await chrome.storage.sync.get(["accessToken"]);
		return !!result.accessToken;
	}

	// Github Actions
	// Exchange the authorization code for an access token
	async exchangeCodeForToken(code, clientId, clientSecret) {
		try {
			const access_token_url = "https://github.com/login/oauth/access_token";
			const response = await fetch(access_token_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					code: code,
					client_id: clientId,
					client_secret: clientSecret,
					// redirect_uri: redirectUri,
				}),
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				throw new Error(`Failed to get access token: ${errorData.message}`);
			}

			const data = await response.json();
			this.setAccessToken(data.access_token);
		} catch (error) {
			console.error(
				"Error exchanging authorization code for access token:",
				error
			);
			throw error;
		}
	}

	async fetchUserDetails() {
		try {
			const response = await fetch(`${this.baseURL}/user`, {
				headers: {
					Authorization: `token ${this.accessToken}`,
				},
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				throw new Error(`Failed to get user details: ${errorData.message}`);
			}

			const userData = await response.json();
			this.setUsername(userData.username);
			return userData;
		} catch (error) {
			console.error("Error fetching user details:", error);
			throw error;
		}
	}

	async fetchUserRepositories() {
		try {
			const response = await fetch(`${this.baseURL}/user/repos`, {
				headers: {
					Authorization: `token ${this.accessToken}`,
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

	async createRepository(name, isPrivate) {
		try {
			const usernameStorage = await chrome.storage.sync.get(["username"]);
			const username = usernameStorage.username;

			const description =
				"Collection of Codility questions - Created using CodilitySync";
			const readmeContent =
				"Collection of Codility questions - Created using [CodilitySync](https://github.com/carminechoi/CodilitySync)";

			// Create new repository
			const createRepoResponse = await fetch(
				`${this.baseURL}` / user / repos``,
				{
					method: "POST",
					headers: {
						Authorization: `token ${this.accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: name,
						description: description,
						private: isPrivate,
					}),
				}
			);

			if (createRepoResponse.status !== 201) {
				const errorData = await createRepoResponse.json();
				throw new Error(`Failed to create repository: ${errorData.message}`);
			}

			// Create a README.md file
			const createReadmeResponse = await fetch(
				`${this.baseURL}/repos/${username}/${name}/contents/README.md`,
				{
					method: "PUT",
					headers: {
						Authorization: `token ${this.accessToken}`,
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
