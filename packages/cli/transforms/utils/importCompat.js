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
      compatImport.value.specifiers.push(
        j.importSpecifier(
          j.identifier(specifier)
        )
      )
    })

    if (action === 'replaceWith') {
      j(reactRouterDomPath).remove();
    }
  } else {
    const compatImportDeclaration = j.importDeclaration(
      specifiers.map(specifier => j.importSpecifier(
        j.identifier(specifier)
      )),
      j.literal('react-router-dom-5-to-6-compat')
    );

    if (action === 'replaceWith') {
      j(reactRouterDomPath).replaceWith(compatImportDeclaration);
    } else {
      j(reactRouterDomPath).insertAfter(compatImportDeclaration);
    }
  }
}