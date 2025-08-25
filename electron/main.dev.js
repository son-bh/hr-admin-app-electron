require('ts-node').register({
  transpileOnly: true,
  project: './electron/tsconfig.json',
});

require('./main.ts');
