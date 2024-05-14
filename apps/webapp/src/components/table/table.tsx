import styles from './table.module.scss';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuMoreVertical,
} from 'react-icons/lu';
import { Dropdown, Pagination } from 'flowbite-react';
import { Fragment, MouseEventHandler, useEffect, useState } from 'react';

type TableProps = {
  items: { [key: string]: any }[];
  idKey: string;
  columns: TableColumn[];
  isLoading: boolean;
  itemActions?: {
    label: string;
    icon?: string;
    action: (item: { [key: string]: any }) => void;
  }[];
  pagination?: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    itemCount: number;
    totalPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
  };
  sorting?: {
    column: string;
    direction: 'asc' | 'desc';
    sortColumn: (column: string, direction: 'asc' | 'desc') => void;
  };
};

export type TableColumn = {
  sortable: boolean;
  label: string;
  key: string;
  size: number;
};

const columnWidthClassMapping: Record<string, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
};

export default function Table({
  items,
  columns,
  idKey,
  itemActions,
  pagination,
  isLoading,
  sorting,
}: TableProps) {
  const loadingItems = Array.from(
    { length: pagination?.itemCount ?? 10 },
    (_, index) => index
  );
  const headerClass = `${styles.headerContainer} grid-cols-12`;
  const rowItemClass = `${styles.rowItem} grid-cols-12`;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(items.map((item) => item[idKey]));
  };

  const selectItem = (event: any, id: string, index: number) => {
    if (event.nativeEvent.shiftKey) {
      const lastSelectedItemIndex = items.findIndex(
        (item) => item[idKey] === selectedItems[selectedItems.length - 1]
      );
      const lowest =
        index < lastSelectedItemIndex ? index : lastSelectedItemIndex;
      const highest =
        index > lastSelectedItemIndex ? index : lastSelectedItemIndex;
      let betweenItems: string[] = [];

      for (let i = lowest; i <= highest; i++) {
        if (!selectedItems.includes(items[i][idKey])) {
          betweenItems = [...betweenItems, items[i][idKey]];
        }
      }

      setSelectedItems([...selectedItems, ...betweenItems, id]);

      return;
    }

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      return;
    }

    setSelectedItems([...selectedItems, id]);
  };

  const isItemSelected = (id: string): boolean => {
    return selectedItems.includes(id);
  };

  const areAllItemsSelected = (): boolean => {
    if (items.length === 0) {
      return false;
    }
    return selectedItems.length === items.length;
  };

  const areMultipleItemsSelected = (): boolean => {
    return selectedItems.length > 1;
  };

  const sortColumnHander = (column: TableColumn): any => {
    if (!sorting?.sortColumn) {
      return;
    }

    let direction: 'asc' | 'desc' = 'asc';

    if (sorting.column === column.key) {
      direction = sorting?.direction === 'asc' ? 'desc' : 'asc';
    }

    sorting.sortColumn(column.key, direction);
  };

  return (
    <section className={styles.table}>
      <div className={styles.actionBar}>
        {pagination && (
          <div className="flex flex-row gap-3 items-center">
            <p>
              {pagination.currentPage === 1
                ? 1
                : pagination.currentPage * pagination.itemsPerPage <
                  pagination.totalItems
                ? pagination.currentPage * pagination.itemsPerPage
                : pagination.totalItems}
              -
              {pagination.currentPage + 1 < pagination.totalPages
                ? (pagination.currentPage + 1) * pagination.itemsPerPage
                : pagination.totalItems}
              of {pagination.totalItems}
            </p>
            <button
              className="buttonIcon"
              onClick={pagination.goToPreviousPage}
              disabled={pagination.currentPage === 1}
            >
              <LuChevronLeft></LuChevronLeft>
            </button>
            <button
              className="buttonIcon"
              onClick={pagination.goToNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <LuChevronRight></LuChevronRight>
            </button>
          </div>
        )}
      </div>
      <div className={headerClass}>
        <div className="col-span-1 flex justify-center items-center">
          <input
            type="checkbox"
            className={styles.checkBox}
            checked={areAllItemsSelected()}
            onChange={selectAll}
            disabled={isLoading}
          />
        </div>
        <div
          className={`col-span-10 grid ${
            columnWidthClassMapping[columns.length]
          }`}
        >
          {columns.map((column) => (
            <button
              className="flex justify-center items-center gap-2"
              key={column.key}
              disabled={!column.sortable}
              onClick={() => sortColumnHander(column)}
            >
              <h4>{column.label}</h4>
              {column.sortable && (
                <Fragment>
                  {sorting?.direction === 'asc' &&
                    sorting?.column === column.key && (
                      <LuChevronUp></LuChevronUp>
                    )}
                  {sorting?.direction === 'desc' &&
                    sorting?.column === column.key && (
                      <LuChevronDown></LuChevronDown>
                    )}
                </Fragment>
              )}
            </button>
          ))}
        </div>
        <div className="col-span-1 flex justify-center"></div>
      </div>
      {isLoading ? (
        <ul className={styles.rowContainer}>
          {loadingItems.map((value) => (
            <li className={`${styles.loading} ${rowItemClass}`} key={value}>
              <div className="flex col-span-1 justify-center items-center">
                <div className={styles.loaderIcon}></div>
              </div>

              <div
                className={`col-span-10 grid items-center gap-4 ${
                  columnWidthClassMapping[columns.length]
                }`}
              >
                {columns.map((column) => (
                  <div
                    key={`${value}-${column.key}`}
                    className={styles.loaderBar}
                  ></div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={styles.rowContainer}>
          {items.map((item, index) => (
            <li
              key={item[idKey]}
              className={`${rowItemClass} ${
                isItemSelected(item[idKey]) ? `${styles.selected}` : ''
              } ${isLoading ? `${styles.loading}` : ''}`}
            >
              <div className="col-span-1 flex justify-center items-center">
                <input
                  type="checkbox"
                  className={styles.checkBox}
                  checked={isItemSelected(item[idKey])}
                  onChange={(event) => selectItem(event, item[idKey], index)}
                />
              </div>
              <div
                className={`col-span-10 grid ${
                  columnWidthClassMapping[columns.length]
                }`}
              >
                {columns.map((column) => (
                  <div
                    className="flex justify-center"
                    key={`${item[idKey]}-${column.key}`}
                  >
                    {item[column.key]}
                  </div>
                ))}
              </div>
              <div className="col-span-1 flex justify-center">
                <div className={styles.moreOptions}>
                  <Dropdown
                    label=""
                    dismissOnClick={true}
                    disabled={areMultipleItemsSelected()}
                    renderTrigger={() => (
                      <button
                        type="button"
                        className={styles.moreOptionsButton}
                      >
                        <LuMoreVertical></LuMoreVertical>
                      </button>
                    )}
                    placement="bottom-end"
                  >
                    {itemActions?.map((itemAction) => (
                      <Dropdown.Item
                        key={itemAction.label}
                        onClick={() => itemAction.action(item)}
                      >
                        {itemAction.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
