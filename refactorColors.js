const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project({
  tsConfigFilePath: 'c:\\\\Users\\\\Baba Traore\\\\Documents\\\\ongapp\\\\cacao-mobile\\\\tsconfig.json',
});

const sourceFiles = project.getSourceFiles(['app/**/*.tsx', 'src/components/**/*.tsx', 'src/components/**/*.ts']);

const HARDCODED_FILES_TO_EXCLUDE = [
  'TreeDiagnosticTable.tsx',
  'RigidTable.tsx',
  'ProducteurForm.tsx',
  'printPdc.ts'
];

const colorReplacements = {
  '#000': 'colors.text',
  '#000000': 'colors.text',
  'black': 'colors.text',
  '#fff': 'colors.background',
  '#ffffff': 'colors.background',
  'white': 'colors.background',
  '#1a1a1a': 'colors.surface',
  '#161616': 'colors.surface',
  '#2a2a2a': 'colors.border'
};

for (const sf of sourceFiles) {
  const filePath = sf.getFilePath();
  const fileName = sf.getBaseName();
  let modified = false;

  // 1. Replace hardcoded string colors (unless excluded)
  if (!HARDCODED_FILES_TO_EXCLUDE.includes(fileName)) {
    const stringLiterals = sf.getDescendantsOfKind(SyntaxKind.StringLiteral).reverse();
    for (const str of stringLiterals) {
      if (str.wasForgotten()) continue;
      const val = str.getLiteralValue().toLowerCase();
      if (colorReplacements[val]) {
        const parent = str.getParent();
        if (parent && parent.getKind() === SyntaxKind.PropertyAssignment) {
          const propName = parent.getName();
          if (['color', 'backgroundColor', 'borderColor', 'borderBottomColor', 'borderTopColor', 'borderRightColor', 'borderLeftColor', 'shadowColor', 'tintColor'].includes(propName)) {
            str.replaceWithText(colorReplacements[val]);
            modified = true;
          }
        }
      }
    }
  }

  // 2. Refactor to useTheme()
  let hasColorsImport = false;
  let themeImportPath = '../../src/hooks/useTheme';

  const imports = sf.getImportDeclarations();
  for (const imp of imports) {
    const moduleSpecifier = imp.getModuleSpecifierValue();
    if (moduleSpecifier.includes('src/theme')) {
      const namedImports = imp.getNamedImports();
      const colorsImport = namedImports.find(n => n.getName() === 'colors');
      if (colorsImport) {
        hasColorsImport = true;
        const rel = path.relative(path.dirname(filePath), path.join('c:\\\\Users\\\\Baba Traore\\\\Documents\\\\ongapp\\\\cacao-mobile', 'src', 'hooks', 'useTheme'));
        themeImportPath = rel.replace(/\\\\/g, '/');
        if (!themeImportPath.startsWith('.')) {
          themeImportPath = './' + themeImportPath;
        }
        
        colorsImport.remove();
        modified = true;
        if (imp.getNamedImports().length === 0) {
          imp.remove();
        }
      }
    }
  }

  if (hasColorsImport) {
    // Add import { useTheme } from ...
    sf.addImportDeclaration({
      moduleSpecifier: themeImportPath,
      namedImports: ['useTheme']
    });
    modified = true;

    // Find StyleSheet.create
    const callExpressions = sf.getDescendantsOfKind(SyntaxKind.CallExpression).reverse();
    let styleSheetCreated = false;
    for (const callExpr of callExpressions) {
      if (callExpr.wasForgotten()) continue;
      if (callExpr.getExpression().getText() === 'StyleSheet.create') {
        const parentDecl = callExpr.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
        if (parentDecl && parentDecl.getName() === 'styles') {
          parentDecl.rename('getStyles');
          callExpr.replaceWithText(`(colors: any) => ${callExpr.getText()}`);
          styleSheetCreated = true;
          modified = true;
        }
      }
    }

    // Find React component functions to inject hooks
    const functions = sf.getFunctions();
    const arrowFunctions = sf.getDescendantsOfKind(SyntaxKind.ArrowFunction);
    const allFuncs = [...functions, ...arrowFunctions];
    
    for (const func of allFuncs) {
      if (func.wasForgotten()) continue;
      
      const isReact = func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
      
      let name = '';
      if (func.getKind() === SyntaxKind.FunctionDeclaration) {
        name = func.getName() || '';
      } else {
        const varDecl = func.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
        if (varDecl) name = varDecl.getName();
      }

      if (isReact && name && /^[A-Z]/.test(name)) {
        const body = func.getBody();
        if (body && body.getKind() === SyntaxKind.Block) {
          let injectStr = `\n  const { colors, isDark } = useTheme();\n`;
          if (styleSheetCreated) {
            injectStr += `  const styles = React.useMemo(() => getStyles(colors), [colors]);\n`;
            
            const reactImport = sf.getImportDeclaration('react');
            if (!reactImport) {
                sf.addImportDeclaration({
                    moduleSpecifier: 'react',
                    defaultImport: 'React'
                });
            }
          }
          
          body.insertStatements(0, injectStr);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    sf.saveSync();
    console.log('Modified', fileName);
  }
}

console.log('Refactoring complete!');
