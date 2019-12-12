import React, { Component, createContext } from "react";

const Context = createContext();
const { Provider, Consumer: CounterConsumer } = Context;

class StateProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.actions = {
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

function withCounter(WrappedComponent) {
  return function UseCounterProvider(props) {
    return (
      <CounterConsumer>
        {({ state, actions }) => (
          <WrappedComponent value={state.value} plusOne={actions.plusOne} />
        )}
      </CounterConsumer>
    );
  };
}

export { StateProvider, CounterConsumer, withCounter };
