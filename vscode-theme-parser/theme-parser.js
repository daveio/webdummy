#!/usr/bin/env node

/**
 * VS Code Theme Parser
 *
 * This script parses Visual Studio Code theme files (JSON) and generates
 * a Markdown summary of the colors and settings used in the theme.
 *
 * It can also extract and analyze themes from .vsix extension files.
 *
 * Usage: node theme-parser.js <path-to-theme-file-or-vsix> [output-file]
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const AdmZip = require("adm-zip");

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error(
    "Error: Please provide a path to a VS Code theme file or .vsix file.",
  );
  console.error(
    "Usage: node theme-parser.js <path-to-theme-file-or-vsix> [output-file]",
  );
  process.exit(1);
}

// Get the file path from command line arguments
const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3] || null;

/**
 * Determine if the input file is a .vsix file
 */
function isVsixFile(filePath) {
  return path.extname(filePath).toLowerCase() === ".vsix";
}

/**
 * Create a temporary directory for extracting .vsix contents
 */
function createTempDir() {
  const tempDir = path.join(os.tmpdir(), `vscode-theme-parser-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Extract the contents of a .vsix file to a temporary directory
 */
function extractVsixContents(vsixPath) {
  try {
    const tempDir = createTempDir();
    console.log(`Extracting .vsix file to: ${tempDir}`);

    const zip = new AdmZip(vsixPath);
    zip.extractAllTo(tempDir, true);

    return tempDir;
  } catch (error) {
    console.error(`Error extracting .vsix file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Find theme files in the extracted .vsix contents
 */
function findThemeFiles(extractedDir) {
  const themeFiles = [];

  // Common locations for theme files in a .vsix
  const themeDirs = [
    path.join(extractedDir, "extension", "themes"),
    path.join(extractedDir, "themes"),
  ];

  for (const themeDir of themeDirs) {
    if (fs.existsSync(themeDir)) {
      const files = fs.readdirSync(themeDir);
      for (const file of files) {
        if (path.extname(file).toLowerCase() === ".json") {
          themeFiles.push(path.join(themeDir, file));
        }
      }
    }
  }

  return themeFiles;
}

/**
 * Summarize the contents of a .vsix file
 */
function summarizeVsixContents(extractedDir) {
  let summary = "## VSIX Package Contents\n\n";

  // Check for package.json
  const packageJsonPath = path.join(extractedDir, "extension", "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      summary += "### Extension Information\n\n";
      summary += `- **Name:** ${packageJson.name || "Not specified"}\n`;
      summary += `- **Display Name:** ${packageJson.displayName || "Not specified"}\n`;
      summary += `- **Description:** ${packageJson.description || "Not specified"}\n`;
      summary += `- **Version:** ${packageJson.version || "Not specified"}\n`;
      summary += `- **Publisher:** ${packageJson.publisher || "Not specified"}\n`;
      summary += `- **Categories:** ${(packageJson.categories || []).join(", ") || "None"}\n`;
      summary += `- **Tags:** ${(packageJson.keywords || []).join(", ") || "None"}\n\n`;

      // List contributions
      if (packageJson.contributes) {
        summary += "### Contributions\n\n";

        if (
          packageJson.contributes.themes &&
          packageJson.contributes.themes.length > 0
        ) {
          summary += "#### Themes\n\n";
          summary += "| Label | UI Theme | Path |\n";
          summary += "|-------|----------|------|\n";

          for (const theme of packageJson.contributes.themes) {
            summary += `| ${theme.label || "Unnamed"} | ${theme.uiTheme || "Unknown"} | ${theme.path || "Not specified"} |\n`;
          }

          summary += "\n";
        }

        if (
          packageJson.contributes.grammars &&
          packageJson.contributes.grammars.length > 0
        ) {
          summary += "#### Grammars\n\n";
          summary += "| Language | Scope Name | Path |\n";
          summary += "|----------|------------|------|\n";

          for (const grammar of packageJson.contributes.grammars) {
            summary += `| ${grammar.language || "Unknown"} | ${grammar.scopeName || "Not specified"} | ${grammar.path || "Not specified"} |\n`;
          }

          summary += "\n";
        }
      }
    } catch (error) {
      summary += `Error parsing package.json: ${error.message}\n\n`;
    }
  }

  // List files in the extension directory
  const extensionDir = path.join(extractedDir, "extension");
  if (fs.existsSync(extensionDir)) {
    summary += "### Files and Directories\n\n";

    function listFilesRecursive(dir, prefix = "") {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        const relativePath = path.relative(extractedDir, entryPath);

        if (entry.isDirectory()) {
          summary += `${prefix}- 📁 ${entry.name}/\n`;
          listFilesRecursive(entryPath, `${prefix}  `);
        } else {
          summary += `${prefix}- 📄 ${entry.name}\n`;
        }
      }
    }

    listFilesRecursive(extensionDir);
  }

  return summary;
}

/**
 * Clean up the temporary directory
 */
function cleanupTempDir(tempDir) {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`Cleaned up temporary directory: ${tempDir}`);
  } catch (error) {
    console.error(
      `Warning: Failed to clean up temporary directory: ${error.message}`,
    );
  }
}

/**
 * Read and parse a theme file
 */
function readThemeFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing the theme file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Extract color information from the theme
 */
