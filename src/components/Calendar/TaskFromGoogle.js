import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import axios from 'axios';

export default class TaskFromGoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: this.props.task,
      selectedMarker: 0,
      selectedCategory: 0,
      index: this.props.eachIndex,
      imported: false,
      selectedValue: 0
    }
  }

  componentDidMount() {
    let checkExists = this.props.task;
    axios.get('https://naturalhabitat.herokuapp.com/checkGoogle', { params: { task: checkExists }})
      .then(existence => {
        console.log(existence.data, 'existence')
        if (existence.data.length > 0) {
          this.setState({
            imported: true
          })
        } else {
          console.log(this.props.task, 'THIS PROPS TASK< HI?')
          let { task } = this.props;
          task.Marker_ID = this.props.markers[this.state.selectedMarker].Marker_ID;    
          task.Category_ID = this.props.categories[this.state.selectedCategory].id;
          task.userID = this.props.userID;
          task.frequency = 'Does not repeat';
        }
      })
  }

  pickLocation(marker) {
    let selectedMarker = this.props.markers[marker].Avatar;
    this.setState({ selectedMarker: selectedMarker, selectedValue: marker });
    let { task } = this.props;
    task.Marker_ID = this.props.markers[this.state.selectedMarker].Marker_ID;
  }

  pickCategory(category) {
    this.setState({ selectedCategory: category });
    let { task } = this.props;
    task.Category_ID = this.props.categories[category].id;
  }

  notImport(index) {
    this.props.notImport(index);
  }


  render() {
    // console.log(this.state.selectedMarker, 'MARKER ID')
    // console.log(this.props.markers)
    this.props.task
    return (
      <View style={{ backgroundColor: 'green', justifyContent: 'center', marginTop: 15, display: 'flex', alignItems: 'center' }}>
        <Text style={styles.title}>{this.props.task.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {this.state.imported ? (<View style={{ flex: 9, marginLeft: 10 }}><Text style={styles.imported}>Already Imported!</Text></View>) : (
            <View style={{ flex: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>    
                <Picker onValueChange={(marker) => this.pickLocation(marker)} selectedValue={this.state.selectedValue}
                  style={{ width: 100, height: 50 }} itemStyle={{ height: 50 }}>
                {this.props.markers ? this.props.markers.map((marker, i) => {
                  return <Picker.Item label={marker.Marker_Title} value={i} key={i} />
                }) : null}
                </Picker>
                <Image source={images[this.state.selectedMarker][1]} style={{ height: 35, width: 35, resizeMode: 'contain'}} />  

                <Picker onValueChange={(category) => this.pickCategory(category)} selectedValue={this.state.selectedCategory}
                  style={{ width: 100, height: 50 }} itemStyle={{ height: 50 }}>
                  {this.props.categories ? this.props.categories.map((category, i) => {
                    return <Picker.Item label={category.Category} value={i} key={i} />
                  }) : null}
                </Picker>
                  <View style={{ backgroundColor: this.props.categories[this.state.selectedCategory].Color, margin: 10, width: 25, height: 25, borderRadius: 25}} >
                  </View>
              </View>
            </View>
          )}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
              <TouchableOpacity onPress={() => this.notImport(this.props.eachIndex)}>
                <Image source={require('../assets/cross-out.png')} style={{ height: 30, width: 30 }}/>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    )
  }
}

const images = [
	[0, require("../assets/Ecosystem/home.png")],
	[1, require("../assets/Ecosystem/work.png")],
	[2, require("../assets/Ecosystem/gym.png")],
	[3, require("../assets/Ecosystem/currentlocation.png")]
]

const styles = StyleSheet.create({
	image: {
    width: 35,
    height: 35,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  imported: {
    alignSelf: 'center',
  }
})
