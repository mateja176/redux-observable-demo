import React, { FC } from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import "./App.css";
import Hello from "./Hello";
import { selectName, State } from "./store";
import { getName, Name, NameActionCreator, setName } from "./store/slices/name";

const setName$ = new Subject<Name>();

export interface AppProps {
  name: Name;
  getName: NameActionCreator;
  setName: NameActionCreator;
}

export interface AppState {
  subscription: { unsubscribe: () => void };
}

const App: FC<AppProps> = ({ name }) => (
  <div className="App">
    <Hello name={name} />
    <input onChange={({ target: { value } }) => setName$.next(value)} />
  </div>
);

export default compose(
  connect(
    (state: State) => ({ name: selectName(state) }),
    { getName, setName },
  ),
  withState("subscription", "setSubscription", { unsubscribe: () => {} }),

  lifecycle<AppProps, AppState>({
    componentDidMount() {
      const {
        props: { getName, setName },
      } = this;

      getName();

      const subscription = setName$
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe(name => setName(name));

      this.setState({ subscription });
    },
    componentWillUnmount() {
      this.state.subscription.unsubscribe();
    },
  }),
)(App);
