import React, { Component } from "react";
import { Image, StyleSheet, View, Text } from "react-native";

class DescriptionArea extends Component {
  render() {
    return (
      <View style={styles.descriptionArea}>
        <Image source={require("./assets/black_box.png")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  descriptionArea: {
    height: "100%",
    width: "100%",
    top: 0,
    bottom: 0,
    position: "absolute",
    bottom: 0
  }
});

export default DescriptionArea;
