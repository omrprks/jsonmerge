#!/usr/bin/env node

import fs from 'fs';
import util from 'util';
import yargs, { Arguments } from 'yargs';

type Others = Record<string, string> & { _: string[] };

export const handler = (argv: Arguments): void => {
  const {
    main,
    files,
    out,
  } = argv as Arguments & {
    main: string;
    files: string[];
    out: string | undefined;
  };

  let others = {
    _: [] as string[],
  } as Others;

  for (let i = 0; i < files.length; i += 1) {
    const current = files[i];

    const [key, value] = current.toString().split(':');

    if (value) {
      others = {
        ...others,
        [key]: value,
      };
    } else {
      others._ = [
        ...others._,
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
    } = others;

    Object.keys(replacements).forEach((key) => {
      const file: string = replacements[key];

      if (!fs.existsSync(file)) {
        throw new Error(`${file}: No such file or directory`);
      }
      const buffer = fs.readFileSync(file);
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

    if (!out) {
      console.log(
        argv.js
          ? util.inspect(output, false, null, true)
          : JSON.stringify(output, null, argv.pretty ? '  ' : undefined),
      );

      process.exit(0);
    }

    fs.writeFile(out, JSON.stringify(output), (error) => {
      if (error) {
        throw error;
      }

      console.info(`OK: ${out}`);
    });
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  }
};

export default handler;

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
