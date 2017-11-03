import React, { Component } from 'react';
import { Constants, Audio } from 'expo';
import { View, Text, Image, TouchableOpacity, StyleSheet, Picker, Button } from 'react-native';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import EcosystemViewPractice from '../Frontend/EcosystemViewPractice'
// import convertDate from '../Frontend/convertDate'

export default class Timer extends Component {
    constructor(props) {
        super (props);
        this.state = {
          fill: 0,
          hour: 0,
          minute: 0,
          second: 0,
          toggleTimer: false,
          duration: 0,
          timeRemaining: 0,
          interval: null,
          setTimeout: null,
          userID: null,
          negativePoints: null,
          mdPositivePoints: null,
          lgPositivePoints: null,
          currentImageIndex: null,
          mdUpgrade: false,
          lgUpgrade: false,
          render: false
      }
      this.calculateTime = this.calculateTime.bind(this);
      this.eachPie = this.eachPie.bind(this);
      this.startTimer = this.startTimer.bind(this);
    };

    startTimer() {
      var hoursInMSec = this.state.hour * 3600000;
      var minsInMSec = this.state.minute * 60000;
      var secsInMSec = this.state.second * 1000;
      var duration = hoursInMSec + minsInMSec + secsInMSec;
      this.setState({
        toggleTimer: !this.state.toggleTimer
      }, () => {

        if (this.state.toggleTimer && duration !== 0) {
          let startTime = new Date();
          this.setState({
            interval: setInterval(this.calculateTime.bind(this, startTime, duration), 500)
          }, () => {
            this.setState({
              setTimeout: setTimeout(() => {
                this.trainWhistle()
                clearInterval(this.state.interval);
                this.setState({
                  hour: 0,
                  minute: 0,
                  second: 0,
                  fill: 0,
                  timePassed: 0
                }, () => {
                  if (this.state.mdUpgrade) {
                    var mdPositivePoints = this.state.mdPositivePoints + 1;
                    var lgPositivePoints = this.state.lgPositivePoints;
                  } else if (this.state.lgUpgrade) {
                    var mdPositivePoints = this.state.mdPositivePoints;
                    var lgPositivePoints = this.state.lgPositivePoints + 1;
                  }
                  this.setState({
                    duration: 0,
                    toggleTimer: false,
                    mdPositivePoints: mdPositivePoints,
                    lgPositivePoints: lgPositivePoints
                  }, () => {
                    axios.put('https://naturalhabitat.herokuapp.com/postimer', {
                      user_ID: this.state.userID,
                      Medium_Positive_Points: this.state.mdPositivePoints,
                      Large_Positive_Points: this.state.lgPositivePoints
                    })
                    .then(res => console.log(res))
                    .catch(err => console.error(err))
                  })
                })
              }, duration + 500)
            })
          })
        } else {
          clearInterval(this.state.interval);
          clearTimeout(this.state.setTimeout);
          this.setState({
            hour: 0,
            minute: 0,
            second: 0,
            fill: 0,
            timePassed: 0
          }, () => {
            this.setState({
              duration: 0,
              negativePoints: this.state.negativePoints + 1
            }, () => {
              axios.put('https://naturalhabitat.herokuapp.com/negtimer', {
                user_ID: this.state.userID,
                Negative_Points: this.state.negativePoints
              })
              .then(res => console.log('axios put worked'))
              .catch(err => console.error(err))
            })
          })
        }
      });
    };

    calculateTime(startTime, duration) {
      //get start time which is current time when onpress of timer dude
      let currentTime = new Date();
      this.setState({
        duration,
        mdUpgrade: (duration < 1800000),
        lgUpgrade: (duration >= 1800000)
      });
      let timePassed = currentTime.getTime() - startTime.getTime();
      let timeRemaining = Math.round((duration - timePassed + 400) / 1000);
      if (timeRemaining < 23 && timeRemaining > 21) {
        this.clockTick();
      }
      this.setState({timeRemaining})
      let percentage = (timePassed / duration);
      this.setState({ fill: percentage })
    };

    eachPie(percentage) {
      return <Progress.Pie style={{alignItems: 'center', opacity: 0.3}} progress={percentage} size={130} />
    };

    trainWhistle = async () => {
      await Audio.setIsEnabledAsync(true);
      let sound = new Audio.Sound();
      await sound.loadAsync(sounds[1][1]);
      await sound.playAsync();
    };

    clockTick = async () => {
      await Audio.setIsEnabledAsync(true);
      let sound = new Audio.Sound();
      await sound.loadAsync(sounds[0][1]);
      await sound.playAsync();
    };

    componentDidMount() {
      this.setState({
        userID: this.props.screenProps.userID,
        currentImageIndex: Math.floor(Math.random()*3)
      }, () => {
        axios.get('https://naturalhabitat.herokuapp.com/timer', {
          params: {
            User_ID: this.state.userID
          }
        })
        .then(res => {
          this.setState({
            render: true,
            negativePoints: res.data[0].Negative_Points,
            mdPositivePoints: res.data[0].Medium_Positive_Points,
            lgPositivePoints: res.data[0].Large_Positive_points
          })
        })
        .catch(err => console.error(err));
      })
    };

    render() {
      const hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      minutes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27','28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
      seconds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27','28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];
        // let clock = this.props.task.Start.split(' ')[3].split(':')[0];
      let lgImageNumber = this.state.lgPositivePoints;
      let mdImageNumber = this.state.mdPositivePoints;
      let grayImageNumber = this.state.negativePoints;
      let lgImageArray = new Array(lgImageNumber);
      lgImageArray.fill(2);
      let mdImageArray = new Array(mdImageNumber);
      mdImageArray.fill(1)
      let grayImageArray = new Array(grayImageNumber);
      grayImageArray.fill('boo');

