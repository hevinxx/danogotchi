import React, { Component } from "react";
import { StyleSheet, View, Button, Image, ImageBackground } from "react-native";
import SpriteSheet from "rn-sprite-sheet";

class MainArea extends Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "3",

    character: "",
    characterState: "",
    bubble: ""
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return {
      character: nextProps.character,
      characterState: nextProps.characterState,
      bubble: nextProps.bubble
    };
  };

  componentDidMount = () => {
    this.egg();
  };

  play = (type, option) => {
    const { fps } = this.state;

    this.character.play({
      type,
      fps: Number(fps),
      resetAfterFinish: true,
      ...option
    });
  };

  egg = () => {
    this.play("ready", { loop: true });
  };

  standBy = () => {
    this.play("walk", { loop: true });
  };

  test = () => {
    this.play("appear", { onFinish: this.standBy });
  };

  render() {
    return (
      <ImageBackground
        style={styles.mainArea}
        source={require("./assets/danogotchi_bg.png")}
      >
        <View style={styles.characterContainer}>
          <View style={styles.bubbleContainer}>
            <Image source={require("./assets/icon.png")} />
          </View>
          <View>
            {/* <SpriteSheet
            ref={ref => (this.character = ref)}
            source={require("./assets/mummy.png")}
            columns={9}
            rows={6}
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
          /> */}
            <SpriteSheet
              style={styles.character}
              ref={ref => (this.character = ref)}
              source={require("./assets/egg.png")}
              columns={2}
              rows={1}
              animations={{
                ready: [0, 1]
              }}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mainArea: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    resizeMode: "cover"
  },
  bubbleContainer: {},
  characterContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "37%"
  },
  character: {}
});

export default MainArea;
