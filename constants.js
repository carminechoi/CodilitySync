import * as CONFIG from "./config.production.js";

export const GITHUB_CLIENT_ID = CONFIG.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = CONFIG.GITHUB_CLIENT_SECRET;
export const GITHUB_REDIRECT_URI = CONFIG.GITHUB_REDIRECT_URI;

export const GITHUB_API_URL = "https://api.github.com";
export const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_AUTH_SCOPE = "repo";

export const README_TEMPLATE = (title, difficulty, description) => `
# ${title}

![Difficulty: ${difficulty}](https://img.shields.io/badge/Difficulty-${difficulty}-${DIFFICULTY_COLORS[difficulty]})

${description}
`;

export const DIFFICULTY_COLORS = {
	Easy: "green",
	Medium: "yellow",
	Hard: "red",
};

export const FILE_EXTENSIONS = {
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