function extractColorInfo(theme) {
  const colorInfo = {
    name: theme.name || "Unnamed Theme",
    type: theme.type || "Unknown",
    colors: theme.colors || {},
    tokenColors: theme.tokenColors || [],
  };

  return colorInfo;
}

/**
 * Generate a color swatch for Markdown
 */
function generateColorSwatch(color) {
  // For simplicity, just return the color code
  // In a more advanced version, this could generate an actual color swatch image
  return color;
}

/**
 * Generate Markdown content from the extracted color information
 */
function generateMarkdown(colorInfo) {
  let markdown = `# ${colorInfo.name} Summary\n\n`;

  // Add theme type
  markdown += `**Type:** ${colorInfo.type}\n\n`;

  // Add UI colors section
  markdown += `## UI Colors\n\n`;

  if (Object.keys(colorInfo.colors).length > 0) {
    markdown += `| UI Element | Color | Swatch |\n`;
    markdown += `|------------|-------|--------|\n`;

    for (const [element, color] of Object.entries(colorInfo.colors)) {
      markdown += `| \`${element}\` | \`${color}\` | ${generateColorSwatch(color)} |\n`;
    }
  } else {
    markdown += `No UI colors defined in this theme.\n`;
  }

  // Add syntax highlighting colors section
  markdown += `\n## Syntax Highlighting\n\n`;

  if (colorInfo.tokenColors.length > 0) {
    markdown += `| Scope | Foreground | Background | Font Style |\n`;
    markdown += `|-------|------------|------------|------------|\n`;

    for (const token of colorInfo.tokenColors) {
      const scope = Array.isArray(token.scope)
        ? token.scope.join(", ")
        : token.scope || "default";
      const settings = token.settings || {};
      const foreground = settings.foreground || "default";
      const background = settings.background || "default";
      const fontStyle = settings.fontStyle || "default";

      markdown += `| \`${scope}\` | \`${foreground}\` | \`${background}\` | \`${fontStyle}\` |\n`;
    }
  } else {
    markdown += `No syntax highlighting colors defined in this theme.\n`;
  }

  // Add a section for common color usage
  markdown += `\n## Common Color Usage\n\n`;

  // Extract unique colors from UI elements
  const uniqueColors = new Set();
  for (const color of Object.values(colorInfo.colors)) {
    uniqueColors.add(color);
  }

  // Add colors from token colors
  for (const token of colorInfo.tokenColors) {
    const settings = token.settings || {};
    if (settings.foreground) uniqueColors.add(settings.foreground);
    if (settings.background) uniqueColors.add(settings.background);
  }

  if (uniqueColors.size > 0) {
    markdown += `| Color | Swatch |\n`;
    markdown += `|-------|--------|\n`;

    for (const color of uniqueColors) {
      markdown += `| \`${color}\` | ${generateColorSwatch(color)} |\n`;
    }
  } else {
    markdown += `No colors found in this theme.\n`;
  }

  return markdown;
}

/**
 * Process a .vsix file
 */
async function processVsixFile(vsixPath) {
  const extractedDir = extractVsixContents(vsixPath);
  const themeFiles = findThemeFiles(extractedDir);

  if (themeFiles.length === 0) {
    console.error("No theme files found in the .vsix package.");
    cleanupTempDir(extractedDir);
    process.exit(1);
  }

  console.log(`Found ${themeFiles.length} theme file(s) in the .vsix package.`);

  let markdown = `# VS Code Extension Theme Summary\n\n`;
  markdown += `Source: \`${path.basename(vsixPath)}\`\n\n`;

  // Process each theme file
  for (let i = 0; i < themeFiles.length; i++) {
    const themeFile = themeFiles[i];
    console.log(
      `Parsing theme file (${i + 1}/${themeFiles.length}): ${themeFile}`,
    );

    const theme = readThemeFile(themeFile);
    const colorInfo = extractColorInfo(theme);
    const themeMarkdown = generateMarkdown(colorInfo);

    // Add a separator between themes if there are multiple
    if (i > 0) {
      markdown += `\n---\n\n`;
    }

    markdown += themeMarkdown;
  }

  // Add VSIX package summary
  markdown += `\n---\n\n`;
  markdown += summarizeVsixContents(extractedDir);

  // Clean up
  cleanupTempDir(extractedDir);

  return markdown;
}

/**
 * Process a regular theme file
 */
function processThemeFile(themeFilePath) {
  console.log(`Parsing theme file: ${themeFilePath}`);
  const theme = readThemeFile(themeFilePath);
  const colorInfo = extractColorInfo(theme);
  return generateMarkdown(colorInfo);
}

/**
 * Save Markdown content to a file or print to console
 */
function saveOrPrintMarkdown(markdown, outputPath) {
  if (outputPath) {
    try {
      fs.writeFileSync(outputPath, markdown, "utf8");
      console.log(`Markdown summary saved to: ${outputPath}`);
    } catch (error) {
      console.error(`Error saving Markdown file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Print to console
    console.log(markdown);
  }
}

// Main execution
(async function main() {
  try {
    let markdown;

    if (isVsixFile(inputFilePath)) {
      console.log(`Processing .vsix file: ${inputFilePath}`);
      markdown = await processVsixFile(inputFilePath);
    } else {
      markdown = processThemeFile(inputFilePath);
    }

    saveOrPrintMarkdown(markdown, outputFilePath);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
    process.exit(1);
  }
})();
