import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Font from "expo-font";
import MainView from "./MainView";
import { StateProvider } from "./StateContext";

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
      <StateProvider style={{ flex: 1 }}>
        <MainView />
      </StateProvider>
    );
  };
}

export default App;
