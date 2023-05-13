const updateCheck = require('update-check');
const chalk = require('chalk');
const pkg = require('../package.json');

module.exports = async function checkUpdates() {
  let update;
  try {
    update = await updateCheck(pkg);
  } catch (err) {
    console.log(chalk.yellow(`Failed to check for updates: ${err}`));
  }

  if (update) {
    console.log(
      chalk.blue(`Latest version is ${update.latest}. Please update firstly`),
    );
    process.exit(1);
  }
}
