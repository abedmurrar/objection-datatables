module.exports = (Model) => {
    return class DataTableQueryBuilder extends Model.QueryBuilder {
        /**
         * Used for querying data from database for the jquery datatable ajax call
         * https://datatables.net/manual/server-side
         * @param {object} options
         * @param {Number} options.draw
         * @param {Number} options.start
         * @param {Number} options.length
         * @param {object} options.search
         * @param {string} options.search.value
         * @param {boolean} options.search.regex
         * @param {Array<{column: number, dir: string}>} options.order
         * @param {Array<{data: string, name: string, searchable: boolean, orderable: boolean, search:{value: string,regex: boolean}}>} options.columns
         */
        dataTable(options) {
            let query = null;
            // Destruct options object from request query
            const {
                columns = [],
                order = [],
                start = 0,
                length = 10,
                search = { value: '' },
                // _,
            } = options;

            // Get table columns names
            const tableColumns = Object.keys(this.modelClass().jsonSchema.properties);

            // Get eager columns and filter them to existing relations only
            const eagerColumnNames = columns
                .filter(({ data }) => data in this.modelClass().relationMappings)
                .map((col) => col.data);

            // Get columns names from options and filter them to existing columns only
            const columnsNames = columns
                .map((column) => column.data)
                .filter((column) => tableColumns.includes(column));
            query = this.select(columnsNames); // select columns;

            // Parse offset to Integer type
            const offset = parseInt(start, 10);
            // query = query.offset(offset).limit(length); // paging

            const eager = `[${eagerColumnNames.join(',')}]`;
            query = query.withGraphFetched(eager); // select with relations if requested too

            // Serialize order for Query
            const orders = order.map((orderObj) => {
                return { column: columnsNames[orderObj.column], order: orderObj.dir };
            });
            query = query.orderBy(orders); // order by column

            if (search && search.value) {
                for (let i = 0, length = columnsNames.length; i < length; i++) {
                    if (i === 0) {
                        query = query.where(columnsNames[i], 'like', `%${search.value}%`);
                    } else {
                        query = query.orWhere(columnsNames[i], 'like', `%${search.value}%`);
                    }
                }
            }

            if (length != -1) {
                query
                    .limit(length) // return total length
                    .offset(offset);
            }

            // Return full query
            query
                .range()
                .skipUndefined() // if a parameter if these functions is undefined it will be skipped
                .throwIfNotFound(); // throws javascript error if no records returned

            return this;
        }
    };
};
