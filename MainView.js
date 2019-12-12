import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  TextInput,
  Switch,
  Text,
  KeyboardAvoidingView
} from "react-native";
import SpriteSheet from "rn-sprite-sheet";
import MainArea from "./MainArea";
import DescriptionArea from "./DescriptionArea";

class MainView extends React.Component {
  state = {
    character: "basic",
    characterState: "" // walk, find, desire, thirsty
  };

  render = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ width: 100, top: 100, position: "absolute", zIndex: 10 }}
        >
          <Button
            onPress={() => this.setState({ characterState: "walk" })}
            title="Test1"
          ></Button>
          <Button
            onPress={() => this.setState({ characterState: "default" })}
            title="Test2"
          ></Button>
          <Button
            onPress={() => this.setState({ characterState: "revolution" })}
            title="Test3"
          ></Button>
        </View>
        <MainArea
          character={this.state.character}
          characterState={this.state.characterState}
          bubble=""
        />
        {/* <DescriptionArea /> */}
      </View>
    );
  };
}

export default MainView;
