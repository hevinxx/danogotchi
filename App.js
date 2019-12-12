import React from "react";
import { View, Text } from "react-native";
import * as Font from "expo-font";
import MainView from "./MainView";

class App extends React.Component {
  state = {
    isFontLoaded: false
  };
  componentDidMount = async () => {
    await Font.loadAsync({
      PressStart2P: require("./assets/PressStart2P.ttf")
    });

    this.setState({ isFontLoaded: true });
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
