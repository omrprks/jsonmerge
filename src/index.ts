#!/usr/bin/env node

import fs from 'fs';
import util from 'util';
import { argv } from 'yargs';

type Files = Record<string, string> & { _: string[] };

if (argv._.length < 2) {
  console.error('Invalid arguments. Exiting...');
  process.exit(1);
}

const main = argv._[0];
const rest = argv._.slice(1);
let files: Files = {
  _: [] as string[],
} as Files;

for (let i = 0; i < rest.length; i += 1) {
  const current = rest[i];

  const [key, value] = current.toString().split(':');

  if (value) {
    files = {
      ...files,
      [key]: value,
    };
  } else {
    files._ = [
      ...files._,
      key,
    ];
  }
}

try {
  if (!fs.existsSync(main)) {
    throw new Error(`${main}: No such file or directory`);
  }

  const raw = fs.readFileSync(main);
  let output = JSON.parse(raw.toString());

  const {
    _,
    ...replacements
  } = files;

  Object.keys(replacements).forEach((key) => {
    const value: string = replacements[key];

    const buffer = fs.readFileSync(value);
    output[key] = JSON.parse(buffer.toString());
  });

  for (let i = 0; i < _.length; i += 1) {
    const filename = _[i];
    const buffer = fs.readFileSync(filename);
    const data = JSON.parse(buffer.toString());

    output = {
      ...output,
      ...data,
    };
  }

  if (!argv.out) {
    console.log(util.inspect(output, false, null, true));
    process.exit(0);
  }

  fs.writeFile(argv.out as string, JSON.stringify(output), (error) => {
    if (error) {
      throw error;
    }

    console.info('OK');
  });
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
