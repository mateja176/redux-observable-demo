import React, { Component } from 'react';
import Hello from './Hello';
import { connect } from 'react-redux';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { State, selectName } from './store';
import { Name, getName, setName, NameActionCreator } from './store/slices/name';
import './App.css';

const setName$ = new Subject<Name>();

export interface AppProps {
  name: Name;
  getName: NameActionCreator;
  setName: NameActionCreator;
}

export interface AppState {
  subscription: Subscription | { unsubscribe: () => void };
}

class App extends Component<AppProps, AppState> {
  state = {
    subscription: { unsubscribe: () => {} },
  };

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
  }

  componentWillUnmount() {
    this.state.subscription.unsubscribe();
  }

  render() {
    const {
      props: { name },
    } = this;

    return (
      <div className="App">
        <Hello name={name} />
        <input onChange={({ target: { value } }) => setName$.next(value)} />
      </div>
    );
  }
}

export default connect(
  (state: State) => ({ name: selectName(state) }),
  { getName, setName },
)(App);
