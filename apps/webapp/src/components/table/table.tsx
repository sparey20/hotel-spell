import styles from './table.module.scss';
import { LuMoreVertical } from 'react-icons/lu';
import { Dropdown } from 'flowbite-react';
import { useEffect, useState } from 'react';

type TableProps = {
  items: { [key: string]: any }[];
  idKey: string;
  columns: TableColumn[];
  itemActions?: {
    label: string;
    icon?: string;
    action: (item: { [key: string]: any }) => void;
  }[];
  itemsSelected?: (ids: string[]) => void;
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
  itemsSelected,
  itemActions,
}: TableProps) {
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
    return selectedItems.length === items.length;
  };

  return (
    <section className={styles.table}>
      <div className={headerClass}>
        <div className="col-span-1 flex justify-center items-center">
          <input
            type="checkbox"
            className={styles.checkBox}
            checked={areAllItemsSelected()}
            onChange={selectAll}
          />
        </div>
        <div
          className={`col-span-10 grid ${
            columnWidthClassMapping[columns.length]
          }`}
        >
          {columns.map((column) => (
            <div className="flex justify-center" key={column.key}>
              <h4>{column.label}</h4>
            </div>
          ))}
        </div>
        <div className="col-span-1 flex justify-center"></div>
      </div>
      <ul className={styles.rowContainer}>
        {items.map((item, index) => (
          <li
            key={item[idKey]}
            className={`${rowItemClass} ${
              isItemSelected(item[idKey]) ? `${styles.selected}` : ''
            }`}
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
                  renderTrigger={() => (
                    <button type="button" className={styles.moreOptionsButton}>
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
    </section>
  );
}
