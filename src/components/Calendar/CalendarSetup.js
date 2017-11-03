import React, { Component } from 'react';
import { View, Text, Image, Button, Linking, TouchableOpacity } from 'react-native';
import { AuthSession } from 'expo';
import axios from 'axios';
import Ecosystem from '../Frontend/EcoSystem';
import CalendarTasks from './CalendarTasks';


export default class CalendarSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      markers: '',
      categories: '',
      sync: false
    }
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.setState({
      userID: this.props.screenProps.userID
    });
    this.getUserInfo();
  }
  
  getUserInfo() {
    axios.get('https://naturalhabitat.herokuapp.com/getUserInfo', { params: { userID: this.props.screenProps.userID }})
      .then(information => {
        console.log(information.data, 'information')
        let { markers, categories } = information.data;
        this.setState({ markers, categories });
      })
  }

  calendar(){
    this.setState({
      sync: !this.state.sync
    });
  }

  goBack = async () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View>
        <View style={{margin: -10, marginLeft: 5, marginTop: 20, alignItems: 'flex-start'}}>
          <Button
            onPress={() => this.props.navigation.navigate('DrawerToggle', {memes: true})}
            title="&#9776;"
          />
        </View>
        <View style={{ backgroundColor: 'yellow', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
          {!this.state.sync ? <TouchableOpacity onPress={() => this.calendar()}>
              <Image style={{ height: 300, width: 350, marginBottom: 100 }} source={require('../assets/googleCalendar.png')} />
            </TouchableOpacity>
            : (
            <CalendarTasks goBack={this.goBack} markers={this.state.markers} categories={this.state.categories} userID={this.state.userID}/>
          )}        
        </View>
      </View>
    )
  }
}