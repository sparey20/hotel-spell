export type ListViewTableColumn = {
  key: string;
  label: string;
  size: number;
  sortable: boolean;
  sorting: {
    direction: 'asc' | 'desc';
    isDefault: boolean;
  } | null
};

export type ItemAction = {
  label: string;
  action: (item: any) => void;
};
