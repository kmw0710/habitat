import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, Image, Dimensions, TextInput, Button} from "react-native";
import { StackNavigator, NavigationActions } from 'react-navigation';



export default class Title extends React.Component {
  static navigationOptions = {
    title: 'Give your ecosystem a name!'
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    let avatar = this.props.navigation.state.params.avatar || 0;
    let eco = this.props.navigation.state.params.eco || 0;
    return (
      <Image style={styles.container} source={backgrounds[eco][1]}>
        <Image source={images[avatar][1]} style={styles.ecobuds}/>
        <TextInput
          style={styles.input}
          onChangeText={(e) => this.setState({title: e})}
          value={this.state.title}
        />
        <TextInput
          style={styles.input}
          onChangeText={(e) => this.setState({description: e})}
          value={this.state.description}
        />
        <Button
          onPress={() => navigate('Location', {eco: eco, avatar: avatar, title: this.state.title, description: this.state.description})}
          title="Next"
          color="#841584"
        />
      </Image>
    );
  }
}

const images = [
  [0, require("../assets/Ecosystem/home.png")],
  [1, require("../assets/Ecosystem/work.png")],
  [2, require("../assets/Ecosystem/gym.png")]
]

const backgrounds = [
  [0, require("../assets/habit@/water-bg.png")],
  [1, require("../assets/habit@/sky-bg.png")],
  [2, require("../assets/habit@/leaf-bg.png")],
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    left: -50
  },
  ecobuds: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  input: {
    height: 40,
    backgroundColor: '#99CCFF',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'black',
    width: 150,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center'
  }
})
