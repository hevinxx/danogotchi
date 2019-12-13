import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Image,
  Easing,
  TouchableOpacity,
  Vibration
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
      startIndex = 72;
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
    if (state === CHARACTER_STATE_WALKING) {
      startIndex = 76;
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
const getAnimationName = (growthStage, state) => growthStage.toString() + state;

class MainArea extends Component {
  state = {
    loop: true,
    resetAfterFinish: false,
    fps: "3",
    bgPos: new Animated.Value(0),
    itemPos: new Animated.Value(-300)
  };

  /* TODO: 언제 애니메이션 시작? */
  itemAnimate = Animated.timing(this.state.itemPos, {
    duration: 3000,
    toValue: 100,
    easing: Easing.linear
  });

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.data.hatchingLevel !== BORN) {
      this.bornBg.play({
        type: "default",
        fps: 3,
        resetAfterFinish: true,
        loop: true
      });
      this.play(this.props.data.hatchingLevel === EGG ? "hatch1" : "hatch2", {
        loop: true
      });
      return;
    }

    if (this.props.characterState === CHARACTER_STATE_EVOLVING) {
      this.tadaBg.play({
        type: "default",
        fps: 3,
        resetAfterFinish: true,
        loop: true
      });
      Vibration.vibrate(3000);
    }
    this.play(
      getAnimationName(this.props.data.growthStage, this.props.characterState),
      { loop: true }
    );

    if (this.props.characterState === CHARACTER_STATE_WALKING) {
      this.animate = Animated.loop(
        Animated.timing(this.state.bgPos, {
          duration: 15000,
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
    if (this.props.data.hatchingLevel !== BORN) {
      this.props.actions.hatch();
      return;
    }

    if (this.props.characterState === CHARACTER_STATE_THIRSTY) {
      this.props.actions.drink();
      return;
    }

    if (this.props.characterState === CHARACTER_STATE_DESIRING) {
      this.props.actions.go();
      return;
    }

    this.props.actions.happy();
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
    const { characterState } = this.props;
    console.log(this.props.data);
    console.log(characterState);

    return (
      <View style={styles.mainArea}>
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 10,
            right: this.state.itemPos,
            bottom: 400
          }}
        >
          <Image source={require("./assets/kong.png")} />
        </Animated.View>
        {/* TODO: 배경 로직어떻게 해야..? */}
        {characterState === CHARACTER_STATE_EVOLVING ? (
          <View>
            <SpriteSheet
              ref={ref => (this.tadaBg = ref)}
              source={require("./assets/danogotchi_tada.png")}
              columns={2}
              rows={1}
              animations={{
                default: [0, 1]
              }}
            />
          </View>
        ) : null}
        {this.props.data.isGoing ? (
          <Animated.View
            style={{
              left: this.state.bgPos
            }}
          >
            <Image source={require("./assets/move_bg.png")} />
          </Animated.View>
        ) : (
          <View>
            <SpriteSheet
              ref={ref => (this.bornBg = ref)}
              source={require("./assets/Deselect.png")}
              columns={2}
              rows={1}
              animations={{
                default: [0, 1]
              }}
            />
          </View>
        )}

        <View style={styles.characterContainer}>
          <TouchableOpacity onPress={this.onPress}>
            {characterState === CHARACTER_STATE_DESIRING 
            && !this.props.data.isGoing ? (
              <View style={styles.bubbleContainer}>
                <Image source={require("./assets/want_03_proteinchoco.png")} />
              </View>
            ) : null}
            {characterState === CHARACTER_STATE_THIRSTY
            && !this.props.data.isGoing ? (
              <View style={styles.bubbleContainer}>
                <Image source={require("./assets/want_01_water.png")} />
              </View>
            ) : null}

            <SpriteSheet
              ref={ref => (this.character = ref)}
              source={require("./assets/danogotchi_character_last.png")}
              columns={4}
              rows={20}
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
  bubbleContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: -10
  },
  characterContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "40%"
  },
  character: {},
  bornBackGround: {
    zIndex: 10
  }
});

export default MainArea;
