const http = require('http');
const chalk = require('chalk');
const app = require('./app/app');
const { appConfig, connectDatabase } = require('./config');

const server = http.createServer(app);

server.listen(appConfig.port, () => {
  connectDatabase().then(() => {
    console.log(
      '\n',
      chalk.bgRedBright.whiteBright(`Database status  `),
      chalk.bgGreen.whiteBright(`   Connected   `),
      '\n',
      chalk.bgRedBright.whiteBright(`Server status    `),
      chalk.bgGreen.whiteBright(`   Connected At ${appConfig.port}   `),
      "\n"
    );
  });
});
