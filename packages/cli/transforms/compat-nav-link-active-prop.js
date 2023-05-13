const getReactRouterDomImport = require('./utils/getReactRouterDomImport');
const importCompat = require('./utils/importCompat');

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

  let needImportNavLink = false;
  let needImportCompatNavLink = false;

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: navLinkLocalName } },
    })
    .forEach(path => {
      const usedActiveProp = path.value.openingElement.attributes.some(a => ['activeClassName', 'activeStyle'].includes(a.name.name))
      if (usedActiveProp) {
        path.value.openingElement.name.name = 'NavLink';
        if (path.value.closingElement) {
          path.value.closingElement.name.name = 'NavLink';
        }
  
        needImportCompatNavLink = true;
      } else {
        needImportNavLink = true;
      }
    })

  let removedReactRouterDomPath = false;
  if (!needImportNavLink) {
    if (reactRouterDomPath.value.specifiers.length === 1) {
      removedReactRouterDomPath = true
    } else {
      reactRouterDomPath.value.specifiers = reactRouterDomPath.value.specifiers.filter(specifier => specifier.imported.name === 'NavLink')
    }
  }

  if (removedReactRouterDomPath) {
    importCompat(j, root, ['NavLink'], 'replaceWith', reactRouterDomPath)
  } else {
    importCompat(j, root, ['NavLink'], 'insertAfter', reactRouterDomPath)
  }

  return root.toSource(options);
};
