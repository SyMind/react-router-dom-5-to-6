const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const matchPathImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'matchPath'
  );
  const matchPathLocalName = matchPathImport.local.name;

  root
    .find(j.CallExpression, {
      callee: { name: matchPathLocalName },
    })
    .forEach((path) => {
      const args = path.value.arguments;
      if (args[1].properties) {
        const [exact] = args[1].properties.filter((p) => p.key.name === 'exact');
        if (exact) {
          exact.key.name = 'caseSensitive';
          exact.value.value = false;
        }
        const [strict] = args[1].properties.filter((p) => p.key.name === 'strict');
        if (strict) {
          strict.key.name = 'end';
          strict.value.value = true;
        }
        // reset args
        path.value.arguments = [];
        // swap arg positions
        path.value.arguments[0] = args[1];
        path.value.arguments[1] = args[0];
      }
    });

  return root.toSource(options);
};
