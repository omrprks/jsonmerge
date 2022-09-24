import fs from 'fs';
import util from 'util';
import assert from 'assert';
import { Arguments } from 'yargs';

import { expand } from './lib/expand';

type Others = Record<string, string> & { _: string[] };

type Argv = Arguments & {
  main: string;
  files: string[];
  out?: string;
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

      let content = null;

      const splitFiles = file.split(',');
      for (let j = 0; j < splitFiles.length; j += 1) {
        const currentFile = splitFiles[j];
        if (!fs.existsSync(currentFile)) {
          throw new Error(`${currentFile}: No such file or directory`);
        }

        const buffer = fs.readFileSync(currentFile);
        const parsed = JSON.parse(buffer.toString());

        content = Array.isArray(parsed)
          ? [...(content || []), ...parsed]
          : { ...(content || {}), ...parsed };
      }

      const parts = key.split('.').filter(Boolean);
      output = {
        ...output,
        ...expand(parts, content, output),
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
    assert(error instanceof Error);
    console.error(error.message || error);
    process.exit(1);
  }
};

export default handler;
