const chalk = require('chalk');

function displayColorfulMessage() {
  console.log(chalk.green('Node.js modules make it easy to build reusable applications!'));
}

module.exports = displayColorfulMessage;