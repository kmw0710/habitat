import React, { Component } from 'react';
import { StyleSheet, View, Text, Separator, Dimensions, ScrollView, Button, Image, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import Swipeout from 'react-native-swipeout';
import { StackNavigator, NavigationActions } from 'react-navigation';
import profile from './Profile';
import axios from 'axios';
import TutorialView from './TutorialView.js';
import GetCurrentLocation from '../Map/GetCurrentLocation';
import geodist from 'geodist';
import ProgressBar from './ProgressBar'
import convertDate from '../../../server/controllers/convertDate';
// import EcosystemView from './EcosystemView.js'
import EcosystemViewPractice from './EcosystemViewPractice';

export default class EcoSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userID: props.screenProps.userID,
      locations: [],
      render: false,
      index: 0,
      currentTask: '',
      currentTaskId: '',
      currentTaskIndex: '',
      currentTaskCategory: '',
      currentDescription: '',
      currentTaskStart: '',
      currentTaskEnd: '',
      editSpecificTask: '',
      currentLocation: {},
      render: false,
      toggleShow: false,
      positivePoints: 0,
      negativePoints: 0,
      nullPoints: 0,
      giftPoints: 0,
      hatchedGiftPoints: 0,
      completedSun: false
    }
    this.showTask = this.showTask.bind(this);
  }

  componentDidMount() {
    GetCurrentLocation(this.props.screenProps.userID).then(location => {
      this.setState({
        currentLocation: {
          title: 'Current Location',
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        }
      })
    })
    .catch(err => console.error(err))
    this.setState({
      userID: this.props.screenProps.userID,
    }, () => this.getMarkers())
  }



  getMarkers() {
    axios.get('https://naturalhabitat.herokuapp.com/mapMarkers', { params: { userID: this.state.userID, currentDay: true } })
      .then(res => {
        this.setState({ locations: res.data })
      })
      .then(res => this.showCurrentLocation())
      .catch(err => console.error(err))
  }

  showCurrentLocation() {
    let locations = this.state.locations;
    if (locations.length > 0) {
      for (let i = 0; i < locations.length; i++) {
        let dist = geodist({lat: locations[i].Latitude, lon: locations[i].Longitude}, {lat: this.state.currentLocation.latitude, lon: this.state.currentLocation.longitude}, {exact: true, unit: 'km'})
        if (dist < 0.05) {
          this.setState({
            index: i,
            render: true
          })
          break;
        }
        if (i === locations.length - 1) {
          this.setState({render: true})
        }
      }
    } else {
      this.setState({render: true})
    }
  }

  showTask(task, specificTask, indexOfTask) {
    this.setState({
      toggleShow: !this.state.toggleShow,
      currentTask: task.Task_Title,
      currentTaskId: task.Task_ID,
      currentTaskIndex: indexOfTask,
      currentTaskCategory: task.Category,
      currentDescription: task.Task_Description,
      currentTaskStart: task.Start,
      currentTaskEnd: task.End,
      editSpecificTask: specificTask
    })
  }


  editTask(task) {
    this.props.navigation.navigate('TaskBuilder', { specificTask: this.state.editSpecificTask, editing: true })
  }

  deleteTask() {
    axios.delete('https://naturalhabitat.herokuapp.com/deleteTask', {params: {userID: this.state.userID, taskTitle: this.state.currentTask}})
    .then(res => this.getMarkers())
    .catch(err => console.error(err))
  }

  yayTask() {

    if (this.state.locations[this.state.index].tasks[this.state.currentTaskIndex].Completion === "True") {
      Alert.alert('Dont try to cheat');
      return;
    }
    var end = this.state.currentTaskEnd;
    if (convertDate(end) > new Date()) {
      Alert.alert('the task deadline has not ended yet. Wait!')
      return;
    }

    axios.put('https://naturalhabitat.herokuapp.com/yayTask', {
      taskId: this.state.currentTaskId,
      markerId: this.state.locations[this.state.index].Marker_ID,
      positivePoints: positivePoints
    })
    .then((res) => {
      this.markTaskComplete();
    })
    .catch((err) => {
      console.error(err);
    })
  }

  nayTask() {
    if (this.state.locations[this.state.index].tasks[this.state.currentTaskIndex].Completion === "True") {
      Alert.alert('Dont try to cheat');
      return;
    }
    var end = this.state.currentTaskEnd;
    if (convertDate(end) > new Date()) {
      Alert.alert('the task deadline has not ended yet. Wait!')
      return;
    }

    axios.put('https://naturalhabitat.herokuapp.com/nayTask', {
      taskId: this.state.currentTaskId,
      markerId: this.state.locations[this.state.index].Marker_ID,
      negativePoints: negativePoints
    })
    .then((res) => {
      this.markTaskComplete();
    })
    .catch((err) => {
      console.error(err);
    })
  }

  markTaskComplete() {
    this.setState({completedSun: true});
    this.componentDidMount();
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const { navigate } = this.props.navigation;
    const swipeRightBtns = [
      {
        text: 'Edit',
        backgroundColor: '#f4a316',
        underlayColor: 'rgba(0, 0, 0, 0.6)',
        onPress: () => { this.editTask() }
     },
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 0.6)',
        onPress: () => { this.deleteTask() }
     }
    ];
    const swipeLeftBtns = [
      {
        text: 'Yay',
        backgroundColor: 'green',
        underlayColor: 'rgba(0, 0, 0, 0.6)',
        onPress: () => { this.yayTask() }
     },
      {
        text: 'Nay',
        backgroundColor: 'brown',
        underlayColor: 'rgba(0, 0, 0, 0.6)',
        onPress: () => { this.nayTask() }
     }
    ];
    return this.state.render ? (this.state.locations.length > 0 ? (
      <View style={styles.wrapper}>
        <View style={{margin: -10, marginLeft: 5, marginTop: 20, alignItems: 'flex-start'}}>
          <Button
            onPress={() => this.props.navigation.navigate('DrawerToggle', {memes: true})}
            title="&#9776;"
          />
        </View>
        <View style={{flex: 8, marginBottom: 1, height: '75%'}}>
          <Swiper
            index={this.state.index}
            horizontal={true}
            onIndexChanged={(index) => this.setState({index: index, toggleShow: false})}
            loop={false}
          >
            {this.state.locations.map((location, index) => {
              var upgradeImageNumber = Math.floor(location.PositivePoints/10);
              var positiveImageNumber = location.PositivePoints%10;
              var downgradeImageNumber = Math.floor(location.NegativePoints/4);
              var negativeImageNumber = location.NegativePoints%4;
              var giftPointNumber = location.GiftPoints;
              upgradeImages = new Array(upgradeImageNumber);
              upgradeImages.fill(location.Ecosystem);
              posImages = new Array(positiveImageNumber);
              posImages.fill(location.Ecosystem)
              downgradeImages = new Array(downgradeImageNumber);
              downgradeImages.fill(location.Ecosystem);
              negImages = new Array(negativeImageNumber);
              negImages.fill(location.Ecosystem);
              giftImages = new Array(giftPointNumber);
              giftImages.fill(location.Ecosystem);

              return (
              // put backgroundImage in the style
              <View key={index} style={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row', height: 60, marginTop: '20%', marginBottom: 10}}>
                  <Image
                    source={images[location.Avatar][1]}
                    style={{width: 50, height: 50, resizeMode: 'contain'}}
                  />
                  <Image
                    source={require('../assets/habit@/logo.png')}
                    style={{height: 50, width: 100, resizeMode: 'contain'}}
                  />
                </View>
                  <Text style={styles.cardtitle}>
                    {location.Marker_Title}
                  </Text>
                <Text style={styles.cardDescription}>
                  {location.Marker_Description}
                </Text>
                <Image style={{height: '100%', width: '100%'}} source={backgrounds[location.Ecosystem][1]}>
                <View style={{flex: 1, flexDirection:'row', flexWrap: 'wrap'}} >
                  {location.tasks ? (
                    location.tasks.map((task, i) => {
                      if (task.Completion === null) {
                        return (
                          <EcosystemViewPractice img={task.Ecosystem} key={i} version={1}/>
                        )
                      } else {
                        return null
                      }
                    })) : null}
                  {location.PositivePoints ?
                    posImages.map((img, i) => (
                      <EcosystemViewPractice img={img} key={i} version={2}/>
                    ))
                   : null}
                   {downgradeImageNumber > 0 ? (
                    downgradeImages.map((img, i) => {
                      return (
                        <EcosystemViewPractice img={img} key={i} version={4}/>
                      )
                    })
                  ) : null}
                  {upgradeImageNumber > 0 ?
                    upgradeImages.map((img, i) => {
                      return (
                        <EcosystemViewPractice img={img} key={i} version={0}/>
                      )
                    })
                  : null}
                  {location.GiftPoints ?
                    giftImages.map((img, i) => {
                      console.log(location.GiftPoints, 'LOCATION GIFT POINTS')
                      return (
                        <EcosystemViewPractice img={img} key={i} version={5}/>
                      )
                    })
                  : null}

                  </View>
                  </Image>
              </View>
            )})}
          </Swiper>
          {this.state.toggleShow ? (
          <View style={{marginTop: 0, height: 60, backgroundColor: 'rgba(52, 52, 52, 0.05)'}}>
            <Swipeout
              right={swipeRightBtns}
              left={swipeLeftBtns}
              autoClose={true}
              backgroundColor= 'transparent'
            >
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{lineHeight: 0.2, fontSize: 16, fontWeight: 'bold'}}>
                  {this.state.currentTask}
                </Text>
                <Text style={{fontSize: 14, lineHeight: 0.2}}>
                  {this.state.currentDescription}
                </Text>
                <Text style={{margin: 2, lineHeight: 0.2}}>{this.state.currentTaskCategory}</Text>
              </View>
            </Swipeout>
          </View>) : null }
        </View>
        <View style={{flex: 2.5}}>
          <ScrollView horizontal={true}>
            {this.state.locations[this.state.index].tasks ? (
              this.state.locations[this.state.index].tasks.map((task, i) => {
                return <ProgressBar clock={task.Completion} key={i} task={task} locations={this.state.locations}
                  index={this.state.index} showTask={this.showTask} specificIndex={i}
                  showTask={() => this.showTask(task, this.state.locations[this.state.index].tasks[i], i)}/>
              })
          ) : null}
            <TouchableOpacity onPress={() => { navigate('TaskBuilder')}}>
              <Image source={require('../assets/plus.png')} style={{marginTop: 20, height: 135, width: 135, resizeMode: 'contain'}} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    ) :
    <View style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>
      <TutorialView navigation={this.props.navigation} />
      <Button
        title="Map"
        onPress={() => navigate('Map')}
      />
    </View>
  ) :
  <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
    <Image source={require('../assets/loading2.gif')} style={{width: 400, height: 400}}/>
  </View>
  }
}

