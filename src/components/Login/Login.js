import React, { Component } from 'react';
import{ StyleSheet, View, Image, Text, TouchableOpacity, Button, AsyncStorage, Animated } from 'react-native';
import { asset } from 'expo';
import axios from 'axios';
import LoginForm from './LoginForm';
import { onSignIn } from '../auth.js'

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
  }

  handleUserInput(event) {
    this.setState({ username: event })
  }

  handlePasswordInput(event) {
    this.setState({ password: event})
  }

  handleRegularLogin() {

    axios.get(`https://naturalhabitat.herokuapp.com/login`, {
      params: {
        username: this.state.username,
        password: this.state.password
      }
    })
    .then(userData => {
      this.props.screenProps.handleLogIn(userData.data.user);
      AsyncStorage.setItem(`user_token`, userData.data.token);
    })
  }

  login = async () => {
      const APP_ID = "1729141044061993"
      const options = {
          permissions: ['public_profile', 'email', 'user_friends', 'user_photos', 'user_location'],
      }

      const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options)
      if (type === 'success') {

        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
        const user = await response.json();
        // let user_fb_pic = null;
        // this.getFBPic().then(pic => user_fb_pic = pic)

        const response2 = await fetch(`https://graph.facebook.com/${user.id}/friends?access_token=${token}`)
        const  friends= await response2.json();
        
        axios.post(`https://naturalhabitat.herokuapp.com/token`, {
          name: user.name,
          username: user.id,
          token: token
        })
        .then(res => {
          this.getFBPic(user.id).then(pic => {
            this.props.screenProps.handleLogIn(res.data.user, pic, res.data.giftPoints);
          })
          AsyncStorage.setItem(`user_token`, token);
          friends.data.forEach(friend => {
            this.getFBPic(friend.id).then(pic => {
              axios.post('https://naturalhabitat.herokuapp.com/friends', {
                user: res.data.user,
                username: user.name,
                userfbID: user.id,
                friend: friend,
                pic: pic
              })
              .then(res => console.log('success'))
              .catch(err => console.error(err))
            })
          })
        })
      }
  }

  getFBPic = async (id) => {
    const response3 = await fetch(`https://graph.facebook.com/${id}/picture?type=normal`)
    let pic = await response3.url;
    return pic

  }

  checkAsyncStorage = async () => {
    const tokenInPhone = await AsyncStorage.getItem(`user_token`)
    return tokenInPhone;
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          resizeMethod='auto'
          source={require("../assets/habit@/logo.png")}
        />  
        <View style={styles.logoContainer}>
          <Image
            style={styles.house}
            resizeMethod='auto'
            source={require("../assets/habit@/login.png")}
          />
          <Text style={{color: 'orange'}}>Build Habitats by keeping Good Habits</Text>
        </View>

        <View style={styles.formContainer}>
          <LoginForm
            handleUserInput={this.handleUserInput}
            handlePasswordInput={this.handlePasswordInput}
          />
        </View>
        <View style={styles.button} >
          <Button
            onPress={() => {
              username = this.state.username
              password = this.state.password
              this.handleRegularLogin()
              }}
            title='LOGIN'
          />
        </View>
        <View style={styles.button} >
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate("SignUp")}
            title='SIGNUP'
          />
        </View>
        <View style={styles.fbbutton} >
          <Button
            onPress={this.login}
            title='Login with facebook' 
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 150,
    height: 80,
  },
  house: {
    width: 100,
    height: 110
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: '#FF9966',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'black',
    width: 250,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  fbbutton: {
    backgroundColor: '#CCFFFF',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'blue',
    width: 250,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  }

});
