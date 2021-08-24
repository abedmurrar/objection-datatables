import { Model, Page, PageQueryBuilder, QueryBuilder } from 'objection';

declare module 'objection-datatables' {
    type dataTableQuery = {
        draw: number;
        start: number;
        length: number;
        search: {
            value: string;
            regex: boolean;
        };
        order: Array<{ column: number; dir: string }>;
        columns: Array<{
            data: string;
            name: string;
            searchable: boolean;
            orderable: boolean;
            search: { value: string; regex: boolean };
        }>;
    };

    class DataTableQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
        ArrayQueryBuilderType!: DataTableQueryBuilder<M, M[]>;
        SingleQueryBuilderType!: DataTableQueryBuilder<M, M>;
        NumberQueryBuilderType!: DataTableQueryBuilder<M, number>;
        PageQueryBuilderType!: DataTableQueryBuilder<M, Page<M>>;

        dataTable(options: dataTableQuery): PageQueryBuilder<this>;
    }

    class DataTableModel extends Model {
        QueryBuilderType!: DataTableQueryBuilder<this>;
        static QueryBuilder: DataTableQueryBuilder;
    }

    function dataTablePlugin<T extends typeof Model>(model: T): typeof DataTableModel;
    export = dataTablePlugin;
}
