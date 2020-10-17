# Datatables Query for [Objection.js](https://github.com/Vincit/objection.js/)

[![npm](https://img.shields.io/npm/v/objection-datatables.svg?style=flat-square)](https://npmjs.org/package/objection-datatables)
![node](https://img.shields.io/node/v/objection-datatables.svg?style=flat-square)

## Description

-   This package serves good projects that use server side [Jquery DataTables](https://datatables.net/) plugin on their frontend.
-   Pagination using limit and offset.
-   Limit is used for number of rows returned.
-   Can fetch graph too with query.
-   Supports column ordering
-   Supports search by any column
-

## Installation

### NPM

```sh
npm i objection-datatables --save
```

## Usage (simple)

### Mixin and usage of the plugin

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

### Express.js route example using the plugin

```js
// express.js route example

route.get('/cats', async (req, res) => {
    /**
     * Use req.query since datatables plugin sends
     * all info as url query string parameters
     */
    const cats = await Cat.query().dataTable(req.query).where('cute', true);

    res.json({
        draw: req.query.draw,
        data: cats,
        recordsTotal: cats.total,
    });
});
```

### Simple example on the frontend of a [datatable](https://datatables.net/)

```html
<table id="my-table"></table>
<script>
    $('#my-table').DataTable({
        serverSide: true,
        ajax: {
            url: '/cats',
            dataSrc: 'data.results',
        },
    });
</script>
```

## Usage (complex)

-   As mentioned, this package also supports graph fetching if a graph name was mentioned in the columns of a datatable options, for example, consider the following models

```js
const { Model } = require('objection');

// Import the dataTable plugin.
const dataTable = require('objection-datatables');

// class person (owner)
class Person extends Model {
    static get tableName() {
        return 'persons';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'stock'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                company: { type: 'string' },
                loves_cats: { type: 'boolean' },
            },
            additionalProperties: false,
        };
    }
}

// Mixin Cat class which uses the datatable plugin
class Cat extends dataTable(Model) {
    static get tableName() {
        return 'cats';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'stock'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                color: { type: 'string' },
                cute: { type: 'boolean' },
                owner_id: { type: 'integer' },
            },
            additionalProperties: false,
        };
    }

    static get relationMappings() {
        const { BelongsToOneRelation } = Model;
        return {
            owner: {
                relation: BelongsToOneRelation,
                modelClass: Person,
                join: {
                    from: 'cats.owner_id',
                    to: 'persons.id',
                },
            },
        };
    }
}
```

### complex Express.js route example using the plugin

```js
// express.js route example

route.get('/cats', async (req, res) => {
    /**
     * here, .dataTable query handles all graph fetching
     * which is called by the datatable columns,
     * if any more graph fetching or conditional queries exist,
     * it can be written before it or after it too.
     * 
     * @see https://vincit.github.io/objection.js/recipes/custom-query-builder.html#custom-query-builder-extending-the-query-builder
     */
    const cats = await Cat.query()
        .dataTable(req.query)
        .where('cute', true)
        .modifyGraph('owner', (builder) => builder.select('name', 'company'));

    res.json({
        draw: req.query.draw,
        data: cats,
        recordsTotal: cats.total,
    });
});
```

### complex example on the frontend of a [datatable](https://datatables.net/)

```html
<table id="my-table"></table>
<script>
    $('#my-table').DataTable({
        serverSide: true,
        ajax: {
            url: '/cats',
            dataSrc: 'data.results',
        },
        // server side orders by first column (which is id) descending
        // graph fetched columns like owner columns are unorderable (can't be ordered)
        order [[0, 'desc']]
        columns:[
            // query only selects columns that are declared here
            { title:"ID", data:'id' },
            { title:"Name", data:'name' },
            /**
             * 1) fetches "owner" graph only if it's a relation mapping to the Cat model
             * 2) if the next two lines were commented, no graph would be fetched
             * 3) query selects all columns for a graph
             * 4) to resolve number 3, use modifyGraph from objection as in the example
             * 5) if you want all columns from graph, do not use modifyGraph
             * 6) you can fetch multiple graphs as well
             */
            { title:"Owner name", data: 'owner', render:'name' },
            { title: "Owner company", data: 'owner', render:'company'}
        ]
    });
</script>
```
