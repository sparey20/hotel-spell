import { ListViewActionsTypes } from './enums';
import { ListViewAction, ListViewItem, ListViewState } from './types';

export const LIST_VIEW_REDUCER_ACTION_MAP = new Map<
  ListViewActionsTypes,
  (state: ListViewState, action: ListViewAction) => ListViewState
>([
  [
    ListViewActionsTypes.FetchInit,
    (state: ListViewState, action: ListViewAction) => ({
      ...state,
      loading: true,
      error: false,
    }),
  ],
  [
    ListViewActionsTypes.FetchFailure,
    (state: ListViewState, action: ListViewAction) => ({
      ...state,
      loading: false,
      error: true,
      data: {
        ...state.data,
        items: [],
      },
    }),
  ],
  [
    ListViewActionsTypes.FetchSuccess,
    (state: ListViewState, action: ListViewAction) => action.payload,
  ],
  [
    ListViewActionsTypes.AddItem,
    (state: ListViewState, action: ListViewAction) =>
      ({
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          items: [
            ...(state.data.items as ListViewItem[]),
            action.payload.data.items,
          ],
        },
      } as ListViewState),
  ],
  [
    ListViewActionsTypes.UpdateItem,
    (state: ListViewState, action: ListViewAction) => {
      const itemIndex = (state.data.items as ListViewItem[]).findIndex(
        (item: ListViewItem) =>
          item.id === (action.payload.data.items as ListViewItem).id
      );
      return {
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          items: [
            ...(state.data.items as ListViewItem[]).slice(0, itemIndex),
            action.payload.data.items,
            ...(state.data.items as ListViewItem[]).slice(itemIndex + 1),
          ],
        },
      } as ListViewState;
    },
  ],
  [
    ListViewActionsTypes.UpdateItems,
    (state: ListViewState, action: ListViewAction) => {
      return {
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          items: [
            ...action.payload.data.items as ListViewItem[],
          ],
        },
      } as ListViewState;
    },
  ],
  [
    ListViewActionsTypes.RemoveItem,
    (state: ListViewState, action: ListViewAction) => {
      return {
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          items: (state.data.items as ListViewItem[]).filter(
            (item: ListViewItem) =>
              item.id !== (action.payload.data.items as ListViewItem).id
          ),
        },
      } as ListViewState;
    },
  ],
  [
    ListViewActionsTypes.UpdateInit,
    (state: ListViewState, action: ListViewAction) =>
      ({
        ...state,
        loading: true,
      } as ListViewState),
  ],
]);

export const LIST_VIEW_REDUCER = (
  state: ListViewState,
  action: ListViewAction
): ListViewState => {
  const mappedAction = LIST_VIEW_REDUCER_ACTION_MAP.get(action.type);

  return mappedAction ? mappedAction(state, action) : state;
};
