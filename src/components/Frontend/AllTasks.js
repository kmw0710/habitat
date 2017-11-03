import React, { Component } from 'react';
import { Alert, Button, Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import axios from 'axios';
import convertDate from './convertDate';
export default class AllTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      completionTime: '',
      completion: null,
      hasStarted: true,
      rerender: 0,
    }
  }
  componentWillReceiveProps(oldprops, newprops) {
    this.setState({ showEdit: false})
  }
  showEdit(task) {
    let currentTime = new Date();
    currentTime > convertDate(task.Start) ? null : this.setState({ hasStarted: false });
    if (task.Completion === "True" || task.Completion === "False") {
      let time = task.Time;
      time = time.slice(0, -9);
      this.setState({
        completionTime: time,
        completion: task.Completion,
        showEdit: !this.state.showEdit
      })
    }
    this.setState({ showEdit: !this.state.showEdit })
  }
  markCompleted(task) {
    if (task.Completion === "True") {
      Alert.alert('Dont try to cheat');
      return;
    }
    var end = task.End;
    if (convertDate(end) > new Date()) {
      Alert.alert('the task deadline has not ended yet. Wait!')
      return;
    }
    let positivePoints = task.PositivePoints + 1;
    axios.put('https://naturalhabitat.herokuapp.com/yayTask', {
      taskId: task.Task_ID,
      markerId: task.Marker_ID,
      positivePoints: positivePoints
    })
    .then(res => {
      this.props.reRender(this.props.currentDay)
    })
    .catch((err) => {
      console.error(err);
    })
  }
  markFailed(task) {
    if (task.Completion === "True") {
      Alert.alert('Dont try to cheat');
      return;
    }
    var end = task.End;
    if (convertDate(end) > new Date()) {
      Alert.alert('the task deadline has not ended yet. Wait!')
      return;
    }
    let negativePoints = task.NegativePoints + 1;
    axios.put('https://naturalhabitat.herokuapp.com/nayTask', {
      taskId: task.Task_ID,
      markerId: task.Marker_ID,
      negativePoints: negativePoints
    })
    .then(res => {
      this.props.reRender(this.props.currentDay)
    })
    .catch((err) => {
      console.error(err);
    })
  }
  extraDescriptions() {
    let eco = this.props.task.Ecosystem;
    if (!this.state.completion && this.state.hasStarted) {
      var statusOption =
      <View>
        <Text>
          Task in Progress! Hold to edit!
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => { this.markFailed(this.props.task) }}>
            <Image source={ecobuddies[eco][0][1]} style={{ height: 35, width: 35 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.markCompleted(this.props.task) }}>
            <Image source={ecobuddies[eco][2][1]} style={{ height: 35, width: 35 }} />
          </TouchableOpacity>
        </View>
      </View>;
    }
    return (
      <View style={styles.subtitleView}>
        <Text style={styles.expanded}>
          Completed: {this.props.task.Completion ? this.props.task.Completion : "hasn't started"} {"\n"}
          Start: {this.props.task.Start} {"\n"}
          End: {this.props.task.End} {"\n"}
          Frequency: {this.props.task.Frequency}
        </Text>
        <TouchableHighlight onPress={() => this.props.goToEditTask(this.props.task)}>
          <Text style={{fontSize: 30}}>&#x2699;</Text>
        </TouchableHighlight>
        {statusOption}
      </View>
    )
  }
  render() {
    let taskStatus = this.props.task.Completion;
    let eco = this.props.task.Ecosystem;
    if (taskStatus === "True") {
      taskStatus = <Image source={ecobuddies[eco][2][1]} style={styles.completion} />
    } else if (taskStatus === "False") {
      taskStatus = <Image source={ecobuddies[eco][0][1]} style={styles.completion} />
    } else {
      taskStatus = <Image source={ecobuddies[eco][1][1]} style={styles.completion} />
    }
    return (
      <View style={{borderColor:'black'}}>
        <TouchableOpacity onPress={() => this.showEdit(this.props.task)}>
          <View style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={location[this.props.task.Avatar ? this.props.task.Avatar : this.props.marker.Avatar][1]} style={{ height: 50, width: 50, flex: 1, resizeMode: 'contain' }} />
            <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.title}>
                {this.props.task.Task_Title}
              </Text>
              <Text style={styles.description}>
                {this.props.task.Task_Description}
              </Text>
            </View>
            {taskStatus}
          </View>
        </TouchableOpacity>
        {this.state.showEdit ? (
          <View style={{ display: 'flex', marginTop: 15, marginBottom: 15, justifyContent: 'center', alignItems: 'center' }}>
            {this.extraDescriptions()}
          </View>
        ) : null}
      </View>
    )
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
const location = [
  [0, require("../assets/Ecosystem/home.png")],
  [1, require("../assets/Ecosystem/work.png")],
  [2, require("../assets/Ecosystem/gym.png")],
  [3, require("../assets/Ecosystem/currentlocation.png")]
]
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: "bold",
  },
  description: {
    fontSize: 15,
    color: "#444",
  },
  completion: {
    marginRight: 15,
    height: 45,
    width: 45,
    alignItems: 'flex-end',
    resizeMode: 'contain'
  }
})
