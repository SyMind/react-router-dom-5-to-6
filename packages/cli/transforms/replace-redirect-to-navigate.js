const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const redirectImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'Redirect'
  );
  if (!redirectImport) {
    return root.toSource(options);
  }

  const redirectImportLocalName = redirectImport.local.name;
  redirectImport.imported.name = 'Navigate';
  redirectImport.local = null;

  root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: redirectImportLocalName },
      },
    })
    .forEach((path) => {
      const openEl = path.value.openingElement;
      openEl.name.name = 'Navigate';
      const isPush = openEl.attributes.filter((a) => a.name.name === 'push').length > 0;
      if (!isPush) {
        openEl.attributes.push(j.jsxAttribute(j.jsxIdentifier('replace')));
      } else {
        openEl.attributes = openEl.attributes.filter((a) => a.name.name !== 'push');
      }
    });

  return root.toSource(options);
};
