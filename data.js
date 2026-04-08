// all cheatsheet data
// each entry has: title, category, description, and code
// categories: git, terminal, javascript, css
var cheatsheetData = [
    {
        id: "git-clone",
        title: "Git Clone Repository",
        category: "git",
        description: "Clone a remote repository to your local machine",
        code: "git clone https://github.com/username/repo.git"
    },
    {
        id: "git-commit",
        title: "Git Commit Changes",
        category: "git",
        description: "Commit staged changes with a descriptive message",
        code: "git commit -m 'Add new feature description'"
    },
    {
        id: "git-push",
        title: "Git Push to Remote",
        category: "git",
        description: "Push your commits to a remote branch",
        code: "git push origin main"
    },
    {
        id: "git-pull",
        title: "Git Pull Latest Changes",
        category: "git",
        description: "Fetch and merge the latest changes from remote",
        code: "git pull origin main"
    },
    {
        id: "terminal-list-files",
        title: "List Files in Directory",
        category: "terminal",
        description: "Display all files and folders in the current directory",
        code: "ls -la"
    },
    {
        id: "terminal-change-directory",
        title: "Change Directory",
        category: "terminal",
        description: "Navigate to a different folder",
        code: "cd /path/to/directory"
    },
    {
        id: "terminal-copy-file",
        title: "JavaScript Array Map",
        category: "javascript",
        description: "Transform each element in an array using a function",
        code: "const doubled = numbers.map(n => n * 2);"
    },
    {
        id: "javascript-destructuring",
        title: "JavaScript Object Destructuring",
        category: "javascript",
        description: "Extract values from objects into separate variables",
        code: "const { name, age } = person;"
    },
    {
        id: "javascript-fetch-api",
        title: "JavaScript Fetch API",
        category: "javascript",
        description: "Make an HTTP request to fetch data from an API",
        code: "fetch('https://api.example.com/data')\n  .then(res => res.json())\n  .then(data => console.log(data));"
    },
    {
        id: "css-flexbox",
        title: "CSS Flexbox Container",
        category: "css",
        description: "Create a flexible container that layouts children in a row",
        code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
    },
    {
        id: "css-grid",
        title: "CSS Grid Layout",
        category: "css",
        description: "Create a responsive grid layout for organizing content",
        code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}"
    },
    {
        id: "css-media-query",
        title: "CSS Media Query",
        category: "css",
        description: "Apply styles that only work on mobile screens",
        code: "@media (max-width: 768px) {\n  .responsive {\n    font-size: 14px;\n  }\n}"
    },
    {
        id: "terminal-pwd",
         title: "Print Working Directory",
        category: "terminal",
        description: "Show the current directory path",
        code: "pwd"
    },
    {
        id: "terminal-mkdir",
        title: "Create Directory",
        category: "terminal",
        description: "Create a new folder",
        code: "mkdir folder-name"
   },
   {
        id: "terminal-clear",
        title: "Clear Terminal",
        category: "terminal",
        description: "Clear the terminal screen",
        code: "clear"
   },
   {
        id: "git-status",
        title: "Git View Status",
        category: "git",
        description: "Check the current state of your repository including staged and unstaged changes.",
        code: "git status"
    },
];
