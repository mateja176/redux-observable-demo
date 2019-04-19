import React, { useEffect, FC } from 'react';
import Hello from './Hello';
import { connect } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { State, selectName } from './store';
import { Name, getName, setName, NameActionCreator } from './store/slices/name';

const setName$ = new Subject<Name>();

export interface AppProps {
  name: Name;
  getName: NameActionCreator;
  setName: NameActionCreator;
}

const App: FC<AppProps> = ({ name, setName, getName }) => {
  useEffect(() => {
    getName();

    const subscription = setName$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(name => setName(name));

    return () => subscription.unsubscribe();
  });

  return (
    <div>
      <Hello name={name} />
      <input onChange={({ target: { value } }) => setName$.next(value)} />
    </div>
  );
};

export default connect(
  (state: State) => ({ name: selectName(state) }),
  { getName, setName },
)(App);
