export interface ITableProps {
  items: any[];
  idKey: string;
  columns: ITableColumn[];
}

export interface ITableColumn {
  sortable: boolean;
  label: string;
  key: string;
  size: number;
}
