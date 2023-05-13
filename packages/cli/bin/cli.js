#! /usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const execa = require('execa');
const checkUpdates = require('./checkUpdate');
const ensureGitClean = require('./ensureGitClean');

const jscodeshiftBin = require.resolve('.bin/jscodeshift');

const transformersDir = path.join(__dirname, '../transforms');

// override default babylon parser config to enable `decorator-legacy`
// https://github.com/facebook/jscodeshift/blob/master/parser/babylon.js
const babylonConfig = path.join(__dirname, './babylon.config.json');

const transformers = [
  'change-match-path-args-order',
  'compat-function',
  'compat-nav-link-active-prop',
  'rename-nav-link-prop',
  'replace-redirect-to-navigate',
  'replace-use-route-match-with-use-match',
  'upgrade-switch-to-routes',
];

const dependencyProperties = [
  'dependencies',
  'devDependencies',
  'clientDependencies',
  'isomorphicDependencies',
  'buildDependencies'
];

const tableChars = {
  top: '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  bottom: '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  left: '',
  'left-mid': '',
  mid: '',
  'mid-mid': '',
  right: '',
  'right-mid': '',
  middle: ''
};

function getRunnerArgs(
  transformerPath,
  parser = 'babylon', // use babylon as default parser
  options = {}
) {
  const args = [
    '--verbose=2',
    '--ignore-pattern=**/node_modules',
    '--quote=single'
  ];

  // limit usage for cpus
  const cpus = options.cpus || Math.max(2, Math.ceil(os.cpus().length / 3));
  args.push('--cpus', cpus);

  // https://github.com/facebook/jscodeshift/blob/master/src/Runner.js#L255
  // https://github.com/facebook/jscodeshift/blob/master/src/Worker.js#L50
  args.push('--no-babel');

  args.push('--parser', parser);

  args.push('--parser-config', babylonConfig);
  args.push('--extensions=tsx,ts,jsx,js');

  args.push('--transform', transformerPath);

  if (options.gitignore) {
    args.push('--ignore-config', options.gitignore);
  }

  if (options.style) {
    args.push('--importStyles');
  }

  if (options.pages) {
    args.push(`--pages=${options.pages}`);
  }
  return args;
}

async function run(filePath, args = {}) {
  for (const transformer of transformers) {
    await transform(transformer, 'babylon', filePath, args);
  }
}

async function transform(transformer, parser, filePath, options) {
  console.log(chalk.bgGreen.bold('Transform'), transformer);
  const transformerPath = path.join(transformersDir, `${transformer}.js`);

  const args = [filePath].concat(
    getRunnerArgs(transformerPath, parser, options)
  );

  try {
    if (process.env.NODE_ENV === 'local') {
      console.log(`Running jscodeshift with: ${args.join(' ')}`);
    }
    await execa(jscodeshiftBin, args, {
      stdio: 'inherit',
      stripEof: false
    });
  } catch (err) {
    console.error(err);
    if (process.env.NODE_ENV === 'local') {
      const errorLogFile = path.join(__dirname, './error.log');
      fs.appendFileSync(errorLogFile, err);
      fs.appendFileSync(errorLogFile, '\n');
    }
  }
}

async function checkDependencies(targetDir, dependenciesMarkers) {
}

/**
 * options
 * --force   // force skip git checking (dangerously)
 * --cpus=1  // specify cpus cores to use
 */
async function bootstrap() {
  const dir = process.argv[2];

  const args = require('yargs-parser')(process.argv.slice(3));

  if (process.env.NODE_ENV !== 'local') {
     // check for updates
     await checkUpdates();

    // check for git status
    if (!args.force) {
      await ensureGitClean();
    } else {
      console.log(
        Array(3)
          .fill(1)
          .map(() =>
            chalk.yellow(
              'WARNING: You are trying to skip git status checking, please be careful'
            )
          )
          .join(os.EOL)
      );
    }
  }

  // check for `path`
  if (!dir) {
    console.log(chalk.yellow('Please pass dir'));
    process.exit(1);
  }
  if (!fs.existsSync(dir)) {
    console.log(chalk.yellow('Invalid dir:', dir, ', please pass a valid dir'));
    process.exit(1);
  }

  // await run(project.sourceRoot, args);

  // await marker.start();

  // const dependenciesMarkers = await marker.output();
  // await checkDependencies(project.sourceRoot, dependenciesMarkers);

  console.log('\n----------- Thanks for using react-router-dom-5-to-6 -----------');
}

bootstrap();
