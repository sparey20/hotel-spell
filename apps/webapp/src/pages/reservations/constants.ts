import { TableColumn } from '../../components/table/table';

export const RESERVATION_COLUMNS: TableColumn[] = [
  {
    sortable: false,
    label: 'First Name',
    key: 'guestFirstName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Last Name',
    key: 'guestLastName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Check In',
    key: 'checkInDate',
    size: 2,
  },
  {
    sortable: false,
    label: 'Check Out',
    key: 'checkOutDate',
    size: 2,
  },
  {
    sortable: false,
    label: 'Room',
    key: 'roomNumber',
    size: 2,
  },
];
