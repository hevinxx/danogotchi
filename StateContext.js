import React, { Component, createContext } from "react";
import items from "./ItemRepository";
import * as Constants from "./Constants";
import { Pedometer } from "expo-sensors";

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
      isPedometerAvailable: "checking",

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

      isEvolving: false,

      isHappy: false,

      message: "",
      // TODO : 말풍선
    };

    this.actions = {
      drink: this.drink,
      pickUpItem: this.pickUpItem,
    };
  }

  componentDidMount() {
    this.subscribePedometer();
  }

  componentWillUnmount() {
    this.unsubscribePedometer();
  }

  subscribePedometer = () => {
    this.pedometerSubscription = Pedometer.watchStepCount(result => {
      this.walk(step)
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );
  };

  unsubscribePedometer = () => {
    this.pedometerSubscription && this.pedometerSubscription.remove();
    this.pedometerSubscription = null;
  };

  /**
   * 걷는 상태로 만든다.
   * 타이머를 두어 일정 시간이 지난 뒤 다시 걷지 않는 상태로 만든다.
   */
  walk(step) {
    if (isFinding || isDesiringItem) {
      if (!isAppForeground) {
        this.setState({ previousStep: step })
        return
      }
    }

    // 타이머가 있었을 시 초기화한다.
    this.clearStopWalkingTimer()

    const dStep = step - this.state.previousStep
    const distanceToItem = Math.max(this.state.distanceToItem - dStep, Constants.FIND_ITEM_DISTANCE)

    this.setState({ 
      distanceToItem: distanceToItem,
      previousStep: step,
      isWalking: true
    }, () => {
      // 타이머를 설정한다.
      this.setStopWalkingTimer()
      // 아이템과의 거리가 FIND_ITEM_DISTANCE 보다 가까워졌을 시 findItem을 실행한다.
      distanceToItem <= Constants.FIND_ITEM_DISTANCE && this.findItem()
    })
  }

  // 걸었다는 신호가 들어온 뒤 WALKING_STOPPER_MILLISECONDS가 지나면 걷지 않는 상태로 만든다.
  setStopWalkingTimer() {
    this.walkingStopper = setTimeout(() => {
      this.setState({ isWalking: false })
      this.walkingStopper = 0
    }, Constants.WALKING_STOPPER_MILLISECONDS)
  }

  clearStopWalkingTimer() {
    if (this.walkingStopper) {
      clearTimeout(this.walkingStopper)
      this.walkingStopper = 0
    }
  }

  // 다음 아이템과의 거리를 결정한다.
  generateNextDistance() {
    return Math.max(Math.floor(Math.random() * Constants.MAX_DISTANCE), Constants.FIND_ITEM_DISTANCE + 10)
  }

  // 일정 시간마다 setThirsty를 호출한다.
  becomeThirsty() {
    this.drinkInterval = setInterval(() => {
      this.setThirsty()
    }, Constants.GETTING_THIRSTY_MILLISECONDS)
  }

  // 일정 확률로 목 마른 상태로 만든다.
  setThirsty() {
    const x = Math.random()
    if (x <= Constants.CHANCE_TO_GET_THIRSTY) {
      this.setState({ isThirsty: true }, () => {
        // TODO : 목 말라요
        this.setMessage("")
      })
    }
  }

  drink() {
    this.setState({ isThirsty: false}, () => {
      // TODO : 너도 마실래?
      this.setMessage("")
    })
  }

  findItem() {
    this.setState({ isFinding: true })
  }

  pickUpItem() {
    this.setState({ 
      isFinding: false,
      isHappy: true
    }, () => {
      // TODO : 아이템을 얻었다!
      this.setMessage("")
    })
    this.setNextItem()
    this.earnLovePoint()
  }

  // TODO: 행복해 하는 게 끝나면 불려야 한다.
  completeHappy() {
    this.setState({ isHappy: false })
  }

  // 캐릭터의 상태와는 별개로, 다음 아이템은 항상 정해져 있다.
  setNextItem() {
    const nextItemIndex = Math.floor(Math.random() * items.length)
    this.setState({ 
      desiredItemId: items[nextItemIndex].id,
      distanceToItem: this.generateNextDistance()
    })
  }

  earnLovePoint() {
    const lovePoint = this.state.lovePoint + this.state.lovePointToIncrease
    const prevStage = this.state.growthStage
    this.setState({ lovePoint: lovePoint }, () => {
      this.fillLovePointBar(prevStage, lovePoint)
    })
  }

  fillLovePointBar(prevStage, lovePoint) {
    // TODO : 바 채우는 애니메이션
    // 다 찼을 경우
    if (lovePoint >= growthStages[prevStage]) {
      // 남은 만큼 더 채우기
      this.evolve()
    }
  }

  evolve() {
    this.setState(prevState => ({ 
      growthStage: Math.min(prevState.growthStage + 1, growthStages.length),
      isEvolving: true
    }), () => {
      // TODO : 진화했다!
      this.setMessage("")
    })
  }

  // TODO : 진화가 끝났으면 불려야 한다.
  completeEvolve() {
    this.setState({ isEvolving: false })
  }

  setMessage(message) {
    this.setState({ message: message})
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