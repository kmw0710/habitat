import React, { Component } from 'react';
import { View, Text, Image, Button, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import { AuthSession } from 'expo';
import moment from 'moment';
import axios from 'axios';
import TaskFromGoogle from './TaskFromGoogle';
import config from './config';


export default class CalendarTasks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userID: '',
			markers: '',
			categories: '',
			receivedFromGoogle: [],
			selectedCategory: '',
			selectedMarker: 'Select location',
      tasksFromGoogle: [],
      info: ''
    }
    this.notImport = this.notImport.bind(this);
	}

	componentDidMount() {
		let { userID, markers, categories } = this.props;
		this.setState({ userID, markers, categories });
		this.getToken();
	}

	getToken = async () => {
		let redirect = `https://auth.expo.io/@lalapro/habitation`;
		await AuthSession.startAsync({
			authUrl:
			`https://accounts.google.com/o/oauth2/v2/auth` +
			`?scope=https://www.googleapis.com/auth/calendar` +
			`&response_type=token` +
			`&redirect_uri=${redirect}` +
			`&client_id=${config.client_id}`
		})
			.then(result => {
				if (result.type !== 'success') {
					this.props.goBack();
				} else {
					let token = result.params.access_token;
					this.axiosCall(token);
				}
			})
			.catch(err => {
				console.error(err, ' first')
			})
	}

	axiosCall = async (token) => {
    let userID;
    let today = moment().format();
    let timeZone = today.slice(-6);
		let filtered = [];
    let beginningOfDay = `${JSON.stringify(today).slice(1, 12)}00:00:00${timeZone}`;
		let endOfDay = `${JSON.stringify(today).slice(1, 12)}23:59:59${timeZone}`;
		let minTime = new Date(beginningOfDay);
		let maxTime = new Date(endOfDay);

    var getEachCalendar = async (IDs) => {
      let id = IDs.filter(ele => {
        return ele === userID
      });
			let tasks = [];
			// IDs.map(id => {
			// Only receiving user's own calendar.
			axios({
				method: 'get',
				url: `https://www.googleapis.com/calendar/v3/calendars/${id[0]}/events`,
				headers: {
					Authorization: `Bearer ${token}`
				},
				params: {
					orderBy: 'startTime',
					singleEvents: true,
					timeMin: minTime,
					timeMax: maxTime
				}
			})
				.then(result => {
					if (result.data.items) {
						result.data.items.map(ele => {
							let temp = {
								title: '',
								start: '',
								end: '',
								Google: '',
								description: 'imported from Google...'
							};
							if (ele.end) {
								if (ele.end.dateTime) {
                  temp.time = ele.start.dateTime.slice(-5);
									temp.title = ele.summary;
                  temp.start = ele.start.dateTime.slice(0, 10) + ' ' + ele.start.dateTime.slice(11, 16);
                  temp.end = ele.end.dateTime.slice(0, 10) + ' ' + ele.end.dateTime.slice(11, 16);
                  temp.Google = ele.id;
									filtered.push(temp);
								}
							}
						})
          }
        let info = filtered.length > 0 ? `Today's tasks from Google!` : 'No tasks for today!'
        this.setState({ tasksFromGoogle: filtered, info: info });
        })
			// })
		}

		var getCalendarID = async (userID) => {
			axios({
				method: 'get',
				url: `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
				.then(result => {
					let temp = [];
					result.data.items.map(ele => {
						temp.push(ele.id)
					})
					// temp.shift();
					getEachCalendar(temp)
				})
				.catch(err => {
					console.error(err, 'it reached the end')
				})
		}

		axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList/primary?access_token=${token}`)
			.then(res => {
        userID = res.data.id;
				return getCalendarID(userID);
			})
			.catch(err => {
				console.error(err, 'err close to the end')
			})
	}

	markerSelector(selectedMarkerTitle) {
		this.setState({ selectedMarker: selectedMarkerTitle })
	}

	saveAllTasks(task, index) {
		axios.post('https://naturalhabitat.herokuapp.com/calendar', { tasks: this.state.tasksFromGoogle })
		.then(response => {
      this.props.goBack()
    })
  }

  notImport(index) {
    this.state.tasksFromGoogle.splice(index, 1);
    this.setState({
      tasksFromGoogle: this.state.tasksFromGoogle
    })
	}
	
	goBack() {
		this.props.goBack();
	}

	render() {
		return (
			<View style={{ flex: 1, width: '100%', marginTop: 30 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', textAlignVertical: 'center', marginBottom: 20 }}>
          {this.state.info}
        </Text>
       	<View style={{ flex: 1 }}>
					<ScrollView style={{ flex: 9 }}>
						{this.state.tasksFromGoogle ? this.state.tasksFromGoogle.map((task, i) => {
							return <TaskFromGoogle notImport={this.notImport} userID={this.state.userID} eachIndex={i} key={i} task={task} markers={this.props.markers} categories={this.state.categories} />
						}) : null}
					</ScrollView>
					<View style={{ flexDirection: 'row', flex: 0.2, justifyContent: 'space-around'}}>
						<TouchableHighlight onPress={() => this.saveAllTasks()}><Text style={{ fontSize: 30 }}>&#x2714;</Text></TouchableHighlight>
						<TouchableHighlight onPress={() => this.goBack()}><Text style={{ fontSize: 30 }}>&#x274c;</Text></TouchableHighlight>
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
