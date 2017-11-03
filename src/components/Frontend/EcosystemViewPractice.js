import React, { Component } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image, PanResponder, Easing, TouchableOpacity } from 'react-native';


const { width, height } = Dimensions.get("window");

const ceiling = height * 1/3 - 50;
const sides = width - 50;

export default class EcosystemViewPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      deadPosition: new Animated.ValueXY({x: Math.random() * 100, y: 150}),
      position: new Animated.ValueXY({x: Math.random() * 100, y: Math.random() * 100}),
      inProgress: new Animated.ValueXY({x: Math.random() * 100, y: Math.random() * 100}),
      giftPosition: new Animated.ValueXY({x: Math.random() * 100, y: 300}),
      hatchedPosition: new Animated.ValueXY({x: Math.random() * 100, y: 200}),
      version: props.version
    }
    this.animate = this.animate.bind(this);
    this.animate2 = this.animate2.bind(this);
    this.animate3 = this.animate3.bind(this);
    this.hatchGift = this.hatchGift.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  componentDidMount() {
    if (this.state.version === 2 || this.state.version === 3) {
      this.animate();
    } else if (this.state.version === 0 || this.state.version === 4) {
      this.animate2();
    } else {
      // version === 0
      console.log('should trigger')
      this.animate3();
    }
  }

  animate() {
    Animated.timing(this.state.position, {
			toValue: ({x: Math.random() * 150, y: Math.random() * 200}),
			duration: 3000,
      delay: Math.random() * 1000,
      userNativeDriver: true
		}).start(() => this.animate());
  }

  animate2() { //positive
    Animated.timing(this.state.deadPosition, {
      toValue: ({x: -100 * Math.random() * 0.9, y: 150 + Math.random() * 50}),
      duration: 5000,
      delay: Math.random() * 1000 + 500
    }).start(() => this.animate2());
  }

  animate3() { //positive
    Animated.timing(this.state.inProgress, {
      toValue: ({x: 100 + Math.random() * 100, y: 100 + Math.random() * 30}),
      duration: 2000
    }).start(() => this.animate3());
  }
  
  animateGift() {
    Animated.timing(this.state.hatchedPosition, {
      toValue: ({x: 100 + Math.random() * 100, y: 100 + Math.random() * 30}),
      duration: 2000
    }).start(() => this.animateGift());
  }

  hatchGift() {
    this.setState({
      version: 6,
      hatchedPosition: this.state.giftPosition
    }, () => {
      this.shouldComponentUpdate(true)
      this.animateGift()
    })
  }

  shouldComponentUpdate(x) {
    if (x) {
      return true;
    } else {
      return false; 
    }
  }

  render() {
    if (this.state.version === 2 || this.state.version === 3) { //complete and upgrade
      return (
        <View>
          <Animated.View style={this.state.position.getLayout()}>
            <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
              <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
            </View>
          </Animated.View>
        </View>
      )
    } else if (this.state.version === 1) { //in progress
      return (
        <View>
          <Animated.View style={this.state.inProgress.getLayout()}>
            <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
              <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
            </View>
          </Animated.View>
        </View>
      )
    } else if (this.state.version === 5) { //gift
      return (
        <View>
          <TouchableOpacity onPress={ this.hatchGift }>
          <Animated.View style={this.state.giftPosition.getLayout()}>
            <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
              <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
            </View>
          </Animated.View>
          </TouchableOpacity>
        </View>
      )
    } else if (this.state.version === 6) { //hatched
      console.log('in render', this.state.version)
      return (
        <View>
          <Animated.View style={this.state.hatchedPosition.getLayout()}>
            <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
              <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
            </View>
          </Animated.View>
        </View>
      )  
    } else { //dead
      return ( 
        <View>
        <Animated.View style={this.state.deadPosition.getLayout()}>
          <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
            <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
          </View>
        </Animated.View>
      </View>
      )
    }


    // return (
    //   this.state.version === 5 ? ( //gift
    //     <View>
    //       <TouchableOpacity onPress={this.hatchGift}>
    //         <Animated.View style={this.state.position.getLayout()}>
    //           <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
    //             <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
    //           </View>
    //         </Animated.View>
    //       </TouchableOpacity>
    //     </View>
    //   ) : this.state.version === 2 || this.state.version === 3 ? (
    //     <View>
    //       <Animated.View style={this.state.position.getLayout()}>
    //         <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
    //           <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
    //         </View>
    //       </Animated.View>
    //     </View>
    //   ) : this.state.version === 1 ? (
    //     <View>
    //       <Animated.View style={this.state.inProgress.getLayout()}>
    //         <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
    //           <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
    //         </View>
    //       </Animated.View>
    //     </View>
    //   ) : (
        // <View>
        //   <Animated.View style={this.state.deadPosition.getLayout()}>
        //     <View style={{width: sizeKey[this.state.version], height: sizeKey[this.state.version]}}>
        //       <Image source={ecobuddies[this.props.img][this.state.version][1]} style={{resizeMode: 'contain', width: "100%", height: "100%"}}/>
        //     </View>
        //   </Animated.View>
        // </View>
    //   )
    // )
  }
}

const sizeKey = {
  0: 25, // dead
  1: 10, // inprogress
  2: 25, // complete
  3: 50, // complete upgrade
  4: 50,  // dead upgrade
  5: 50, // gift
  6: 50 //hatched
}

const styles = StyleSheet.create({
  ball: {
    height: 40,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  },
  square: {
      height: 60,
      width: 60,
      borderWidth: 30,
      borderColor: 'red'
  },
  image: {
    width: 100,
    height: 100
  }
})

const ecobuddies = [
  [
    [0, require("../assets/habit@/starfish-gray.png")],
    [1, require("../assets/habit@/starfish-sm.png")],
    [2, require("../assets/habit@/starfish-md.png")],
    [3, require("../assets/habit@/starfish-lg.png")],
    [4, require("../assets/habit@/starfish-gray.png")],
    [5, require("../assets/habit@/gift.png")],
    [6, require("../assets/habit@/starfish-gift.png")]
  ],
  [
    [0, require("../assets/habit@/butterfly-gray.png")],
    [1, require("../assets/habit@/butterfly-sm.png")],
    [2, require("../assets/habit@/butterfly-md.png")],
    [3, require("../assets/habit@/butterfly-lg.png")],
    [4, require("../assets/habit@/butterfly-gray.png")],
    [5, require("../assets/habit@/gift.png")],
    [6, require("../assets/habit@/butterfly-gift.png")],
  ],
  [
    [0, require("../assets/habit@/ladybug-gray.png")],
    [1, require("../assets/habit@/ladybug-sm.png")],
    [2, require("../assets/habit@/ladybug-md.png")],
    [3, require("../assets/habit@/ladybug-lg.png")],
    [0, require("../assets/habit@/ladybug-gray.png")],
    [5, require("../assets/habit@/gift.png")],
    [6, require("../assets/habit@/ladybug-gift.png")],
  ]
]
