# VS Code Theme Parser

A command-line tool that parses Visual Studio Code theme files (JSON) and generates a Markdown summary of the colors and settings used in the theme. It can also extract and analyze themes from `.vsix` extension files.

## Features

- Extracts UI colors from VS Code theme files
- Extracts syntax highlighting colors and settings
- Generates a comprehensive Markdown summary
- Identifies common colors used throughout the theme
- Supports output to file or console
- Extracts and analyzes themes from `.vsix` extension files
- Summarizes other contents of `.vsix` files (extension info, contributions, file structure)

## Installation

1. Clone this repository or download the files
2. Ensure you have Node.js installed (version 12 or higher recommended)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make the script executable (optional):
   ```bash
   chmod +x theme-parser.js
   ```

## Usage

```bash
node theme-parser.js <path-to-theme-file-or-vsix> [output-file]
```

### Arguments

- `<path-to-theme-file-or-vsix>`: Path to the VS Code theme file (JSON) or `.vsix` extension file (required)
- `[output-file]`: Path where the Markdown output should be saved (optional)
  - If not provided, the output will be printed to the console

### Examples

```bash
# Parse a theme file and print the summary to the console
node theme-parser.js ./themes/monokai.json

# Parse a theme file and save the summary to a Markdown file
node theme-parser.js ./themes/monokai.json ./monokai-summary.md

# Parse a .vsix file and print the summary to the console
node theme-parser.js ./monokai-pro.vsix

# Parse a .vsix file and save the summary to a Markdown file
node theme-parser.js ./monokai-pro.vsix ./monokai-pro-summary.md
```

## Input File Types

### VS Code Theme Files

VS Code theme files are JSON files that define the colors and styles used in the Visual Studio Code editor. They typically include:

- UI colors for various editor elements
- Syntax highlighting colors for different code elements
- Font styles for syntax highlighting

Theme files can be found in:

- VS Code extensions that provide themes
- The VS Code user settings directory
- Online repositories of VS Code themes

### VS Code Extension Files (.vsix)

VS Code extension files (`.vsix`) are packages that contain extensions for Visual Studio Code. They are essentially ZIP files with a specific structure. When parsing a `.vsix` file, this tool:

1. Extracts the contents of the `.vsix` file to a temporary directory
2. Locates theme files within the extracted contents
3. Parses each theme file found
4. Generates a Markdown summary for each theme
5. Adds a summary of the `.vsix` package contents, including:
   - Extension information (name, description, version, publisher, etc.)
   - Contributions (themes, grammars, etc.)
   - File structure
6. Cleans up the temporary directory when done

### Example Theme File Structure

```json
{
  "name": "Example Theme",
  "type": "dark",
  "colors": {
    "editor.background": "#1E1E1E",
    "editor.foreground": "#D4D4D4",
    "activityBar.background": "#333333"
  },
  "tokenColors": [
    {
      "scope": ["comment", "comment.block"],
      "settings": {
        "foreground": "#6A9955",
        "fontStyle": "italic"
      }
    },
    {
      "scope": "string",
      "settings": {
        "foreground": "#CE9178"
      }
    }
  ]
}
```

## Sample Output

### For Theme Files

The generated Markdown will look something like this:

```markdown
# Example Theme Summary

**Type:** dark

## UI Colors

| UI Element               | Color     | Swatch  |
| ------------------------ | --------- | ------- |
| `editor.background`      | `#1E1E1E` | #1E1E1E |
| `editor.foreground`      | `#D4D4D4` | #D4D4D4 |
| `activityBar.background` | `#333333` | #333333 |

## Syntax Highlighting

| Scope                    | Foreground | Background | Font Style |
| ------------------------ | ---------- | ---------- | ---------- |
| `comment, comment.block` | `#6A9955`  | `default`  | `italic`   |
| `string`                 | `#CE9178`  | `default`  | `default`  |

## Common Color Usage

| Color     | Swatch  |
| --------- | ------- |
| `#1E1E1E` | #1E1E1E |
| `#D4D4D4` | #D4D4D4 |
| `#333333` | #333333 |
| `#6A9955` | #6A9955 |
| `#CE9178` | #CE9178 |
```

### For .vsix Files

For `.vsix` files, the output will include additional information about the extension:

```markdown
# VS Code Extension Theme Summary

Source: `monokai-pro.vsix`

# Monokai Pro Summary

**Type:** dark

## UI Colors

...

## Syntax Highlighting

...

## Common Color Usage

...

---

## VSIX Package Contents

### Extension Information

- **Name:** monokai-pro
- **Display Name:** Monokai Pro
- **Description:** Professional theme with beautiful colors
- **Version:** 1.2.0
- **Publisher:** monokai
- **Categories:** Themes
- **Tags:** theme, color-theme, dark-theme

### Contributions

#### Themes

| Label       | UI Theme | Path                      |
| ----------- | -------- | ------------------------- |
| Monokai Pro | vs-dark  | ./themes/monokai-pro.json |

### Files and Directories

- 📁 extension/
  - 📄 package.json
  - 📄 LICENSE.md
  - 📄 README.md
  - 📁 themes/
    - 📄 monokai-pro.json
```

## License

MIT
