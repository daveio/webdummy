#!/usr/bin/env node

/**
 * VS Code Theme Parser
 *
 * This script parses a Visual Studio Code theme file (JSON) and generates
 * a Markdown summary of the colors and settings used in the theme.
 *
 * Usage: node theme-parser.js <path-to-theme-file> [output-file]
 */

const fs = require("fs");
const path = require("path");

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error("Error: Please provide a path to a VS Code theme file.");
  console.error(
    "Usage: node theme-parser.js <path-to-theme-file> [output-file]",
  );
  process.exit(1);
}

// Get the file path from command line arguments
const themeFilePath = process.argv[2];
const outputFilePath = process.argv[3] || null;

/**
 * Read and parse the theme file
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
  let markdown = `# ${colorInfo.name} Theme Summary\n\n`;

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
try {
  console.log(`Parsing theme file: ${themeFilePath}`);
  const theme = readThemeFile(themeFilePath);
  const colorInfo = extractColorInfo(theme);
  const markdown = generateMarkdown(colorInfo);
  saveOrPrintMarkdown(markdown, outputFilePath);
} catch (error) {
  console.error(`An unexpected error occurred: ${error.message}`);
  process.exit(1);
}
