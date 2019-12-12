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
import SpriteSheet from "rn-sprite-sheet";
import MainArea from "./MainArea";
import DescriptionArea from "./DescriptionArea";

class MainView extends React.Component {
  render = () => {
    return (
      <View style={{ flex: 1 }}>
        <MainArea />
        {/* <DescriptionArea /> */}
      </View>
    );
  };
}

export default MainView;
