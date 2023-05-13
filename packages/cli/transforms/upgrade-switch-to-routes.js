module.exports = function (file, api) {
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

  const switchImportIndex = reactRouterDomPath.value.specifiers.findIndex(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'Switch'
  );

  if (switchImportIndex === -1) {
    return
  }

  reactRouterDomPath.value.specifiers[switchImportIndex] = j.importSpecifier(
    j.identifier('Routes')
  )

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: 'Switch' } },
    })
    .forEach((path) => {
      path.value.openingElement.name.name = 'Routes';
    });

  root
    .find(j.JSXElement, {
      closingElement: { name: { name: 'Switch' } },
    })
    .forEach((path) => {
      path.value.closingElement.name.name = 'Routes';
    });

  return root.toSource({ quote: 'single' });
};
