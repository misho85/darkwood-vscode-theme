# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DarkWood is a VS Code color theme extension. It's a dark theme with warm, earthy tones.

## Development

### Testing the Theme

Press `F5` in VS Code to launch the Extension Development Host with the theme loaded. Changes to the theme file are automatically applied to the host window.

### Inspecting Token Scopes

Use `Inspect TM Scopes` from the Command Palette (`Cmd+Shift+P`) to examine how TextMate scopes are being applied to tokens.

### Installing Locally

Copy the extension folder to `~/.vscode/extensions` and restart VS Code.

## Architecture

- `package.json` - Extension manifest defining the theme location and base theme (`vs-dark`)
- `themes/darkwood-color-theme.json` - Complete theme definition containing:
  - `colors` - Workbench/UI colors (editor, sidebar, activity bar, terminal, etc.)
  - `tokenColors` - Syntax highlighting rules using TextMate scopes

## Color Palette

Key colors used throughout the theme:

- Background: `#222222` (editor), `#191919` (sidebar), `#131313` (activity bar)
- Foreground: `#f7f1ff` (primary text)
- Accent: `#fce566` (yellow - active elements)
- Pink: `#fc618d` (keywords, tags)
- Green: `#7bd88f` (functions, strings in some contexts)
- Cyan: `#5ad4e6` (types, classes)
- Purple: `#948ae3` (constants, numbers)
- Orange: `#fd9353` (parameters, symbols)