const ecobuddies = [
  [
    [0, require("../assets/habit@/starfish-gray.png")],
    [1, require("../assets/habit@/starfish-sm.png")],
    [2, require("../assets/habit@/starfish-md.png")],
    [2, require("../assets/habit@/starfish-lg.png")]
  ],
  [
    [0, require("../assets/habit@/butterfly-gray.png")],
    [1, require("../assets/habit@/butterfly-sm.png")],
    [2, require("../assets/habit@/butterfly-md.png")],
    [2, require("../assets/habit@/butterfly-lg.png")]
  ],
  [
    [0, require("../assets/habit@/ladybug-gray.png")],
    [1, require("../assets/habit@/ladybug-sm.png")],
    [2, require("../assets/habit@/ladybug-md.png")],
    [2, require("../assets/habit@/ladybug-lg.png")]
  ]
]

const images = [
  [0, require("../assets/Ecosystem/home.png")],
  [1, require("../assets/Ecosystem/work.png")],
  [2, require("../assets/Ecosystem/gym.png")],
  [3, require("../assets/Ecosystem/currentlocation.png")],
];

const backgrounds = [
  [0, require("../assets/habit@/water-bg.png")],
  [1, require("../assets/habit@/sky-bg.png")],
  [2, require("../assets/habit@/leaf-bg.png")],
]

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  wrapper: {
    display: 'flex',
    flex: 1
  },
  cardtitle: {
    fontSize: 35,
    // marginTop: 5,
    fontWeight: "bold",
    color: '#FF3300'
  },
  cardDescription: {
    fontSize: 25,
    color: "#FF6600",
  },
  circle: {
   width: 120,
   height: 120,
   borderRadius: 120,
  //  borderColor: 'red',
   borderWidth: 0.5,
   margin: 5,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center'
 },
  separator: {
    flex: .005,
    height: 1,
    backgroundColor: '#8A7D80',
    // marginLeft: 15
  }
})
