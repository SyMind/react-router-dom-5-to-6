module.exports = function getReactRouterDomImport(j, root) {
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
  
  return reactRouterDomImportPaths.paths()[0];
};
