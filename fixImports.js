const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

function fixImports() {
  ['app', 'src'].forEach(dir => {
    walkDir(dir, (f) => {
      let content = fs.readFileSync(f, 'utf8');
      let newContent = content;
      
      if (content.match(/import \{ useTheme \} from/)) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('import { useTheme } from')) {
            lines[i] = lines[i].replace(/\\\\/g, '/');
          }
        }
        newContent = lines.join('\n');
        
        if (newContent !== content) {
          fs.writeFileSync(f, newContent);
          console.log('Fixed:', f);
        }
      }
    });
  });
}

fixImports();
