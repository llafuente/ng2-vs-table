# Very Simple Table (Angular2 Module)
[![Build Status](https://travis-ci.org/llafuente/ng2-vs-table.svg?branch=master)](https://travis-ci.org/llafuente/ng2-vs-table)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/llafuente/ng2-vs-table/master/LICENSE)

**NOTE**: Use bootstrap 4

## Demo
https://llafuente.github.io/ng2-vs-table/demo/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

## About

Server side table/grid system.

## Installation

Install through npm:
```
npm install --save ng2-vs-table
```

Then use it in your app like so:

```typescript
import {VSTableModule} from 'ng2-vs-table';

@NgModule({
  //...
  imports: [
    VSTableModule
  ]
  //...
})
```

You may also find it useful to view the [demo source](https://github.com/llafuente/ng2-vs-table/blob/master/demo/demo.ts).

### Usage without a module bundler
```
<script src="node_modules/dist/umd/ng2-vs-table/ng2-vs-table.js"></script>
<script>
    // everything is exported VSTable namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via typedoc and can be viewed here:
https://llafuente.github.io/ng2-vs-table/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
