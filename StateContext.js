import React, { Component, createContext } from "react";
import items from "./ItemRepository";
import * as Constants from "./Constants";
import { Pedometer } from "expo-sensors";

const Context = createContext();
const { Provider, Consumer } = Context;

class StateProvider extends Component {
  constructor(props) {
    super(props);

    this.growthStages = [
      0,
      Constants.THRESHOLD_BETTER,
      Constants.THRESHOLD_BEST
    ];
    this.state = {
      // 0: good, 1: better, 2: best
      growthStage: 0,
      hatchingLevel: Constants.EGG,

      /**
       * 0 ~ THRESHOLD_BETTER : good
       * THRESHOLD_BETTER ~ THRESHOLD_BEST : better
       * THRESHOLD_BEST ~ MAX_LOVE_POINT : best
       */
      lovePoint: 0,

      isAppForeground: true,
      isWalking: false,
      isFinding: false,

      isPedometerAvailable: "checking",

      /**
       * desiredItemId는 항상 하나를 갖고 있는다.
       * isDesiringItem이 false일 때는 드러나지 않다가 true가 될 때 캐릭터가 요청한다.
       */
      isDesiringItem: false,
      desiredItemId: null,

      isGoing: false,

      isThirsty: false,
      isDrinking: false,

      isEvolving: false,

      isHappy: false,

      message: ["몽환의 숲에 온 걸 환영해!"]
    };

    this.distanceToItem = 40;
    this.previousStep = 0;

    this.actions = {
      hatch: this.hatch,
      drink: this.drink,
      desireItem: this.desireItem,
      pickUpItem: this.pickUpItem,
      becomeThirsty: this.becomeThirsty,
      evolve: this.evolve,
      happy: this.happy,
      go: this.go
    };
  }

  componentDidMount() {
    this.subscribePedometer();
    this.setNextItem();
  }

  componentWillUnmount() {
    this.unsubscribePedometer();
  }

