import React from "react";
import { View, Button } from "react-native";
import MainArea from "./MainArea";
import * as Constants from "./Constants";
import DescriptionArea from "./DescriptionArea";
import { withState } from "./StateContext";

const getCharacterState = state => {
  if (state.isDrinking) {
    return Constants.CHARACTER_STATE_DRINKING;
  } else if (state.isHappy) {
    return Constants.CHARACTER_STATE_HAPPY;
  } else if (state.isEvolving) {
    return Constants.CHARACTER_STATE_EVOLVING;
  } else if (state.isFinding) {
    return Constants.CHARACTER_STATE_FINDING;
  } else if (state.isDesiringItem) {
    return Constants.CHARACTER_STATE_DESIRING;
  } else if (state.isWalking) {
    return Constants.CHARACTER_STATE_WALKING;
  } else if (state.isThirsty) {
    return Constants.CHARACTER_STATE_THIRSTY;
  } else {
    return Constants.CHARACTER_STATE_DEFAULT;
  }
};
class MainView extends React.Component {
  render = () => {
    const characterState = getCharacterState(this.props.homeProvider.state);

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ width: 100, top: 100, position: "absolute", zIndex: 10 }}
        ></View>
        <MainArea
          growthStage={this.props.homeProvider.state.growthStage}
          characterState={characterState}
          bubble=""
        />
        <DescriptionArea />
      </View>
    );
  };
}

export default withState(MainView);
