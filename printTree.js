const fs = require('fs');
const path = require('path');

function printTree(dir, level = 0) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative('./', filePath);
    const stats = fs.statSync(filePath);

    console.log(`${' '.repeat(level * 2)}${file}`);

    if (stats.isDirectory()) {
      // Only recurse into the specified directories
      if (
        [
          'src',
          'src/pages',
          'src/components',
          'src/styles',
          'src/pages/api',
        ].includes(relativePath)
      ) {
        printTree(filePath, level + 1);
      }
    }
  });
}

printTree('./');
