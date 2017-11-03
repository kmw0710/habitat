import React, { Component } from 'react';
import { StyleSheet, View, Text, Separator, Dimensions, ScrollView, Button, Image, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackNavigator, NavigationActions } from 'react-navigation';

class TutorialView extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Swiper
          /* index={this.state.index} */
          style={{marginTop: 22}}
          horizontal={true}
          loop={false}
        >
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
            <Image style={{width: Dimensions.get('window').width - 60, height: Dimensions.get('window').height - 100}} source={tutorial[0][1]}/>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: Dimensions.get('window').width - 60, height: Dimensions.get('window').height - 100}} source={tutorial[1][1]}/>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: Dimensions.get('window').width - 60, height: Dimensions.get('window').height - 100}} source={tutorial[2][1]}/>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: Dimensions.get('window').width - 60, height: Dimensions.get('window').height - 100}} source={tutorial[3][1]}/>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: Dimensions.get('window').width - 60, height: Dimensions.get('window').height - 100}} source={tutorial[4][1]}/>
          </View>
        </Swiper>
        <Button
          title="Start Adding Locations"
          onPress={() => navigate('Map')}
        />
      </View>
    )
  }
}

export default TutorialView;

const tutorial = [
  [0, require("../assets/tutorialpictures/tutorial-navigation.png")],
  [1, require("../assets/tutorialpictures/tutorial-taskbuilder.png")],
  [2, require("../assets/tutorialpictures/tutorial-yaynay.png")],
  [3, require("../assets/tutorialpictures/tutorial-editdelete.png")],
  [4, require("../assets/tutorialpictures/tutorial-timer.png")]
]