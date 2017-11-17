import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default class LocationTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false
    }
  }

  completeTask() {
    if (this.state.completion === "True") {
      return (
        <Text>  
          Completed Task on: {this.state.completionTime}
        </Text>
      )
    } else if (this.state.completion === "False") {
      return (
        <Text>
          Failed Task on: {this.state.completionTime}
        </Text>
      )
    } else if (!this.state.hasStarted) {
        return (
          <Text>
            Task has not been started yet!
          </Text>
        )
    } else {
      let eco = this.props.task.Ecosystem;
      return (
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
        </View>
      )
    }
  }


  render() {
    let { task } = this.props;
    return (
      <View>
        <TouchableOpacity onPress={() => this.showEdit(this.props.task)}>
          <View style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={location[this.props.task.Avatar][1]} style={{ height: 50, width: 50, flex: 1 }} />
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
            {this.completeTask()}
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

const location = [
  [0, require("../assets/Ecosystem/home.png")],
  [1, require("../assets/Ecosystem/work.png")],
  [2, require("../assets/Ecosystem/gym.png")],
  [3, require("../assets/habit@/location.png")]
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
})
