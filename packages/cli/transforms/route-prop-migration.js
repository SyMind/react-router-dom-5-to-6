const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const routeImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'Route'
  );
  if (!routeImport) {
    return root.toSource(options);
  }

  const routeImportLocalName = routeImport.local.name;

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: routeImportLocalName } },
    })
    .forEach((path) => {
      const exactPropIndex = path.value.openingElement.attributes.findIndex(
        a => a.name.name === 'exact'
      );
      if (exactPropIndex === -1) {
        const pathProp = path.value.openingElement.attributes.find(
          a => a.name.name === 'path'
        );
        if (pathProp) {
          if (pathProp.value.type === 'Literal') {
            pathProp.value.value = pathProp.value.value + '/*';
          }
        }
      } else {
        // remove exact prop
        path.value.openingElement.attributes.splice(exactPropIndex, 1);
      }
    });

  return root.toSource(options);
};
