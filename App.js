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
import * as Font from "expo-font";
import SpriteSheet from "rn-sprite-sheet";

class App extends React.Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "16",
    isFontLoaded: false
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      PressStart2P: require("./assets/PressStart2P.ttf")
    });
    console.log("test");
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
      <SafeAreaView style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "PressStart2P",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
            fontSize: 30,
            paddingTop: 40
          }}
        >
          DANOGOTCHI
        </Text>
        <View style={styles.container}>
          <SpriteSheet
            ref={ref => (this.mummy = ref)}
            source={require("./assets/mummy.png")}
            columns={9}
            rows={6}
            // height={200} // set either, none, but not both
            // width={200}
            animations={{
              walk: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              appear: Array.from({ length: 15 }, (v, i) => i + 18),
              die: Array.from({ length: 21 }, (v, i) => i + 33)
            }}
          />
        </View>
        <View>
          <Button onPress={() => this.play("walk")} title="walk" />
          <Button onPress={() => this.play("appear")} title="appear" />
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
