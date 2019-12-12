import React from "react";
import { View, Button } from "react-native";
import MainArea from "./MainArea";
import {
  CHARACTER_STATE_DEFAULT,
  CHARACTER_STATE_WALKING,
  CHARACTER_STATE_DESIRING,
  CHARACTER_STATE_THIRSTY,
  CHARACTER_STATE_EVOLVING,
  CHARACTER_STATE_HAPPY
} from "./Constants";
import DescriptionArea from "./DescriptionArea";
import { withState } from "./StateContext";

class MainView extends React.Component {
  state = {
    character: "basic",
    characterState: "" // walk, find, desire, thirsty
  };

  render = () => {
    console.log(this.props)
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ width: 100, top: 100, position: "absolute", zIndex: 10 }}
        >
          <Button
            onPress={() =>
              this.setState({ characterState: CHARACTER_STATE_WALKING })
            }
            title="Test1"
          ></Button>
          <Button
            onPress={() =>
              this.setState({ characterState: CHARACTER_STATE_DEFAULT })
            }
            title="Test2"
          ></Button>
          <Button
            onPress={() =>
              this.setState({ characterState: CHARACTER_STATE_EVOLVING })
            }
            title="Test3"
          ></Button>
        </View>
        <MainArea
          character={this.state.character}
          characterState={this.state.characterState}
          bubble=""
        />
        <DescriptionArea />
      </View>
    );
  };
}

export default withState(MainView);
