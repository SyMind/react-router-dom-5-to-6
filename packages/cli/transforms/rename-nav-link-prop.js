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

  const navLinkImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'NavLink'
  );
  const navLinkLocalName = navLinkImport.local.name;

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: navLinkLocalName } },
    })
    .forEach((path) => {
      const [exactProp] = path.value.openingElement.attributes.filter(
        (a) => a.name.name === 'exact'
      );
      if (exactProp) {
        exactProp.name.name = 'end';
      }
    });

  return root.toSource();
};
