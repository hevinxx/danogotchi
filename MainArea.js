import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Button,
  Image,
  Text,
  Easing,
  TouchableOpacity
} from "react-native";
import SpriteSheet from "rn-sprite-sheet";
import {
  CHARACTER_STATE_DEFAULT,
  CHARACTER_STATE_WALKING,
  CHARACTER_STATE_DESIRING,
  CHARACTER_STATE_THIRSTY,
  CHARACTER_STATE_EVOLVING,
  CHARACTER_STATE_HAPPY,
  CHARACTER_STATE_FINDING,
  CHARACTER_STATE_DRINKING,
  THRESHOLD_BETTER,
  THRESHOLD_BEST,
  EGG,
  HATCHING,
  BORN
} from "./Constants";

const getSpriteIndex = (growthStage, state) => {
  let startIndex = 0;
  if (growthStage === 0) {
    if (state === CHARACTER_STATE_WALKING) {
      startIndex = 8;
    } else if (
      state === CHARACTER_STATE_THIRSTY ||
      state === CHARACTER_STATE_DESIRING
    ) {
      startIndex = 28;
    } else if (state === CHARACTER_STATE_EVOLVING) {
      startIndex = 16;
    } else if (state === CHARACTER_STATE_HAPPY) {
      startIndex = 20;
    } else if (state === CHARACTER_STATE_FINDING) {
      startIndex = 8;
    } else if (state === CHARACTER_STATE_DRINKING) {
      startIndex = 12;
    } else {
      startIndex = 8;
    }
  } else if (growthStage === 1) {
    if (state === CHARACTER_STATE_WALKING) {
      startIndex = 32;
    } else if (
      state === CHARACTER_STATE_THIRSTY ||
      state === CHARACTER_STATE_DESIRING
    ) {
      startIndex = 48;
    } else if (state === CHARACTER_STATE_EVOLVING) {
      startIndex = 36;
    } else if (state === CHARACTER_STATE_HAPPY) {
      startIndex = 40;
    } else if (state === CHARACTER_STATE_FINDING) {
      startIndex = 32;
    } else {
      startIndex = 32;
    }
  } else {
    if (state === 2) {
      startIndex = 52;
    } else if (
      state === CHARACTER_STATE_THIRSTY ||
      state === CHARACTER_STATE_DESIRING
    ) {
      startIndex = 68;
    } else if (state === CHARACTER_STATE_EVOLVING) {
      startIndex = 56;
    } else if (state === CHARACTER_STATE_HAPPY) {
      startIndex = 60;
    } else if (state === CHARACTER_STATE_FINDING) {
      startIndex = 52;
    } else {
      startIndex = 52;
    }
  }
  return startIndex;
};

const getAnimationFrame = idx => [idx, idx + 1, idx + 2, idx + 3];

const getAnimationName = (growthStage, state) => {
  return growthStage.toString() + state;
};

class MainArea extends Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "3",
    bgPos: new Animated.Value(0),

    growthStage: this.props.growthStage,
    characterState: this.props.characterState,
    bubble: ""
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return {
      ...(nextProps.growthStage !== prevState.growthStage && {
        growthStage: nextProps.growthStage
      }),
      ...(nextProps.characterState !== prevState.characterState && {
        characterState: nextProps.characterState
      }),
      ...(nextProps.bubble !== prevState.bubble && { bubble: nextProps.bubble })
    };
  };

  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.hachingLevel !== BORN) {
      this.play(this.props.hachingLevel === EGG ? "hatch1" : "hatch2", {
        loop: true
      });
      return;
    }
    this.play(
      getAnimationName(this.state.growthStage, this.state.characterState),
      { loop: true }
    );

    if (this.state.characterState === CHARACTER_STATE_WALKING) {
      this.animate = Animated.loop(
        Animated.timing(this.state.bgPos, {
          duration: 12000,
          toValue: -3375,
          easing: Easing.linear
        })
      );
      this.animate.start();
    } else {
      if (this.animate) this.animate.stop();
    }
  };
  onPress = () => {
    if (this.props.hachingLevel !== BORN) {
      this.props.actions.hatch();
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

  defaultAction = () => {
    this.play(
      getAnimationName(this.state.growthStage, CHARACTER_STATE_DEFAULT),
      { loop: true }
    );
  };

  render = () => {
    const { characterState, growthStage } = this.state;
    console.log(characterState);
    return (
      <View style={styles.mainArea}>
        {this.props.hachingLevel !== BORN ? (
          <View>
            <Image
              source={require("./assets/Deselect.png")}
              style={styles.bornBackGround}
            />
          </View>
        ) : null}
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
          <TouchableOpacity onPress={this.onPress}>
            <View style={styles.bubbleContainer}>
              {/* <Image source={require("./assets/icon.png")} /> */}
            </View>

            <SpriteSheet
              ref={ref => (this.character = ref)}
              source={require("./assets/danogotchi_character_last.png")}
              columns={4}
              rows={18}
              animations={{
                hatch1: [0, 1, 2, 3],
                hatch2: [4, 5, 6, 7],
                [getAnimationName(
                  0,
                  CHARACTER_STATE_DEFAULT
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_DEFAULT)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_WALKING
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_WALKING)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_DESIRING
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_DESIRING)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_THIRSTY
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_THIRSTY)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_EVOLVING
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_EVOLVING)
                ),
                [getAnimationName(0, CHARACTER_STATE_HAPPY)]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_HAPPY)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_FINDING
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_FINDING)
                ),
                [getAnimationName(
                  0,
                  CHARACTER_STATE_DRINKING
                )]: getAnimationFrame(
                  getSpriteIndex(0, CHARACTER_STATE_DRINKING)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_DEFAULT
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_DEFAULT)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_WALKING
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_WALKING)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_DESIRING
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_DESIRING)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_THIRSTY
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_THIRSTY)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_EVOLVING
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_EVOLVING)
                ),
                [getAnimationName(1, CHARACTER_STATE_HAPPY)]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_HAPPY)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_FINDING
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_FINDING)
                ),
                [getAnimationName(
                  1,
                  CHARACTER_STATE_DRINKING
                )]: getAnimationFrame(
                  getSpriteIndex(1, CHARACTER_STATE_DRINKING)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_DEFAULT
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_DEFAULT)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_WALKING
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_WALKING)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_DESIRING
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_DESIRING)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_THIRSTY
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_THIRSTY)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_EVOLVING
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_EVOLVING)
                ),
                [getAnimationName(2, CHARACTER_STATE_HAPPY)]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_HAPPY)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_FINDING
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_FINDING)
                ),
                [getAnimationName(
                  2,
                  CHARACTER_STATE_DRINKING
                )]: getAnimationFrame(
                  getSpriteIndex(2, CHARACTER_STATE_DRINKING)
                )
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
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
  character: {},
  bornBackGround: {
    zIndex: 10
  }
});

export default MainArea;
