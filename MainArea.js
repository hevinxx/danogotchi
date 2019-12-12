import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Button,
  Image,
  Easing
} from "react-native";
import SpriteSheet from "rn-sprite-sheet";
import { TrackingConfigurations } from "expo/build/AR";
import { withState } from "./StateContext";

const characterURL = {};

class MainArea extends Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "3",
    bgPos: new Animated.Value(0),

    character: "",
    characterState: "",
    bubble: ""
  };

  animate = Animated.loop(
    Animated.timing(this.state.bgPos, {
      duration: 12000,
      toValue: -3375,
      easing: Easing.linear
    })
  );

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return {
      ...(nextProps.character !== prevState.character && {
        character: nextProps.character
      }),
      ...(nextProps.characterState !== prevState.characterState && {
        characterState: nextProps.characterState
      }),
      ...(nextProps.bubble !== prevState.bubble && { bubble: nextProps.bubble })
    };
  };

  componentDidMount = () => {
    this.eggAction();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.characterState === "walk") {
      this.animate = Animated.loop(
        Animated.timing(this.state.bgPos, {
          duration: 12000,
          toValue: -3375,
          easing: Easing.linear
        })
      );
      this.animate.start();
      return;
    }
    if (this.state.characterState === "default") {
      this.play(this.state.characterState, { onFinish: this.defaultAction });
      this.animate.stop();
      // this.setState({ bgPos: new Animated.Value(this.state.bgPos._value) });
      // this.state.bgPos.setOffset(this.state.bgPos._value);
      return;
    }
    if (this.state.characterState) {
      this.play(this.state.characterState, { onFinish: this.eggAction });
    }
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

  eggAction = () => {
    this.play("egg", { loop: true });
  };

  defaultAction = () => {
    this.play("default", { loop: true });
  };

  render() {
    const { characterState } = this.state;
    console.log(this.state);
    return (
      <View style={styles.mainArea}>
        {characterState === "walk" || characterState === "default" ? (
          <Animated.View
            style={{
              left: this.state.bgPos
            }}
          >
            <Image source={require("./assets/Crop.png")} />
          </Animated.View>
        ) : null}
        <View style={styles.characterContainer}>
          <View style={styles.bubbleContainer}>
            {/* <Image source={require("./assets/Pencil.png")} /> */}
          </View>
          <View>
            <SpriteSheet
              style={styles.character}
              ref={ref => (this.character = ref)}
              source={require("./assets/danogotchi_character2.png")}
              columns={4}
              rows={4}
              animations={{
                egg: [0, 1, 2, 3],
                default: [4, 5, 6, 7],
                walk: [4, 5, 6, 7],
                thirsty: [8, 9, 10, 11],
                revolution: [12, 13, 14, 15]
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainArea: {
    flex: 1,
    overflow: "visible"
  },
  background: {
    left: -100
  },
  bubbleContainer: {},
  characterContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "30%"
  },
  character: {}
});

export default withState(MainArea);
