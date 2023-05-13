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

  const compatImportDeclaration = j.importDeclaration(
    [
      j.importSpecifier(
        j.identifier('NavLink')
      )
    ],
    j.literal('react-router-dom-5-to-6-compat')
  );
  if (removedReactRouterDomPath) {
    j(reactRouterDomPath).replaceWith(compatImportDeclaration);
  } else {
    j(reactRouterDomPath).insertAfter(compatImportDeclaration);
  }

  return root.toSource(options);
};
