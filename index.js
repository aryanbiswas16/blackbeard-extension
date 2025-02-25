import { Octokit } from "@octokit/core";
import express from "express";
import { Readable } from "node:stream";

const app = express()

app.get("/", (req, res) => {
  res.send("Hi there! I'm the Angular 7 to 14 Upgrade Assistant");
});

app.post("/", express.json(), async (req, res) => {
  // Identify the user, using the GitHub API token provided in the request headers.
  const tokenForUser = req.get("X-GitHub-Token");
  const octokit = new Octokit({ auth: tokenForUser });
  const user = await octokit.request("GET /user");
  console.log("User:", user.data.login);

  // Parse the request payload and log it.
  const payload = req.body;
  console.log("Payload:", payload);

  // Insert a special pirate-y system message in our message list.
  const messages = payload.messages;
  messages.unshift({
    role: "system",
    content: `You are an autonomous Angular upgrade assistant. The package.json shows Angular 14 dependencies, but project files need updating from Angular 7.
  
  Focus on:
  1. Required syntax updates for Angular 14
  2. Template syntax changes
  3. Component/Service modifications
  4. Updated imports
  5. TypeScript strict mode fixes
  6. Decorator pattern updates
  
  Format responses with:
  ### 🔄 File Changes
  - Complete file paths and code updates
  - Line-specific changes
  
  ### ⚠️ Breaking Changes
  - Required modifications
  - Migration solutions
  
  ### 🔍 Validation Steps
  - Template syntax checks
  - Type checking improvements
  - Testing requirements`
  });
  messages.unshift({
  role: "system",
  content: `Start every response with the user's name, which is @${user.data.login}`,
  });

  // Use Copilot's LLM to generate a response to the user's messages, with
  // our extra system messages attached.
  const copilotLLMResponse = await fetch(
    "https://api.githubcopilot.com/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${tokenForUser}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages,
        stream: true,
      }),
    }
  );

  // Stream the response straight back to the user.
  Readable.from(copilotLLMResponse.body).pipe(res);
})

const port = Number(process.env.PORT || '3000')
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});


// // import { Octokit } from "@octokit/core";
// // import express from "express";
// // import { Readable } from "node:stream";
// // import fs from 'fs/promises';
// // import path from 'path';

// // const app = express();

// // // Define the app version and name for user-agent
// // const APP_NAME = 'test-app-bbangular';
// // const APP_VERSION = '1.0.0';
// // const USER_AGENT = `${APP_NAME}/${APP_VERSION}`;

// // async function validateAngularProject(projectPath) {
// //   try {
// //     const packageJson = await fs.readFile(path.join(projectPath, 'package.json'), 'utf8');
// //     const dependencies = JSON.parse(packageJson).dependencies || {};
    
// //     if (!dependencies['@angular/core']) {
// //       return {
// //         isAngular: false,
// //         message: "This project does not appear to be an Angular project. No @angular/core dependency found."
// //       };
// //     }

// //     const angularVersion = dependencies['@angular/core'].replace(/[\^~]/, '');
// //     if (!angularVersion.startsWith('7.')) {
// //       return {
// //         isAngular: false,
// //         message: `This project is not running Angular 7. Found version: ${angularVersion}`
// //       };
// //     }

// //     return {
// //       isAngular: true,
// //       version: angularVersion
// //     };
// //   } catch (error) {
// //     return {
// //       isAngular: false,
// //       message: "Could not find or parse package.json. Please ensure you're in an Angular project directory."
// //     };
// //   }
// // }

// // app.get("/", (req, res) => {
// //   res.send("Welcome to the Angular 7 to 14 Upgrade Assistant!");
// // });

// // app.post("/", express.json(), async (req, res) => {
// //   try {
// //     const tokenForUser = req.get("X-GitHub-Token");
// //     const projectPath = req.get("X-Project-Path"); // Client needs to send the project path

// //     if (!tokenForUser) {
// //       return res.status(401).json({ error: "GitHub token is required in X-GitHub-Token header" });
// //     }

