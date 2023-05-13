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
  if (!navLinkImport) {
    return root.toSource(options);
  }
  const navLinkLocalName = navLinkImport.local.name;

  let needImportNavLink = false;
  let needImportCompatNavLink = false;

  let needCompatNavLinkJSXElements = [];

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: navLinkLocalName } },
    })
    .forEach(path => {
      const usedActiveProp = path.value.openingElement.attributes.some(a => ['activeClassName', 'activeStyle'].includes(a.name.name))
      if (usedActiveProp) {
        needCompatNavLinkJSXElements.push(path);
  
        needImportCompatNavLink = true;
      } else {
        needImportNavLink = true;
      }
    })

  if (!needImportCompatNavLink) {
    return root.toSource(options);
  }

  let removedReactRouterDomPath = false;
  if (!needImportNavLink) {
    if (reactRouterDomPath.value.specifiers.length === 1) {
      removedReactRouterDomPath = true;
    } else {
      reactRouterDomPath.value.specifiers = reactRouterDomPath.value.specifiers.filter(
        specifier => specifier.imported.name === 'NavLink'
      );
    }
  }

  const compatNavLinkSpecifier = j.importSpecifier(
    j.identifier('NavLink'),
    needImportNavLink ? j.identifier('CompatNavLink') : null
  );
  needCompatNavLinkJSXElements.forEach(path => {
    const compatNavLinkLocalName = needImportNavLink ? 'CompatNavLink' : 'NavLink';
    path.value.openingElement.name.name = compatNavLinkLocalName;
    if (path.value.closingElement) {
      path.value.closingElement.name.name = compatNavLinkLocalName;
    }
  });

  if (removedReactRouterDomPath) {
    importCompat(j, root, [compatNavLinkSpecifier], 'replaceWith', reactRouterDomPath);
  } else {
    importCompat(j, root, [compatNavLinkSpecifier], 'insertAfter', reactRouterDomPath);
  }

  return root.toSource(options);
};
