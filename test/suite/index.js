const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

// Screenshot utility
async function takeScreenshot(filename) {
  const screenshotDir = path.resolve(__dirname, '../screenshots');

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const filepath = path.join(screenshotDir, filename);

  try {
    // Use screenshot-desktop for cross-platform screenshots
    const screenshot = require('screenshot-desktop');
    const img = await screenshot({ format: 'png' });
    fs.writeFileSync(filepath, img);
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`Failed to take screenshot: ${error.message}`);
    // Fallback: try macOS screencapture
    if (process.platform === 'darwin') {
      const { execSync } = require('child_process');
      try {
        execSync(`screencapture -x ${filepath}`);
        console.log(`Screenshot saved (fallback): ${filepath}`);
        return filepath;
      } catch (e) {
        console.error('Fallback screenshot also failed:', e.message);
      }
    }
    return null;
  }
}

// Wait for editor to be ready
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Open a file and wait for it to render
async function openFileAndWait(filePath) {
  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);
  await sleep(1000); // Wait for syntax highlighting to apply
  return doc;
}

async function run() {
  const samplesDir = path.resolve(__dirname, '../samples');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  console.log('\n========================================');
  console.log('DarkWood Theme Visual Test Suite');
  console.log('========================================\n');

  // Apply the DarkWood theme
  console.log('Applying DarkWood theme...');
  await vscode.workspace
    .getConfiguration()
    .update('workbench.colorTheme', 'DarkWood', vscode.ConfigurationTarget.Global);

  await sleep(1500); // Wait for theme to apply

  // Sample files to test
  const sampleFiles = [
    { file: 'sample.js', name: 'JavaScript' },
    { file: 'sample.py', name: 'Python' },
    { file: 'sample.rs', name: 'Rust' },
    { file: 'sample.json', name: 'JSON' },
    { file: 'sample.html', name: 'HTML' },
    { file: 'sample.css', name: 'CSS' },
  ];

  const results = [];

  for (const { file, name } of sampleFiles) {
    const filePath = path.join(samplesDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠ Skipping ${name}: file not found`);
      continue;
    }

    console.log(`\nTesting ${name}...`);

    try {
      // Open the file
      await openFileAndWait(filePath);

      // Take screenshot
      const screenshotName = `${timestamp}_${file.replace('.', '_')}.png`;
      const screenshotPath = await takeScreenshot(screenshotName);

      if (screenshotPath) {
        results.push({ language: name, file, screenshot: screenshotPath, status: 'success' });
        console.log(`✓ ${name}: Screenshot captured`);
      } else {
        results.push({ language: name, file, screenshot: null, status: 'failed' });
        console.log(`✗ ${name}: Screenshot failed`);
      }
    } catch (error) {
      results.push({ language: name, file, screenshot: null, status: 'error', error: error.message });
      console.log(`✗ ${name}: Error - ${error.message}`);
    }
  }

  // Generate summary report
  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================');

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status !== 'success').length;

  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  // Save results to JSON
  const resultsPath = path.resolve(__dirname, '../screenshots', `${timestamp}_results.json`);
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);

  console.log('\nScreenshots saved to: test/screenshots/');
  console.log('========================================\n');
}

// Export for @vscode/test-electron
function activate() {
  return run();
}

module.exports = { run, activate };
