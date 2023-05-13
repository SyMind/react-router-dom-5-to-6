const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
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
