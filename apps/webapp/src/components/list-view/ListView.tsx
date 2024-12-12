import React, { useState } from 'react';
import Table from '../table/Table';
import Search from '../search/Search';
import styles from './ListView.module.scss';
import {
  ItemAction,
  ListViewTableColumn,
} from './types';
import { IAPIListView } from '@hotel-spell/api-interfaces';
import { LuPlus } from 'react-icons/lu';

interface ListComponentProps<T> {
  entityName: string;
  config: {
    columns: ListViewTableColumn[];
    itemActions: ItemAction[];
  };
  isLoading: boolean;
  data: IAPIListView<T>;
  goToPageHandler: (currentPage: number) => void;
  sortColumnHandler: (column: string, direction: 'asc' | 'desc') => void;
  searchItemsHandler: (search: string) => void;
  createItemHandler: () => void;
}

const ListViewComponent = <T,>({
  entityName,
  config: { columns, itemActions },
  data: { items, meta },
  isLoading,
  goToPageHandler,
  sortColumnHandler,
  searchItemsHandler,
  createItemHandler,
}: ListComponentProps<T>) => {
  const defaultColumn = columns.find((column) => column.sorting?.isDefault);
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: defaultColumn?.key || '',
    direction: defaultColumn?.sorting?.direction || 'asc',
  });

  const goToNextPage = () => {
    goToPageHandler(meta.currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPageHandler(meta.currentPage - 1);
  };

  const sortColumn = (column: string, direction: 'asc' | 'desc') => {
    setSorting({ column, direction });
    sortColumnHandler(column, direction);
  };

  const searchItems = (search: string) => {
    searchItemsHandler(search);
  };

  return (
    <section className={styles.listView}>
      <section className={styles.header}>
        <h1 className={styles.title}>{entityName}</h1>
        <div className="flex flex-row pt-2 gap-3 justify-end items-center">
          <div className="flex-1 h-full mr-2">
            <Search onSearch={searchItems}></Search>
          </div>
          <button className={styles.createButton} onClick={createItemHandler}>
            <LuPlus></LuPlus>
          </button>
        </div>
      </section>
      <section className={styles.tableContainer}>
        <Table
          items={items as any[]}
          idKey="id"
          columns={columns}
          itemActions={itemActions}
          isLoading={isLoading}
          pagination={{ ...meta, goToNextPage, goToPreviousPage }}
          sorting={{ ...sorting, sortColumn }}
        ></Table>
      </section>
    </section>
  );
};

export default ListViewComponent;
