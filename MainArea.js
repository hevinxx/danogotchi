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
import {
  CHARACTER_STATE_DEFAULT,
  CHARACTER_STATE_WALKING,
  CHARACTER_STATE_DESIRING,
  CHARACTER_STATE_WANT,
  CHARACTER_STATE_EVOLVING,
  CHARACTER_STATE_HAPPY,
  CHARACTER_STATE_FINDING,
  CHARACTER_STATE_DRINKING,
  THRESHOLD_BETTER,
  THRESHOLD_BEST
} from "./Constants";

const getSpriteIndex = (character, state) => {
  let startIndex = 0;
  if (growthStage > THRESHOLD_BEST) {
    if (state.CHARACTER_STATE_DEFAULT === CHARACTER_STATE_DEFAULT) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_WALKING === CHARACTER_STATE_WALKING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DESIRING === CHARACTER_STATE_DESIRING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_WANT === CHARACTER_STATE_WANT) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_EVOLVING === CHARACTER_STATE_EVOLVING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_HAPPY === CHARACTER_STATE_HAPPY) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_FINDING === CHARACTER_STATE_FINDING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DRINKING === CHARACTER_STATE_DRINKING) {
      startIndex = 8;
    }
  } else if (growthStage > THRESHOLD_BETTER) {
    if (state.CHARACTER_STATE_DEFAULT === CHARACTER_STATE_DEFAULT) {
      startIndex = 32;
    } else if (state.CHARACTER_STATE_WALKING === CHARACTER_STATE_WALKING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DESIRING === CHARACTER_STATE_DESIRING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_WANT === CHARACTER_STATE_WANT) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_EVOLVING === CHARACTER_STATE_EVOLVING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_HAPPY === CHARACTER_STATE_HAPPY) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_FINDING === CHARACTER_STATE_FINDING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DRINKING === CHARACTER_STATE_DRINKING) {
      startIndex = 8;
    } else {
    }
  } else {
    if (state.CHARACTER_STATE_DEFAULT === CHARACTER_STATE_DEFAULT) {
      startIndex = 64;
    } else if (state.CHARACTER_STATE_WALKING === CHARACTER_STATE_WALKING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DESIRING === CHARACTER_STATE_DESIRING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_WANT === CHARACTER_STATE_WANT) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_EVOLVING === CHARACTER_STATE_EVOLVING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_HAPPY === CHARACTER_STATE_HAPPY) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_FINDING === CHARACTER_STATE_FINDING) {
      startIndex = 8;
    } else if (state.CHARACTER_STATE_DRINKING === CHARACTER_STATE_DRINKING) {
      startIndex = 8;
    }
  }
};

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

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.characterState === CHARACTER_STATE_WALKING) {
      this.animate = Animated.loop(
        Animated.timing(this.state.bgPos, {
          duration: 12000,
          toValue: -3375,
          easing: Easing.linear
        })
      );
      this.animate.start();
      this.play(this.state.characterState, { onFinish: this.defaultAction });
      return;
    }
    if (this.state.characterState === CHARACTER_STATE_DEFAULT) {
      this.play(this.state.characterState, { onFinish: this.defaultAction });
      this.animate.stop();
      return;
    }
    // if (this.state.characterState) {
    //   this.play(this.state.characterState, { onFinish: this.eggAction });
    // }
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

  defaultAction = () => {
    this.play(CHARACTER_STATE_DEFAULT, { loop: true });
  };

  render() {
    const { characterState, character } = this.state;

    return (
      <View style={styles.mainArea}>
        {characterState === CHARACTER_STATE_WALKING ||
        characterState === CHARACTER_STATE_DEFAULT ? (
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
              rows={18}
              animations={{
                // egg: [0, 1, 2, 3],
                [CHARACTER_STATE_DEFAULT]: [4, 5, 6, 7],
                [CHARACTER_STATE_WALKING]: [4, 5, 6, 7],
                [CHARACTER_STATE_THIRSTY]: [8, 9, 10, 11],
                [CHARACTER_STATE_EVOLVING]: [12, 13, 14, 15]
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

export default MainArea;
