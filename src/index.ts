#!/usr/bin/env node

import yargs from 'yargs';

import handler from './handler';

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('jsonmerge')
  .alias('V', 'version')
  .alias('h', 'help')
  .alias('o', 'out')
  .describe('out', 'Outputs result to file')
  .boolean('js')
  .describe('js', 'Prints output as javascript object')
  .boolean('pretty')
  .describe('pretty', 'Pretty-prints json output')
  .conflicts('js', 'pretty')
  .command('$0 <main> <files...>', 'Small tool for merging json files', {}, handler)
  .argv;
