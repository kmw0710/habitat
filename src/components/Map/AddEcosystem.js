import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, Button } from 'react-native';
import Swiper from 'react-native-swiper';
import LocationSensor from './LocationSensor'

export default class AddEcosystem extends Component {
  static navaigationOptions = {
    title: 'Choose your Ecosystem!'
  }

  constructor(props){
    super(props);
    this.state = {
      index: 0,
      ecosystems: [0, 1, 2]
    }
  }

  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
        <Swiper
          index={this.state.index}
          horizontal={true}
          onIndexChanged={(index) => this.setState({index: index, toggleShow: false})}
          loop={false}
        >
            {this.state.ecosystems.map(ecosystem => (
              <Image source={backgrounds[ecosystem][1]}>
                <LocationSensor img={ecosystem} version={2}/>
                <LocationSensor img={ecosystem} version={3}/>
                <LocationSensor img={ecosystem} version={3}/>
                <LocationSensor img={ecosystem} version={3}/>
                <LocationSensor img={ecosystem} version={3}/>
                <LocationSensor img={ecosystem} version={3}/>
                <LocationSensor img={ecosystem} version={2}/>
                <LocationSensor img={ecosystem} version={2}/>
                <LocationSensor img={ecosystem} version={2}/>
              </Image>
            ))}
      </Swiper>
      <Button
        onPress={() => {navigate('Title', {
          avatar: this.props.navigation.state.params.avatar,
          eco: this.state.index
        })}}
        title="press me"
      />
      </View>
    )
  }
}

const ecobuddies = [
  [
    [0, require("../assets/habit@/starfish-gray.png")],
    [1, require("../assets/habit@/starfish-sm.png")],
    [2, require("../assets/habit@/starfish-md.png")],
    [3, require("../assets/habit@/starfish-lg.png")]
  ],
  [
    [0, require("../assets/habit@/butterfly-gray.png")],
    [1, require("../assets/habit@/butterfly-sm.png")],
    [2, require("../assets/habit@/butterfly-md.png")],
    [3, require("../assets/habit@/butterfly-lg.png")]
  ],
  [
    [0, require("../assets/habit@/ladybug-gray.png")],
    [1, require("../assets/habit@/ladybug-sm.png")],
    [2, require("../assets/habit@/ladybug-md.png")],
    [3, require("../assets/habit@/ladybug-lg.png")]
  ]
]

const backgrounds = [
  [0, require("../assets/habit@/water-bg.png")],
  [1, require("../assets/habit@/sky-bg.png")],
  [2, require("../assets/habit@/leaf-bg.png")],
]
