import React, { Component, createContext } from "react";
import items from "./ItemRepository";
import * as Constants from "./Constants";

const Context = createContext();
const { Provider, Consumer } = Context;

class StateProvider extends Component {
  constructor(props) {
    super(props);
    
    const growthStages = [0, Constants.THRESHOLD_BETTER, Constants.THRESHOLD_BEST];
    this.state = {
      // 0: good, 1: better, 2: best
      growthStage: 0,
      /**
       * 0 ~ THRESHOLD_BETTER : good
       * THRESHOLD_BETTER ~ THRESHOLD_BEST : better
       * THRESHOLD_BEST ~ MAX_LOVE_POINT : best
       */
      lovePoint: 0,

      isAppForeground: true,
      isWalking: false,
      isFinding: false,

      previousStep: 0,

      /**
       * desiredItemId는 항상 하나를 갖고 있는다. 
       * isDesiringItem이 false일 때는 드러나지 않다가 true가 될 때 캐릭터가 요청한다. 
       * distanceToItem이 이 FIND_ITEM_DISTANCE되면 아이템을 만난다.
       */
      isDesiringItem: false,
      desiredItemId: null,
      distanceToItem: 100,
      // 시연을 위해 100을 상수로 넣겠다.
      lovePointToIncrease: 100,
 
      isThirsty: false,

      // TODO : 말풍선
      // TODO : 상태 메시지
    };

    this.actions = {
      walk: step => this.walk(step),
    };
  }

  walk(step) {
    if (isFinding || isDesiringItem) {
      if (!isAppForeground) {
        this.setState({ previousStep: step })
        return
      }
    }

    const dStep = step - this.state.previousStep
    const distanceToItem = Math.max(this.state.distanceToItem - dStep, Constants.FIND_ITEM_DISTANCE)
    this.setState({ 
      distanceToItem: distanceToItem,
      previousStep: step
    }, () => {
      if (distanceToItem <= Constants.FIND_ITEM_DISTANCE) this.findItem()
    })
  }

  findItem() {
    this.setState({ isFinding: true })
    // TODO: 애니메이션
  }

  pickUpItem() {
    // TODO : 인벤토리에 넣음
    this.setNextItem()
    this.earnLovePoint()
  }

  earnLovePoint() {
    const lovePoint = this.state.lovePoint + this.state.lovePointToIncrease
    const prevStage = this.state.growthStage
    this.setState({ lovePoint: lovePoint }, () => {
      if (lovePoint >= growthStages[prevStage]) {
        this.evolve()
      }
    })
  }

  evolve() {
    this.setState(prevState => ({ growthStage: Math.min(prevState.growthStage + 1, growthStages.length) }))
    // TODO : 애니메이션
  }

  setNextItem() {
    const nextItemIndex = Math.floor(Math.random() * items.length)
    this.setState({ 
      desiredItemId: items[nextItemIndex].id,
      distanceToItem: this.generateNextDistance()
    })
  }

  generateNextDistance() {
    return Math.floor(Math.random() * Constants.MAX_DISTANCE)
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

export { StateProvider, Consumer, withState };
