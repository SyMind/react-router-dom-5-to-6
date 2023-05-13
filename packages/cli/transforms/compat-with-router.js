module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

   // Get all paths that import from react-router-dom
   const reactRouterDomImportPaths = root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration'
    })
    .filter(path => (
      (
        path.value.source.type === 'Literal' ||
        path.value.source.type === 'StringLiteral'
      ) && path.value.source.value === 'react-router-dom'
    ));

  const reactRouterDomPath = reactRouterDomImportPaths.paths()[0];

  const filteredSpecifiers = reactRouterDomPath.value.specifiers.filter(
    specifier =>
      specifier.type !== 'ImportSpecifier' ||
      specifier.imported.name !== 'withRouter'
  );

  if (filteredSpecifiers.length === reactRouterDomPath.value.specifiers) {
    return
  }

  if (filteredSpecifiers.length > 0) {
    reactRouterDomPath.value.specifiers = filteredSpecifiers;
  } else {
    j(reactRouterDomPath).remove();
  }

  const compatImportDeclaration = j.importDeclaration(
    [
      j.importSpecifier(
        j.identifier('withRouter')
      )
    ],
    j.literal('react-router-dom-5-to-6-compat')
  );
  j(reactRouterDomPath).insertAfter(compatImportDeclaration);

  return root.toSource(options);
};
