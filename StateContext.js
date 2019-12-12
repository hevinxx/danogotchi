import React, { Component, createContext } from "react";

const Context = createContext();
const { Provider, Consumer } = Context;

class StateProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.actions = {
      // for example
      plusOne: () => {
        this.setState(prevState => ({ value: prevState.value + 1 }));
      }
    };
  }

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

function withState(WrappedComponent) {
  return function UseCounterProvider(props) {
    return (
      <Consumer>
        {({ state, actions }) => (
          <WrappedComponent state={state} actions={actions} />
        )}
      </Consumer>
    );
  };
}

export { StateProvider, CounterConsumer, withState };
