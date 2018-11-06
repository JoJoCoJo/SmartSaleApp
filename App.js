/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  Button,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import SplashLogo from './assets/splash.png';

const rootUrl = 'http://smart-sale.000webhostapp.com/api/v1'

type Props = {};
export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {
      view: 'default',
      login_user: '',
      login_pass: '',
      categories: {}
    }
    this.onPressLogin = this.onPressLogin.bind(this)
  }

  componentDidMount(){
    /*fetch('http://smart-sale.000webhostapp.com/api/v1/categories/read/')
    .then(
      (res) => {
        return res.json()
      }
    )
    .then(
      (json) => {
        this.setState({categories: json.data})
        this.setState({view: 1})
      }
    )*/
    setTimeout(() => this.setState({view: 1}), 3500)
  }

  onPressLogin(){
    let { login_user, login_pass } = this.state
    fetch(`${rootUrl}/users/login/?username=${login_user}&password=${login_pass}`)
    .then(
      (res) => { return res.json() }
    )
    .then(
      (json) => {
        console.log('json login --->', json)
        if (json.code === 200) {
          alert('Logeado')
          this.setState({view: 2})       
        }else{
          alert('Usuario y/o contraseña incorrectos.')
        }
      }
    )
  }

  renderView(){
    let render = []
    switch (this.state.view) {
      case 1:
        return(
          <ScrollView style={{padding: 20}}>
            <Text style={{fontSize: 27}}>
              Login
            </Text>
            <TextInput placeholder='Username' onChangeText={(text) => this.setState({login_user: text})} value={this.state.login_user} />
            <TextInput placeholder='Password' onChangeText={(text) => this.setState({login_pass: text})} value={this.state.login_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressLogin()} title="Submit" />
          </ScrollView>
        )
      break;
      case 2:
        return(
          <ScrollView style={{padding: 20}}>
            <Text style={{fontSize: 27}}>
              Todo correcto.
            </Text>
          </ScrollView>
        )
      break;
      default:
        return(
          <View style={styles.loading}>
            <Image
              source={SplashLogo}
            />
          </View>
        )
      break;
    }
  }

  render() {
    return(
      <View style={styles.container}>
        {/*<Text>{JSON.stringify(this.state)}</Text>*/}
        {this.renderView()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
