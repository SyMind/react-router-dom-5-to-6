const getReactRouterDomImport = require('./utils/getReactRouterDomImport');
const importCompat = require('./utils/importCompat');

const COMPAT_FUNCS_OR_TYPES = [
  // functions
  'withRouter',
  'useHistory',

  // types
  'RouteComponentProps',
  'PromptProps',
  'NavLinkProps',
]

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const specifiers = [];
  const compatSpecifiers = [];
  for (const specifier of reactRouterDomPath.value.specifiers) {
    if (specifier.type !== 'ImportSpecifier' || !COMPAT_FUNCS_OR_TYPES.includes(specifier.imported.name)) {
      specifiers.push(specifier)
    } else {
      compatSpecifiers.push(
        j.importSpecifier(
          j.identifier(specifier.imported.name),
        )
      )
    }
  }

  if (compatSpecifiers.length === 0) {
    return root.toSource(options);
  }

  if (specifiers.length > 0) {
    reactRouterDomPath.value.specifiers = specifiers;

    importCompat(j, root, compatSpecifiers, 'insertAfter', reactRouterDomPath);
  } else {
    importCompat(j, root, compatSpecifiers, 'replaceWith', reactRouterDomPath);
  }

  return root.toSource(options);
};
