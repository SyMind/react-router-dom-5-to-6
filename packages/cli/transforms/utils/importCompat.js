module.exports = function importCompat(j, root, specifiers, action, reactRouterDomPath) {
  const compatImportPaths = root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration'
    })
    .filter(path => (
      (
        path.value.source.type === 'Literal' ||
        path.value.source.type === 'StringLiteral'
      ) && path.value.source.value === 'react-router-dom-5-to-6-compat'
    ));
  
  const compatImport = compatImportPaths.paths()[0];
  
  if (compatImport) {
    specifiers.forEach(specifier => {
      if (!compatImport.value.specifiers.some(s => s.imported.name === specifier.imported.name)) {
        compatImport.value.specifiers.push(specifier)
      }
    })

    if (action === 'replaceWith') {
      j(reactRouterDomPath).remove();
    }
  } else {
    const compatImportDeclaration = j.importDeclaration(
      specifiers,
      j.literal('react-router-dom-5-to-6-compat')
    );

    if (action === 'replaceWith') {
      j(reactRouterDomPath).replaceWith(compatImportDeclaration);
    } else {
      j(reactRouterDomPath).insertAfter(compatImportDeclaration);
    }
  }
}
