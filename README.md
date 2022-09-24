# @omrprks/jsonmerge

> Small tool for merging json files

## Introduction

I just needed a quick re-usable script for combining json files under nested properties (e.g. for templated container definitions -> task definitions for AWS ECS)

### Installation

```sh
npm install -g @omrprks/jsonmerge
```

### Usage

#### Command-line Options

```sh
jsonmerge <main> <files...>

Small tool for merging json files

Options:
  --js           Prints output as javascript object                    [boolean]
  --pretty       Pretty-prints json output                             [boolean]
  -V, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
  -o, --out      Outputs result to file
```

#### Examples

1. Merging two or more json files

```jsonc
// fileA.json
{
  "name": "fileA",
  "version": 1
}
// fileB.json
{
  "name": "fileB",
  "key": "value"
}
```

```sh
$ jsonmerge fileA.json fileB.json
#=> {"name":"B","version":1,"key":"value"}
```

2. Nesting contents of a json file within another file by specifying property name

```jsonc
// fileA.json
{ "name": "fileA" }
// fileB.json
{ "key": "value" }
```

```sh
$ jsonmerge fileA.json fileB:fileB.json
#=> {"name":"fileA","fileB":{"key":"value"}}
```

3. Nesting the contents of two or more files

```jsonc
// fileA.json
{ "name": "fileA" }
// fileB.json
{ "name": "B" }
// fileC.json
{ "combinedNested": true }
```

```sh
$ jsonmerge fileA.json combined:fileB.json,fileC.json
#=> {"name":"fileA","combined":{"name":"B","combinedNested":true}}
```

### License

[MIT](./LICENSE) © [Omar Parkes](https://github.com/omrprks)
