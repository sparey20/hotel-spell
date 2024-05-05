import { TableColumn } from '../../components/table/table';

export const GUEST_COLUMNS: TableColumn[] = [
  {
    sortable: false,
    label: 'First Name',
    key: 'firstName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Last Name',
    key: 'lastName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Email',
    key: 'email',
    size: 2,
  },
];
