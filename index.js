const DataTableQueryBuilder = require('./dataTableQueryBuilder');

module.exports = (Model) => {
    return class extends Model {
        static get QueryBuilder() {
            return DataTableQueryBuilder(Model);
        }
    };
};
