import { ListViewActionsTypes } from './enums';

export type ListViewItem = {
  id: string;
};

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

export type ListViewAction = {
  type: ListViewActionsTypes;
  payload: ListViewState;
};

export type ListViewStateData = {
  pagination: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  items: ListViewItem[] | ListViewItem;
};

export type ListViewState = {
  loading: boolean;
  error: boolean;
  search: string;
  sorting: {
    column: string;
    direction: 'asc' | 'desc';
  };
  data: ListViewStateData;
};
