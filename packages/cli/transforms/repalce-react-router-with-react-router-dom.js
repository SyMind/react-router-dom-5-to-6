module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  root
    .find(j.ImportDeclaration, {
      type: 'ImportDeclaration'
    })
    .filter(path => (
      (
        path.value.source.type === 'Literal' ||
        path.value.source.type === 'StringLiteral'
      ) && path.value.source.value === 'react-router'
    ))
    .forEach(path => {
      path.value.source.value = 'react-router-dom';
    });

  return root.toSource(options);
};
