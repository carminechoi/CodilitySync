import { Github } from "../scripts/github.js";
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_REDIRECT_URI,
} from "../../config.production.js";

const github = new Github();
let oauthTab = null;

// Listen for messages from your popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.action) {
		case "createOAuthTab":
			const authoriation_url = "https://github.com/login/oauth/authorize";
			const scope = "repo";
			const url = `${authoriation_url}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=${scope}`;
			chrome.tabs.create({ url: url, active: true }, (tab) => {
				oauthTab = tab;
			});
			break;
		case "handleOAuthFlow":
			github
				.exchangeCodeForToken(
					message.authCode,
					GITHUB_CLIENT_ID,
					GITHUB_CLIENT_SECRET
				)
				.then(() => {
					github.fetchUserDetails();
				});
			break;
		case "redirectToSetupPage":
			if (oauthTab) {
				chrome.tabs.update(oauthTab.id, { url: "pages/setup/setup.html" });
				chrome.action.setPopup({ popup: "pages/setup/setup.html" });
			}
			break;
		case "fetchUserRepositories":
			github.fetchUserRepositories().then((repositories) => {
				sendResponse(repositories);
			});
			break;
		case "submitSetupForm":
			github.setRepository(message.name).then(() => {
				if (message.type === "new") {
					github.createRepository(message.isPrivate);
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
			break;
		case "handleCodility":
			const codilityData = message.data;

			// Create README.md
			const difficultyColors = {
				Easy: "green",
				Medium: "yellow",
				Hard: "red",
			};
			const readmePath = `${codilityData.title}/README.md`;
			const readmeContent = `<h2>${
				codilityData.title
			}</h2><img src='https://img.shields.io/badge/Difficulty-${
				codilityData.difficulty
			}-${
				difficultyColors[codilityData.difficulty] || "green"
			}' alt='Difficulty: Easy' /><hr>${codilityData.description}`;
			const readmeCommit = `Add README.md for ${codilityData.title}`;

			github
				.upsertFileOrDirectory(readmePath, readmeContent, readmeCommit)
				.then(() => {
					// Create code file
					const extensions = {
						C: "c",
						"C++20": "cpp",
						"C#": "cs",
						Dart: "dart",
						Go: "go",
						"Java 11": "java",
						"Java 8": "java",
						JavaScript: "js",
						Kotlin: "kt",
						Lua: "lua",
						"Objective-C": "m",
						Pascal: "pas",
						Perl: "pl",
						PHP: "php",
						Python: "py",
						Ruby: "rb",
						Scala: "scala",
						Swift: "swift",
						TypeScript: "ts",
						"Visual Basic": "vb",
					};
					const codePath = `${codilityData.title}/${codilityData.title}.${
						extensions[codilityData.language]
					}`;
					const codeContent = codilityData.code;
					const codeCommit = `Task Score: ${codilityData.taskScore} | Correctness Score: ${codilityData.correctnessScore}`;
					github.upsertFileOrDirectory(codePath, codeContent, codeCommit);
				});

		default:
	}

	return true;
});
