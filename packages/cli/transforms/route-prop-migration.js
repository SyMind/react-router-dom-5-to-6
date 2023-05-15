const getReactRouterDomImport = require('./utils/getReactRouterDomImport');
const importCompat = require('./utils/importCompat');

module.exports = function (file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const reactRouterDomPath = getReactRouterDomImport(j, root);
  if (!reactRouterDomPath) {
    return root.toSource(options);
  }

  const routeImport = reactRouterDomPath.value.specifiers.find(
    specifier =>
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'Route'
  );
  if (!routeImport) {
    return root.toSource(options);
  }

  const routeImportLocalName = routeImport.local.name;

  root
    .find(j.JSXElement, {
      openingElement: { name: { name: routeImportLocalName } },
    })
    .forEach((path) => {
      // exact and path prop
      const exactPropIndex = path.value.openingElement.attributes.findIndex(
        a => a.name.name === 'exact'
      );
      if (exactPropIndex === -1) {
        const pathProp = path.value.openingElement.attributes.find(
          a => a.name.name === 'path'
        );
        if (pathProp) {
          if (pathProp.value.type === 'Literal') {
            pathProp.value.value = pathProp.value.value + '/*';
          } else if (pathProp.value.type === 'JSXExpressionContainer' && pathProp.value.expression.type === 'TemplateLiteral') {
            const expression = pathProp.value.expression;
            const lastQuasi = expression.quasis[expression.quasis.length - 1];
            if (lastQuasi.tail) {
              lastQuasi.value.raw = lastQuasi.value.raw + '/*';
              lastQuasi.value.cooked = lastQuasi.value.cooked + '/*';
            }
          }
        }
      } else {
        // remove exact prop
        path.value.openingElement.attributes.splice(exactPropIndex, 1);
      }

      // component prop to element prop
      const componentProp = path.value.openingElement.attributes.find(
        a => a.name.name === 'component'
      );
      if (componentProp) {
        if (componentProp.value.type === 'JSXExpressionContainer' && componentProp.value.expression.type === 'Identifier') {
          componentProp.name.name = 'element';
          componentProp.value.expression = j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(componentProp.value.expression.name),
              [],
              true
            )
          );
        }
      }

      // children to element prop
      const childrenProp = path.value.openingElement.attributes.find(
        a => a.name.name === 'children'
      );
      if (childrenProp) {
        childrenProp.name.name = 'element';
      }

      const jsxElements = path.value.children.filter(child => child.type === 'JSXElement');
      const jsxTexts = path.value.children.filter(child => child.type === 'JSXText');
      if (jsxElements.length === 1 && !jsxTexts.some(text => text.value.trim() !== '')) {
        path.value.children = [];
        path.value.openingElement.selfClosing = true;
        path.value.closingElement = null;
        path.value.openingElement.attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier('element'),
            j.jsxExpressionContainer(jsxElements[0])
          )
        );
      }

      // render prop to element prop
      const renderProp = path.value.openingElement.attributes.find(
        a => a.name.name === 'render'
      );
      if (renderProp && ['ArrowFunctionExpression', 'FunctionExpression'].includes(renderProp.value.expression.type)) {
        renderProp.name.name = 'element';
        const expression = renderProp.value.expression;
        renderProp.value.expression = j.jsxElement(
          j.jsxOpeningElement(
            j.jsxIdentifier('RouteRender'),
            [
              j.jsxAttribute(
                j.jsxIdentifier('render'),
                j.jsxExpressionContainer(expression)
              )
            ],
            true
          ),
        );

        const compatSpecifiers = [
          j.importSpecifier(
            j.identifier('RouteRender'),
          )
        ];
        importCompat(j, root, compatSpecifiers, 'insertAfter', reactRouterDomPath);
      }
    });

  return root.toSource(options);
};