  subscribePedometer = () => {
    this.pedometerSubscription = Pedometer.watchStepCount(step => {
      this.walk(step);
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

  happy = () => {
    this.setState({ isHappy: true }, this.setHappyStopper);
  };

  /**
   * 걷는 상태로 만든다.
   * 타이머를 두어 일정 시간이 지난 뒤 다시 걷지 않는 상태로 만든다.
   */
  walk = result => {
    // 시연을 위해 better 단계 이상에서만.
    if (this.state.hatchingLevel != Constants.BORN) return;
    if (this.state.growthStage < 1) return;

    const dStep = result.steps - this.previousStep;
    
    const distanceToItem = Math.max(this.distanceToItem - dStep,0);

    this.distanceToItem = distanceToItem
    this.previousStep = result.steps

    if (
      this.state.isDrinking ||
      this.state.isHappy ||
      this.state.isEvolving ||
      this.state.isFinding ||
      this.state.isDesiringItem
    ) {
      if (!this.state.isAppForeground) {
        return;
      }
    }

    // 타이머가 있었을 시 초기화한다.
    this.clearStopWalkingTimer();

    // 타이머를 설정한다.
    this.setStopWalkingTimer();

    // 아이템과의 거리가 0보다 가까워졌을 시 findItem을 실행한다.
    distanceToItem <= 0 && this.findItem();
    
    // 이미 isWalking이라면 다시 true할 필요 없다.
    if (!this.state.isWalking) {
      this.setState({ isWalking: true });
    }
  };

  // 걸었다는 신호가 들어온 뒤 WALKING_STOPPER_MILLISECONDS가 지나면 걷지 않는 상태로 만든다.
  setStopWalkingTimer = () => {
    if (this.walkTimer) clearTimeout(this.walkTimer);
    this.walkTimer = setTimeout(() => {
      this.setState({ isWalking: false });
    }, Constants.WALKING_STOPPER_MILLISECONDS);
  };

  clearStopWalkingTimer = () => {
    if (this.walkingStopper) {
      clearTimeout(this.walkingStopper);
      this.walkingStopper = 0;
    }
  };

  // 다음 아이템과의 거리를 결정한다.
  generateNextDistance = () => {
    return Math.floor(Math.random() * Constants.MAX_DISTANCE)
  };

  hatch = () => {
    this.setState({ hatchingLevel: Constants.HATCHING }, () => {
      setTimeout(() => {
        this.setState(
          {
            hatchingLevel: Constants.BORN,
            message: ["안녕 나는 숲의 요정 다노고치야"]
          },
          this.becomeThirsty
        );
      }, Constants.HATCHING_MILLISECONDS);
    });
  };

  desireItem = () => {
    this.desireInterval = setInterval(() => {
      if (!this.state.isDesiringItem) {
        // 시연을 위해 better, best 단계에서만
        if (this.state.growthStage != 0) this.setDesiringItemRandomly();
      }
    }, Constants.GET_THIRSTY_MILLISECONDS);
  };

  // 일정 확률로 아이템을 원하는 상태로 만든다.
  setDesiringItemRandomly = () => {
    const x = Math.random();
    if (
      x <= Constants.CHANCE_TO_GET_DESIRING &&
      !this.state.isDesiringItem &&
      !this.state.isGoing
    ) {
      this.setState({ isDesiringItem: true }, () => {
        // TODO : 아이템 필요해요.
        this.setMessage([]);
      });
    }
  };

  go = () => {
    this.setState({ isGoing: true });
  };

  stop = () => {
    this.setState({ isGoing: false });
  };

  becomeThirsty = () => {
    this.drinkInterval = setInterval(() => {
      // 시연을 위해 good 단계에서만
      if (
        this.state.growthStage == 0 &&
        !this.state.isThirsty &&
        !this.state.isDrinking
      ) {
        this.setThirstyRandomly();
      }
    }, Constants.GET_THIRSTY_MILLISECONDS);
  };

  // 일정 확률로 목 마른 상태로 만든다.
  setThirstyRandomly = () => {
    const x = Math.random();
    if (
      x <= Constants.CHANCE_TO_GET_THIRSTY &&
      !this.state.isThirsty &&
      !this.state.isGoing
    ) {
      this.setState(
        {
          isThirsty: true
        },
        () => {
          this.setMessage([
            "어제 술을 너무 많이 마셔서",
            "수분 보충이 필요해..."
          ]);
        }
      );
    }
  };

  drink = () => {
    this.setState(
      {
        isDrinking: true,
        isThirsty: false
      },
      () => {
        this.setStopDrinkingTimer();
        this.setMessage(["(꼴깍꼴깍)..."]);
      }
    );
  };

  setStopDrinkingTimer = () => {
    setTimeout(() => {
      this.earnLovePoint(this.generateEarningPoint());
      this.setState({ isDrinking: false });
    }, Constants.DRINK_STOPPER_MILLISECONDS);
  };

  findItem = () => {
    this.state.isFinding || this.setState({ isFinding: true });
  };

  pickUpItem = () => {
    this.setState(
      {
        isFinding: false,
        isHappy: true
      },
      () => {
        this.setHappyStopper();
        // TODO : 아이템을 얻었다!
        this.setMessage([]);
      }
    );
    this.setNextItem();
    this.stop();
    this.earnLovePoint(this.generateEarningPoint());
  };

  setHappyStopper = () => {
    this.happyStopper = setTimeout(() => {
      this.setState({ isHappy: false });
      this.happyStopper = 0;
    }, Constants.HAPPY_STOPPER_MILLISECONDS);
  };

  // 캐릭터의 상태와는 별개로, 다음 아이템은 항상 정해져 있다.
  setNextItem = () => {
    const nextItemIndex = Math.floor(Math.random() * items.length);
    this.distanceToItem = this.generateNextDistance();
    this.setState({
      desiredItemId: items[nextItemIndex].id
    });
  };

  earnLovePoint = point => {
    const lovePoint = this.state.lovePoint + point;
    const threshold = this.growthStages[this.state.growthStage];
    this.setState({ lovePoint: lovePoint }, () => {
      if (lovePoint >= threshold) this.evolve();
    });
  };

  generateEarningPoint = () => {
    // 시연을 위해 100으로 고정한다
    return 100;
  };

  evolve = () => {
    this.setState(
      prevState => ({
        growthStage: Math.min(
          prevState.growthStage + 1,
          this.growthStages.length
        ),
        isEvolving: true
      }),
      () => {
        this.setStopEvolvingTimer();
        this.setMessage(
          this.state.growthStage === 1
            ? ["축하해! 우리 모두", "Best version에 더 가까워졌어"]
            : ["축하해!", "드디어 best version이 됐어"]
        );
      }
    );
  };

  setStopEvolvingTimer = () => {
    setTimeout(() => {
      this.setState({ isEvolving: false }, () => {
        // 시연용으로 better 이상에서만

        if (this.state.growthStage > 0) this.desireItem();
      });
    }, Constants.EVOLVE_STOPPER_MILLISECONDS);
  };

  setMessage = message => {
    this.setState({ message: message });
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

function withState(Component) {
  class ComponentWithContext extends React.Component {
    render() {
      return (
        <Consumer>
          {value => <Component {...this.props} homeProvider={value} />}
        </Consumer>
      );
    }
  }
  return ComponentWithContext;
}

export { StateProvider, Consumer, withState };
