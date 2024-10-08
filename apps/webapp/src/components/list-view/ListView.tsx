import React, { useEffect, useReducer, useRef, useState } from 'react';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import Table from '../table/Table';
import Search from '../search/Search';
import { showToastWithTimeout } from '../../lib/features/toast/toastSlice';
import { useAppDispatch } from '../../lib/hooks';
import styles from './ListView.module.scss';
import { LIST_VIEW_REDUCER } from './constants';
import {
  ItemAction,
  ListViewItem,
  ListViewState,
  ListViewTableColumn,
} from './types';
import { ListViewActionsTypes } from './enums';
import { IAPIListView } from '@hotel-spell/api-interfaces';
import { LuPlus } from 'react-icons/lu';

interface ListComponentProps<T> {
  entityName: string;
  config: {
    rowLimit: number;
    columns: ListViewTableColumn[];
    itemActions: ItemAction[];
  };
  createItemHandler: () => void;
  fetchDataRequest: (params: any) => Promise<AxiosResponse<IAPIListView<any>>>;
  deleteItemRequest: (id: string) => Promise<AxiosResponse<void>>;
  mapDataToTableItems: (data: T[]) => any[];
}

const ListViewComponent = <T,>({
  entityName,
  config: { rowLimit, columns, itemActions },
  fetchDataRequest,
  deleteItemRequest,
  mapDataToTableItems,
  createItemHandler,
}: ListComponentProps<T>) => {
  console.log('list view component');
  const dispatch = useAppDispatch();
  const defaultColumn = columns.find((column) => column.sorting?.isDefault);
  const [listViewState, dispatchListView] = useReducer(LIST_VIEW_REDUCER, {
    loading: true,
    error: false,
    search: '',
    sorting: {
      column: defaultColumn?.key || '',
      direction: defaultColumn?.sorting?.direction || 'asc',
    },
    data: {
      items: [],
      pagination: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: rowLimit,
        totalPages: 0,
        currentPage: 1,
      },
    },
  } as ListViewState);

  const {
    loading,
    search,
    data: { items, pagination },
    sorting,
  } = listViewState;

  const getInitialListViewData = () => {
    dispatchListView({
      type: ListViewActionsTypes.FetchInit,
      payload: listViewState,
    });

    fetchDataRequest({
      limit: rowLimit,
      sortColumn: sorting.column,
      sortDirection: sorting.direction,
    })
      .then(({ data: { items, meta } }) => {
        dispatchListView({
          type: ListViewActionsTypes.FetchSuccess,
          payload: {
            ...listViewState,
            loading: false,
            error: false,
            data: {
              items: mapDataToTableItems(items),
              pagination: {
                totalItems: meta.totalItems,
                itemCount: meta.itemCount,
                itemsPerPage: meta.itemsPerPage,
                totalPages: meta.totalPages,
                currentPage: meta.currentPage,
              },
            },
          },
        });
      })
      .catch((error) => {
        dispatchListView({
          type: ListViewActionsTypes.FetchFailure,
          payload: listViewState,
        });
        dispatch(
          showToastWithTimeout({
            message: 'Failed requesting data.',
            type: 'error',
          }) as any
        );
      });
  };

  const getListViewData = ({
    page = pagination.currentPage,
    sortColumn = sorting.column,
    sortDirection = sorting.direction,
  }) => {
    fetchDataRequest({
      limit: rowLimit,
      sortColumn,
      sortDirection,
      page,
      search,
    }).then(({ data: { meta, items } }) => {
      dispatchListView({
        type: ListViewActionsTypes.FetchSuccess,
        payload: {
          ...listViewState,
          loading: false,
          error: false,
          sorting: {
            column: sortColumn,
            direction: sortDirection,
          },
          data: {
            ...listViewState.data,
            items: mapDataToTableItems(items),
            pagination: meta,
          },
        },
      });
    });
  };

  const goToNextPage = () => {
    getListViewData({ page: pagination.currentPage + 1 });
  };

  const goToPreviousPage = () => {
    getListViewData({ page: pagination.currentPage - 1 });
  };

  const sortColumn = (column: string, direction: 'asc' | 'desc') => {
    getListViewData({ sortColumn: column, sortDirection: direction });
  };

  const searchItems = (search: string) => {
    fetchDataRequest({
      limit: rowLimit,
      sortColumn: sorting.column,
      sortDirection: sorting.direction,
      search,
    })
      .then(({ data: { meta, items } }) => {
        dispatchListView({
          type: ListViewActionsTypes.FetchSuccess,
          payload: {
            ...listViewState,
            loading: false,
            error: false,
            search,
            data: {
              ...listViewState.data,
              items: mapDataToTableItems(items),
              pagination: meta,
            },
          },
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting items.',
            type: 'error',
          }) as any
        );
      });
  };

  useEffect(() => {
    getInitialListViewData();
  }, []);

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
          items={items as ListViewItem[]}
          idKey="id"
          columns={columns}
          itemActions={itemActions}
          isLoading={loading}
          pagination={{ ...pagination, goToNextPage, goToPreviousPage }}
          sorting={{ ...sorting, sortColumn }}
        ></Table>
      </section>
    </section>
  );
};

export default ListViewComponent;
