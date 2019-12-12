import React, { Component } from "react";
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

class DescriptionArea extends Component {
  render() {
    return (
      <View style={styles.descriptionArea}>
        <Text>설명</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  descriptionArea: {
    height: "10%",
    width: "100%",
    position: "absolute",
    backgroundColor: "#eee",
    bottom: 0,
    zIndex: 2
  }
});

export default DescriptionArea;
