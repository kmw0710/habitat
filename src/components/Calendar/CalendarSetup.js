import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
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
    axios.get('http://10.16.1.233:3000/getUserInfo', { params: { userID: this.props.screenProps.userID }})
      .then(information => {
        let { markers, categories } = information.data;
        this.setState({ markers, categories });
      })
  }

  calendar(){
    this.setState({
      sync: !this.state.sync
    });
  }

  goBack() {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={{ display: 'flex', backgroundColor: 'yellow', flex:1, alignItems: 'center', justifyContent: 'center'}}>
        {!this.state.sync ? 
          <Button onPress={() => this.calendar()} title="Sync with Google Calendar"/>
          : (
          <CalendarTasks goBack={this.goBack} markers={this.state.markers} categories={this.state.categories} userID={this.state.userID}/>
        )}        
      </View>
    )
  }
}