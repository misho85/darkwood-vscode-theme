const path = require('path');
const { runTests, downloadAndUnzipVSCode } = require('@vscode/test-electron');

async function main() {
  try {
    // Path to the extension root
    const extensionDevelopmentPath = path.resolve(__dirname, '../');

    // Path to the test runner
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js');

    // Path to test workspace (samples folder)
    const testWorkspace = path.resolve(__dirname, './samples');

    console.log('Starting DarkWood theme visual tests...');
    console.log('Extension path:', extensionDevelopmentPath);
    console.log('Test workspace:', testWorkspace);

    // Use stable version that works with test-electron
    const vscodeDir = await downloadAndUnzipVSCode('1.85.0');
    // Fix the executable path for macOS - use the code script, not Electron
    // vscodeDir returns: .../Visual Studio Code.app/Contents/MacOS/Electron
    // We need: .../Visual Studio Code.app/Contents/Resources/app/bin/code
    const vscodeExecutablePath = process.platform === 'darwin'
      ? vscodeDir.replace('/Contents/MacOS/Electron', '/Contents/Resources/app/bin/code')
      : vscodeDir;
    console.log('VS Code path:', vscodeExecutablePath);

    // Download VS Code, unzip it and run the integration test
    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions', // Disable other extensions
        '--disable-gpu', // For consistent screenshots
      ],
    });

    console.log('Tests completed successfully!');
  } catch (err) {
    console.error('Failed to run tests:', err);
    process.exit(1);
  }
}

main();
