const getReactRouterDomImport = require('./utils/getReactRouterDomImport');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const useRouteMatchImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'useRouteMatch'
  );
  const useRouteMatchLocalName = useRouteMatchImport.local.name;
  useRouteMatchImport.imported.name = 'useMatch';
  useRouteMatchImport.local = null;

  root
    .find(j.CallExpression, {
      callee: { name: useRouteMatchLocalName },
    })
    .forEach((path) => {
      path.value.callee.name = 'useMatch';

      if (path.value.arguments.length > 0) {
        const args = path.value.arguments;

        args
          .filter((a) => a.type === 'ObjectExpression')
          .forEach((a) => {
            const [strictVal] = a.properties.filter((p) => p.key.name === 'strict');
            if (strictVal) {
              strictVal.key.name = 'end';
            }
            const [sensitiveVal] = a.properties.filter((p) => p.key.name === 'sensitive');
            if (sensitiveVal) {
              sensitiveVal.key.name = 'caseSensitive';
            }
          });
      }
    });

  return root.toSource(options);
};
