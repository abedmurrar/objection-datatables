# Datatables Query for [Objection.js](https://github.com/Vincit/objection.js/)

[![npm](https://img.shields.io/npm/v/objection-datatables.svg?style=flat-square)](https://npmjs.org/package/objection-datatables)
![node](https://img.shields.io/node/v/objection-datatables.svg?style=flat-square)

## Installation

### NPM

```sh
npm i objection-datatables --save
```

## Usage

### Mixin the plugin

```js
const { Model } = require('objection');

// Import the dataTable plugin.
const dataTable = require('objection-datatables');

// Mixin 
class Cat extends dataTable(Model) {
    static get tableName() {
        return 'cats';
    }
}
```
