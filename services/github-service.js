import { GITHUB_API_URL, GITHUB_TOKEN_URL } from "../constants.js";

export class Github {
	constructor() {
		chrome.storage.sync.get(
			["accessToken", "repository", "username"],
			(result) => {
				this.accessToken = result.accessToken ?? "";
				this.repository = result.repository ?? "";
				this.username = result.username ?? "";
			}
		);
	}

	// Setters
	async setAccessToken(accessToken) {
		this.accessToken = accessToken;
		await chrome.storage.sync.set({ accessToken: accessToken });
	}

	async setRepository(repository) {
		this.repository = repository;
		await chrome.storage.sync.set({ repository: repository });
	}

	async setUsername(username) {
		this.username = username;
		await chrome.storage.sync.set({ username: username });
	}

	// Github Actions

	// Exchange authorization code for an access token
	async exchangeCodeForToken(code, clientId, clientSecret) {
		try {
			const response = await fetch(GITHUB_TOKEN_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					code: code,
					client_id: clientId,
					client_secret: clientSecret,
				}),
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				console.error(
					"Failed to get access token:",
					response.status,
					errorData.message
				);
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

	// Get user details to save username
	async fetchUserDetails() {
		try {
			const response = await fetch(`${GITHUB_API_URL}/user`, {
				headers: {
					Authorization: `token ${this.accessToken}`,
				},
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				console.error(
					"Failed to get user details:",
					response.status,
					errorData.message
				);
			}

			const userData = await response.json();
			this.setUsername(userData.login);
		} catch (error) {
			console.error("Error fetching user details:", error);
			throw error;
		}
	}

	// Get all public/private repositories of the user
	async fetchUserRepositories() {
		try {
			const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
				headers: {
					Authorization: `token ${this.accessToken}`,
				},
			});

			if (response.status !== 200) {
				const errorData = await response.json();
				console.error(
					"Failed to fetch repositories:",
					response.status,
					errorData.message
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

	// Create new repository with README.md
	async createRepository(isPrivate) {
		try {
			const description =
				"Collection of Codility questions - Created using CodilitySync";
			const readmeContent =
				"Collection of Codility questions - Created using [CodilitySync](https://github.com/carminechoi/CodilitySync)";

			// Create new repository
			const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
				method: "POST",
				headers: {
					Authorization: `token ${this.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: this.repository,
					description: description,
					private: isPrivate,
				}),
			});

			if (response.status !== 200 && response.status !== 201) {
				const errorData = await response.json();
				console.error(
					"Failed to create repository:",
					response.status,
					errorData.message
				);
			}

			// Create a README.md file
			this.upsertFile("README.md", readmeContent, "Initial commit");
		} catch (error) {
			console.error("Error creating repository:", error);
			throw error;
		}
	}

	// Update/Insert a file to repository
	async upsertFile(path, content, commitMessage) {
		try {
			const sha = await this.getFileSHAIfExists(path);

			// encode then decode to ensures non-Latin1 characters are properly handled
			const encodedContent = encodeURIComponent(content);
			const decodedContent = decodeURIComponent(encodedContent);

			const response = await fetch(
				`${GITHUB_API_URL}/repos/${this.username}/${this.repository}/contents/${path}`,
				{
					method: "PUT",
					headers: {
						Authorization: `token ${this.accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: commitMessage,
						content: btoa(decodedContent),
						sha: sha,
					}),
				}
			);

			if (response.status !== 200 && response.status !== 201) {
				const errorData = await response.json();
				console.error(
					"Error upserting file/directory:",
					response.status,
					errorData.message
				);
			}
		} catch (error) {
			console.error("Error upserting file/directory:", error);
		}
	}

	// Get SHA of file if it exists
	async getFileSHAIfExists(path) {
		try {
			const response = await fetch(
				`${GITHUB_API_URL}/repos/${this.username}/${this.repository}/contents/${path}`,
				{
					method: "GET",
					headers: {
						Authorization: `token ${this.accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status !== 200) {
				return null;
			}
			const data = await response.json();
			return data.sha;
		} catch (error) {
			console.error("Error checking file:", error);
			return null;
		}
	}
}

export default new Github();