// //     if (!projectPath) {
// //       return res.status(400).json({ error: "Project path is required in X-Project-Path header" });
// //     }

// //     // Validate the Angular project first
// //     const projectValidation = await validateAngularProject(projectPath);
// //     if (!projectValidation.isAngular) {
// //       return res.status(400).json({ error: projectValidation.message });
// //     }

// //     // Initialize Octokit with proper user-agent
// //     const octokit = new Octokit({ 
// //       auth: tokenForUser,
// //       userAgent: USER_AGENT
// //     });

// //     // Get user information
// //     let user;
// //     try {
// //       user = await octokit.request("GET /user");
// //       console.log("User:", user.data.login);
// //     } catch (error) {
// //       console.error("Error fetching GitHub user:", error);
// //       return res.status(error.status || 500).json({ 
// //         error: "Failed to authenticate with GitHub",
// //         details: error.message
// //       });
// //     }

// //     const payload = req.body;
// //     console.log("Payload:", payload);

// //     const messages = payload.messages || [];
// //     messages.unshift({
// //       role: "system",
// //       content: `You are an autonomous Angular upgrade assistant specialized in migrating from Angular 7 to Angular 14.
// //       Project Context:
// //       - Angular Version: ${projectValidation.version}
// //       - Project Path: ${projectPath}

// //       For each response:
// //       1. Analyze package.json and suggest exact dependency updates with version numbers
// //       2. Provide ready-to-use npm commands for updating dependencies
// //       3. Generate specific code modifications needed, including:
// //          - Required syntax changes
// //          - Updated import statements
// //          - Modified decorator configurations
// //          - Required TypeScript updates
// //       4. Include necessary terminal commands to execute the upgrade
// //       5. Provide specific file paths that need modifications
// //       6. If applicable, generate migration scripts

// //       Format your response with:
// //       - 📦 Package Updates (with exact commands)
// //       - 🔄 Code Changes (with file paths and exact code)
// //       - ⚠️ Breaking Changes (with solutions)
// //       - 🛠️ Migration Commands
      
// //       Always provide copy-pasteable commands and code snippets.`
// //     });
// //     messages.unshift({
// //       role: "system",
// //       content: `Address the user as @${user.data.login} and structure your response in a clear, actionable format.`
// //     });

// //     try {
// //       const copilotLLMResponse = await fetch(
// //         "https://api.githubcopilot.com/chat/completions",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Authorization": `Bearer ${tokenForUser}`,
// //             "Content-Type": "application/json",
// //             "User-Agent": USER_AGENT
// //           },
// //           body: JSON.stringify({
// //             messages,
// //             stream: true,
// //           }),
// //         }
// //       );

// //       if (!copilotLLMResponse.ok) {
// //         const errorText = await copilotLLMResponse.text();
// //         console.error(`GitHub API error: ${copilotLLMResponse.status} - ${errorText}`);
// //         return res.status(copilotLLMResponse.status).json({ 
// //           error: `GitHub API error: ${copilotLLMResponse.status}`,
// //           details: errorText
// //         });
// //       }

// //       // Set appropriate headers for streaming response
// //       res.setHeader('Content-Type', 'text/event-stream');
// //       res.setHeader('Cache-Control', 'no-cache');
// //       res.setHeader('Connection', 'keep-alive');
      
// //       // Stream the response back to the user
// //       Readable.from(copilotLLMResponse.body).pipe(res);
// //     } catch (error) {
// //       console.error("Error calling GitHub Copilot API:", error);
// //       res.status(500).json({ 
// //         error: "Failed to communicate with GitHub Copilot API",
// //         details: error.message
// //       });
// //     }
// //   } catch (error) {
// //     console.error("Unexpected error:", error);
// //     res.status(500).json({ 
// //       error: "An unexpected error occurred",
// //       details: error.message
// //     });
// //   }
// // });

// // const port = Number(process.env.PORT || '3000');
// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });
