# VS Code Theme Parser

A command-line tool that parses Visual Studio Code theme files (JSON) and generates a Markdown summary of the colors and settings used in the theme.

## Features

- Extracts UI colors from VS Code theme files
- Extracts syntax highlighting colors and settings
- Generates a comprehensive Markdown summary
- Identifies common colors used throughout the theme
- Supports output to file or console

## Installation

1. Clone this repository or download the files
2. Ensure you have Node.js installed (version 12 or higher recommended)
3. Make the script executable (optional):
   ```bash
   chmod +x theme-parser.js
   ```

## Usage

```bash
node theme-parser.js <path-to-theme-file> [output-file]
```

### Arguments

- `<path-to-theme-file>`: Path to the VS Code theme file (required)
- `[output-file]`: Path where the Markdown output should be saved (optional)
  - If not provided, the output will be printed to the console

### Examples

```bash
# Parse a theme file and print the summary to the console
node theme-parser.js ./themes/monokai.json

# Parse a theme file and save the summary to a Markdown file
node theme-parser.js ./themes/monokai.json ./monokai-summary.md
```

## VS Code Theme Files

VS Code theme files are JSON files that define the colors and styles used in the Visual Studio Code editor. They typically include:

- UI colors for various editor elements
- Syntax highlighting colors for different code elements
- Font styles for syntax highlighting

Theme files can be found in:

- VS Code extensions that provide themes
- The VS Code user settings directory
- Online repositories of VS Code themes

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

## License

MIT
