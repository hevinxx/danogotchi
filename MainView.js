import React from "react";
import { View, Image, Text } from "react-native";
import MainArea from "./MainArea";
import * as Constants from "./Constants";
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
  } else if (state.isGoing) {
    return state.isWalking
      ? Constants.CHARACTER_STATE_WALKING
      : Constants.CHARACTER_STATE_DEFAULT;
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
      <>
        <MainArea
          characterState={characterState}
          actions={this.props.homeProvider.actions}
          data={this.props.homeProvider.state}
        />

        <View style={{ position: "absolute", bottom: 0 }}>
          <Image source={require("./assets/black_box.png")}></Image>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "DungGeunMo",
              position: "absolute",
              top: 15,
              left: 30,
              lineHeight: 30
            }}
          >
            {this.props.homeProvider.state.message.map(e => (
              <>
                {e}
                {"\n"}
              </>
            ))}
          </Text>
        </View>
      </>
    );
  };
}

export default withState(MainView);
