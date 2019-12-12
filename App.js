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
import * as Font from "expo-font";
import MainView from "./MainView";
import DescriptionArea from "./DescriptionArea";

class App extends React.Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "16"
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      PressStart2P: require("./assets/PressStart2P.ttf")
    });

    this.setState({ isFontLoaded: true });
  };

  play = type => {
    const { fps, loop, resetAfterFinish } = this.state;

    this.mummy.play({
      type,
      fps: Number(fps),
      loop: loop,
      resetAfterFinish: resetAfterFinish,
      onFinish: () => console.log("hi")
    });
  };

  render = () => {
    if (!this.state.isFontLoaded) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MainView />
      </View>
    );
  };
}

export default App;
