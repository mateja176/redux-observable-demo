import {
  configureStore,
  getDefaultMiddleware,
  createSelector,
} from 'redux-starter-kit';
import {
  Name,
  name,
  SetNameAction,
  nameSlice,
  NameAction,
  setName,
} from './slices/name';
import { Observable } from 'rxjs';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import {
  StateObservable,
  ofType,
  combineEpics,
  createEpicMiddleware,
} from 'redux-observable';
import logger from 'redux-logger';

export interface State {
  name: Name;
}

export const nameEpic = (
  action$: Observable<SetNameAction>,
  state$: StateObservable<State>,
) =>
  action$.pipe(
    ofType('name/getName'),
    switchMap(() => fetch('https://jsonplaceholder.typicode.com/users/1')),
    mergeMap(response => response.json()),
    map(({ name }: { name: string }) => name),
    map(setName),
  );

const rootEpic = combineEpics(nameEpic);

export type Action = NameAction;

const epicMiddleware = createEpicMiddleware<Action>();

const store = configureStore<State, Action>({
  reducer: {
    [nameSlice]: name,
  },
  middleware: [...getDefaultMiddleware(), logger, epicMiddleware],
});

epicMiddleware.run(rootEpic as any);

export default store;

export const selectName = createSelector<State, Name>([nameSlice]);