      return (
        <View>
          <View style={{margin: -10, marginLeft: 5, marginTop: 20, alignItems: 'flex-start'}}>
          <Button
            onPress={() => this.props.navigation.navigate('DrawerToggle', {memes: true})}
            title="&#9776;"
          />
        </View>
        {this.state.render ? (
          <View style={styles.container}>
            <View style={styles.ecosystem}>
              <Image style={{height: 300, width: 300}} source={backgrounds[this.state.currentImageIndex][1]}>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                  {this.state.duration ?
                    <Image
                      style={{height: 60, width: 60}}
                      source={require("../assets/habit@/sun.png")}
                    /> : null
                  }
                  {this.state.lgPositivePoints ?
                    lgImageArray.map((lgImage, i) => {
                      return (
                      <EcosystemViewPractice img={this.state.currentImageIndex} key={i} version={3}/>
                    )})
                  : null
                  }
                  {this.state.mdPositivePoints ?
                    mdImageArray.map((mdImage, i) => (
                      <EcosystemViewPractice img={this.state.currentImageIndex} key={i} version={2}/>
                    ))
                  : null
                  }
                  {this.state.negativePoints ?
                    grayImageArray.map((grayImage, i) => (
                      <EcosystemViewPractice img={this.state.currentImageIndex} key={i} version={0}/>
                    ))
                  : null
                  }
                </View>
              </Image>
            </View>
            <View>
              <TouchableOpacity
                onPress={this.startTimer}>
                <Image source={require("../assets/habit@/timer.png")} style={{height: 130, width: 130, marginTop: 20, resizeMode: 'contain'}}>
                  {this.eachPie(this.state.fill)}
                </Image>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <View style={{justifyContent: 'center', marginHorizontal: 20}}>
                <Text style={{textAlign: 'center'}}>Hours{'\n'}</Text>
                <Picker
                  style={[styles.picker]} itemStyle={styles.pickerItem}
                  selectedValue={this.state.hour}
                  onValueChange={(itemValue) => this.setState({hour: itemValue})}
                >
                  {hours.map((hour, i) => (
                    <Picker.Item key={i} label={hour} value={hour}/>
                  ))}
                </Picker>
              </View>
              <View style={{justifyContent: 'center', marginHorizontal: 20}}>
                <Text style={{textAlign: 'center'}}>Minutes{'\n'}</Text>
                <Picker
                  style={[styles.picker]} itemStyle={styles.pickerItem}
                  selectedValue={this.state.minute}
                  onValueChange={(itemValue) => this.setState({minute: itemValue})}
                >
                  {minutes.map((minute, i) => (
                    <Picker.Item key={i} label={minute} value={minute}/>
                  ))}
                </Picker>
              </View>
              <View style={{justifyContent: 'center', marginHorizontal: 20}}>
                <Text style={{textAlign: 'center'}}>Seconds{'\n'}</Text>
                <Picker
                  style={[styles.picker]} itemStyle={styles.pickerItem}
                  selectedValue={this.state.second}
                  onValueChange={(itemValue) => this.setState({second: itemValue})}
                >
                  {seconds.map((second, i) => (
                    <Picker.Item key={i} label={second} value={second}/>
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{marginTop: 100}}>
              <Text>
                T-MINUS : {this.state.timeRemaining} Seconds
              </Text>
            </View>
          </View>
        ) : null}
        </View>
      )
    }
}

const ecobuddies = [
  {buddy: 'Butterflies',
   images: [
    [0, require("../assets/habit@/butterfly-sm.png")],
    [1, require("../assets/habit@/butterfly-md.png")],
    [2, require("../assets/habit@/butterfly-lg.png")],
    [3, require("../assets/habit@/butterfly-gray.png")]
  ]},
  {buddy: 'LadyBugs',
   images: [
    [0, require("../assets/habit@/ladybug-sm.png")],
    [1, require("../assets/habit@/ladybug-md.png")],
    [2, require("../assets/habit@/ladybug-lg.png")],
    [3, require("../assets/habit@/ladybug-gray.png")]
  ]},
  {buddy: 'SeaStars',
   images: [
    [0, require("../assets/habit@/starfish-sm.png")],
    [1, require("../assets/habit@/starfish-md.png")],
    [2, require("../assets/habit@/starfish-lg.png")],
    [3, require("../assets/habit@/starfish-gray.png")]
  ]}
];

const backgrounds = [
  [0, require("../assets/habit@/water-bg.png")],
  [1, require("../assets/habit@/sky-bg.png")],
  [2, require("../assets/habit@/leaf-bg.png")],
]

const styles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 120,
    //  borderColor: 'red',
    borderWidth: 0.5,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  container: {
    // flex: 1,
    alignItems: 'center',
    // alignContent: 'space-between',
    padding: Constants.statusBarHeight,
    backgroundColor: 'white'
  },
  pickerContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  picker: {
    width: '100%',
    height: 'auto',
    // backgroundColor: '#FFF0E0',
    // borderColor: 'red',
    borderBottomWidth: 2,
    flex: 1,
    alignSelf: 'center'
  },

  pickerItem: {
    height: 100,
    color: 'red', 
    width: '100%'
  },

  arrowWrapper: {
    // backgroundColor: '#FFF0E0',
    flex: 10,
    height: 40,
    marginLeft: -28,
    justifyContent: 'center'
  },

  arrow: {
    textAlign: 'center',
    color: 'red',
  }
})

const sounds = [
  [0, require("../assets/sounds/tickingclock.mp3")],
  [1, require("../assets/sounds/trainwhistle.mp3")],
  [2, require("../assets/Ecosystem/gym.png")],
  [3, require("../assets/Ecosystem/currentlocation.png")]
];
