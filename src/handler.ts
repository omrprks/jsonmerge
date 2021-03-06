import fs from 'fs';
import util from 'util';
import { Arguments } from 'yargs';

import expand from './lib/expand';

type Others = Record<string, string> & { _: string[] };

type Argv = Arguments & {
  main: string;
  files: string[];
  out: string | undefined;
};

export const handler = (argv: Arguments): void => {
  const {
    main,
    files,
    out,
  } = argv as Argv;

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

    const keys = Object.keys(replacements);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const file: string = replacements[key];

      if (!fs.existsSync(file)) {
        throw new Error(`${file}: No such file or directory`);
      }

      const parts = key.split('.').filter(Boolean);
      const buffer = fs.readFileSync(file);
      output = {
        ...output,
        ...expand(parts, JSON.parse(buffer.toString())),
      };
    }

    for (let i = 0; i < _.length; i += 1) {
      const filename = _[i];
      const buffer = fs.readFileSync(filename);
      const data = JSON.parse(buffer.toString());

      output = {
        ...output,
        ...data,
      };
    }

    const result = argv.js
      ? util.inspect(output, {
        showHidden: false,
        depth: null,
        colors: !out,
        compact: !argv.pretty,
      })
      : JSON.stringify(output, null, argv.pretty ? '  ' : undefined);

    if (!out) {
      console.log(result);

      process.exit(0);
    }

    fs.writeFile(out, result, (error) => {
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
