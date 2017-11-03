import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Animated, Easing, Text } from 'react-native';
import EcosystemViewPractice from './EcosystemViewPractice'

export default class EcosystemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: this.props.location,
      upgradeImages: [],
      posImages: [],
      downgradeImages: [],
      negImages: []
      // fadeAnim: new Animated.Value
    }
    // this.animatedValue = new Animated.Value(0)

  }

  componentWillReceiveProps(oldprops) {
    if (this.props.id === this.props.index - 1) {
      this.calculate()
    }
  }

  componentDidMount() {
    if (this.props.id === this.props.index) {
      this.calculate()
    }
  }

  calculate() {
    let upgradeImageNumber = Math.floor(this.state.location.PositivePoints/10);
    let positiveImageNumber = this.state.location.PositivePoints%10;
    let downgradeImageNumber = Math.floor(this.state.location.NegativePoints/4);
    let negativeImageNumber = this.state.location.NegativePoints%4;

    upgradeImages = new Array(this.state.upgradeImageNumber);
    upgradeImages.fill(this.state.location.Ecosystem);
    posImages = new Array(this.state.positiveImageNumber);
    posImages.fill(this.state.location.Ecosystem)
    downgradeImages = new Array(this.state.downgradeImageNumber);
    downgradeImages.fill(this.state.location.Ecosystem);
    negImages = new Array(this.state.negativeImageNumber);
    negImages.fill(this.state.location.Ecosystem);

    this.setState({
      upgradeImages: upgradeImages,
      posImages: posImages,
      downgradeImages: downgradeImages,
      negImages: negImages,
      upgradeImageNumber: upgradeImageNumber,
      positiveImageNumber: positiveImageNumber,
      downgradeImageNumber: downgradeImageNumber,
      negativeImageNumber: negativeImageNumber
    })
  }


  test() {
    if(this.props.id === this.props.index) {
      console.log('TRUEEEEEEEEEE')
    }
  }



  render() {
    // console.log(this.state.location, 'locationtionaoin')
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={images[this.state.location.Avatar][1]}
          style={{width: 50, height: 50, resizeMode: 'contain'}}
        />
        <Text style={styles.cardtitle}>
          {this.state.location.Marker_Title}
        </Text>
        <Text style={styles.cardDescription}>
          {this.state.location.Marker_Description}
        </Text>

       <Image style={{height: '60%', width: '100%', position: 'relative', resizeMode: 'contain'}} source={{uri: 'https://www.nature.org/cs/groups/webcontent/@web/@westvirginia/documents/media/panther-knob-1500x879.jpg'}}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {this.state.location.tasks ? (
          this.state.location.tasks.map((task, i) => {
            return (<Image
              key={i}
              source={ecobuddies[task.Ecosystem][1][1]}
              style={{width: 50, height: 50}}
            />
          )})
        ) : null}
        {this.state.upgradeImageNumber > 0 ?
          this.state.upgradeImages.map((img, i) => {
              return (<Image
                key={i}
                source={ecobuddies[img][2][1]}
                style={{width: 100, height: 100}}
              />
           )})
         : null}
        {this.state.location.PositivePoints ?
          this.state.posImages.map((img, i) => (
              <EcosystemViewPractice img={img} key={i}/>
            )
          )
         : null}
         {this.state.downgradeImageNumber > 0 ?
           this.state.downgradeImages.map((img, i) => (
              <Image
                key={i}
                source={ecobuddies[img][0][1]}
                style={{width: 100, height: 100}}
              />
            ))
         : null}
         {this.state.location.NegativePoints ?
           this.state.negImages.map((img, i) => (
              <Image
                key={i}
                source={ecobuddies[img][0][1]}
                style={{width: 50, height: 50}}
              />
            ))
         : null}
         </View>
         </Image>
      </View>
    )
  }
}

const toast = [
  [0, require("../assets/Ecosystem/toast0.png")],
  [1, require("../assets/Ecosystem/toast1.png")],
  [2, require("../assets/Ecosystem/toast2.png")]
];

const tree = [
  [0, require("../assets/Ecosystem/tree0.png")],
  [1, require("../assets/Ecosystem/tree1.png")],
  [2, require("../assets/Ecosystem/tree2.png")]
];

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

const images = [
  [0, require("../assets/Ecosystem/home.png")],
  [1, require("../assets/Ecosystem/work.png")],
  [2, require("../assets/Ecosystem/gym.png")],
  [3, require("../assets/Ecosystem/currentlocation.png")]
];









// let location = this.props.location;
// let upgradeImageNumber = Math.floor(location.PositivePoints/10);
// let positiveImageNumber = location.PositivePoints%10;
// let downgradeImageNumber = Math.floor(location.NegativePoints/4);
// let negativeImageNumber = location.NegativePoints%4;
// upgradeImages = new Array(upgradeImageNumber);
// upgradeImages.fill(1);
// posImages = new Array(positiveImageNumber);
// posImages.fill(2)
// downgradeImages = new Array(downgradeImageNumber);
// downgradeImages.fill(3);
// negImages = new Array(negativeImageNumber);
// negImages.fill(0);
// return (
//   <Image style={{height: '60%', width: '100%'}} source={{uri: 'https://www.nature.org/cs/groups/webcontent/@web/@westvirginia/documents/media/panther-knob-1500x879.jpg'}}>
//   <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
//     <Animated.View
//       style={{
//         opacity: this.state.fadeAnim, // Binds directly
//         transform: [{
//           translateY: this.state.fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
//           }),
//         }],
//       }}
//     />
//     {this.props.location.tasks ? (
//       this.props.location.tasks.map((task, i) => (
//         <Image
//           easing="sin"
//           key={i}
//           source={toast[1][1]}
//           style={{width: 50, height: 50}}
//         />
//       ))
//     ) : null}
//     {upgradeImageNumber > 0 ?
//       upgradeImages.map((img, i) => (
//         <Image
//           key={ i }
//           source={toast[2][1]}
//           style={{width: 100, height: 100}}
//         />
//       ))
//       : null}
//       {this.props.location.PositivePoints ?
//         posImages.map((img, i) => (
//           <Image
//             key={ i }
//             source={toast[2][1]}
//             style={{width: 50, height: 50}}
//           />
//         ))
//         : null}
//         {downgradeImageNumber > 0 ?
//           downgradeImages.map((img, i) => (
//             <Image
//               key={ i }
//               source={toast[0][1]}
//               style={{width: 100, height: 100}}
//             />
//           ))
//           : null}
//           {this.props.location.NegativePoints ?
//             negImages.map((img, i) => (
//               <Image
//                 key={ i }
//                 source={toast[0][1]}
//                 style={{width: 50, height: 50}}
//               />
//             ))
//             : null}
//           </View>
//         </Image>)
