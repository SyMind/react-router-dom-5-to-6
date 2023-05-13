const path = require('path');
const execa = require('execa');
const chalk = require('chalk');
const _ = require('lodash');
const semver = require('semver');

const upgradeList = {
  'react-router-dom': {
    version: '^6.0.0',
  },
  'react': {
    version: '^16.8.0'
  },
  'react-dom': {
    version: '^16.8.0'
  }
}

const dependencyProperties = [
  'dependencies',
  'devDependencies',
  'clientDependencies',
  'isomorphicDependencies',
  'buildDependencies',
];

async function listInstalledPkgs(cwd) {
  let result;

  const naBin = require.resolve('.bin/na');

  for (const args of [['list', '--json'], ['list', '--json', '-w']]) {
    const { exitCode, stdout } = await execa(naBin, args, { cwd });
    if (exitCode === 0) {
      const json = JSON.parse(stdout);
      const pkg = Array.isArray(json) ? json[0] : json;
      if (!pkg) {
        continue;
      }

      for (const prop of dependencyProperties) {
        const deps = pkg[prop];
        if (deps) {
          if (result) {
            result = {
              ...result,
              ...deps,
            }
          } else {
            result = deps
          }
        }
      }
    }
  }

  return result;
}

module.exports = async function detectDependencies(targetDir, needCompatible, needHistory) {
  const result = [];

  const cwd = path.join(process.cwd(), targetDir);

  let installedPkgs;
  try {
    installedPkgs = await listInstalledPkgs(cwd);
  } catch(error) {
    console.error(error);
  }

  if (!installedPkgs) {
    console.log(chalk.yellow(`We can't detect your package manager, please check dependencies manually.\n`));

    result.push(['install', 'react-router-dom', upgradeList['react-router-dom'].version]);
    result.push(['install', 'react', upgradeList['react'].version]);
    result.push(['install', 'react-dom', upgradeList['react-dom'].version]);

    if (needCompatible) {
      result.push([
        'install',
        'react-router-dom-5-to-6-compat',
        '^1.0.0',
      ]);
    }
  } else {
    for (const [depName, depVersion] of Object.entries(upgradeList)) {
      const installedVersion = installedPkgs[depName];
      if (!semver.gte(semver.minVersion(installedVersion.version), semver.minVersion(depVersion.version))) {
        result.push(['upgrade', depName, depVersion.version]);
      }
    }

    if (needCompatible) {
      if (!installedPkgs['react-router-dom-5-to-6-compat']) {
        result.push([
          'install',
          'react-router-dom-5-to-6-compat',
          '^1.0.0',
        ]);
      }
    }
  }

  if (!needHistory) {
    result.push([
      'uninstall',
      'history',
      ''
    ]);
  }

  if (result.length === 0) {
    console.log(chalk.green('Checking passed'));
    return;
  }

  console.log(
    chalk.yellow(
      "It's recommended to install, upgrade or uninstall these dependencies to ensure working well with react-router-dom v6\n",
    ),
  );

  const dependencies = result.map(
    ([operateType, depName, expectVersion, dependencyProperty]) =>
      [
        _.capitalize(operateType),
        `${depName}${expectVersion}`,
        dependencyProperty ? `in ${dependencyProperty}` : '',
      ].join(' '),
  );

  console.log(dependencies.map(n => `* ${n}`).join('\n'));
}
