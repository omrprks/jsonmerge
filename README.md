# @omrprks/jsonmerge
> Small tool for merging json files

## Why?
Just needed a quick re-usable script for merging json files (for container definitions -> task definitions for AWS ECS)

## Installation
```sh
npm install -g @omrprks/jsonmerge
```

## Usage
```json
// main.json
{
  "name": "main",
  "version": 1
}
// another-one.json
{
  "name": "another-one"
}
```
```sh
$ jsonmerge main.json another-one.json
#=> Output: {"name":"another-one","version":1}
```

Alternatively you can nest the contents of a json file by specifying the property name (e.g. `property:filename`):
```sh
$ jsonmerge main.json anotherOne:another-one.json
#=> Output: {"name":"main","version":1,"anotherOne":{"name":"another-one"}}
```

## License
[MIT](./LICENSE) © [Omar Parkes](https://github.com/omrprks)
