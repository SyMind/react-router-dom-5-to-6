const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const switchImportIndex = reactRouterDomPath.value.specifiers.findIndex(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'Switch'
  );

  if (switchImportIndex === -1) {
    return root.toSource(options);
  }

  const switchLocalName = reactRouterDomPath.value.specifiers[switchImportIndex].local.name;

  reactRouterDomPath.value.specifiers[switchImportIndex] = j.importSpecifier(
    j.identifier('Routes')
  )

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: switchLocalName } },
    })
    .forEach((path) => {
      path.value.openingElement.name.name = 'Routes';
      if (path.value.closingElement) {
        path.value.closingElement.name.name = 'Routes';
      }
    });

  return root.toSource(options);
};
