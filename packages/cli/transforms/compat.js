const COMPAT_APIS = [
  'withRouter',
  'useHistory'
]

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
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const specifiers = [];
  const compatSpecifiers = [];
  for (const specifier of reactRouterDomPath.value.specifiers) {
    if (specifier.type !== 'ImportSpecifier' || !COMPAT_APIS.includes(specifier.imported.name)) {
      specifiers.push(specifier)
    } else {
      compatSpecifiers.push(
        j.importSpecifier(
          j.identifier(specifier.imported.name)
        )
      )
    }
  }

  if (compatSpecifiers.length === 0) {
    return root.toSource(options);
  }

  if (specifiers.length > 0) {
    reactRouterDomPath.value.specifiers = specifiers;
  } else {
    j(reactRouterDomPath).remove();
  }

  const compatImportDeclaration = j.importDeclaration(
    compatSpecifiers,
    j.literal('react-router-dom-5-to-6-compat')
  );
  j(reactRouterDomPath).insertAfter(compatImportDeclaration);

  return root.toSource(options);
};
