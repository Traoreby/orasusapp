const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) walkDir(fp, callback);
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) callback(fp);
  });
}

walkDir('app', (f) => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  // Fix indentation of AST-injected hooks
  if (content.includes('      const { colors, isDark } = useTheme();')) {
    content = content.split('      const { colors, isDark } = useTheme();').join('  const { colors, isDark } = useTheme();');
    content = content.split('      const styles = React.useMemo(() => getStyles(colors), [colors]);').join('  const styles = React.useMemo(() => getStyles(colors), [colors]);');
    changed = true;
  }
  if (content.includes('      const { colors } = useTheme();')) {
    content = content.split('      const { colors } = useTheme();').join('  const { colors } = useTheme();');
    changed = true;
  }
  
  // Fix colors.background used for foreground text
  if (content.includes('color: colors.background,')) {
    content = content.split('color: colors.background,').join('color: colors.text,');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content);
    console.log('Fixed:', path.basename(f));
  }
});

// Also fix src/components (non-excluded)
walkDir('src/components', (f) => {
  const base = path.basename(f);
  // Skip excluded files
  if (['TreeDiagnosticTable.tsx', 'RigidTable.tsx', 'ProducteurForm.tsx', 'printPdc.ts'].includes(base)) return;
  
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('color: colors.background,')) {
    content = content.split('color: colors.background,').join('color: colors.text,');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content);
    console.log('Fixed:', base);
  }
});

console.log('Done.');
