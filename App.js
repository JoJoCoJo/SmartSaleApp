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
  BackHandler,
  ToolbarAndroid
} from 'react-native';
import Dimensions from 'Dimensions';
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
    this.onActionSelected = this.onActionSelected.bind(this)
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          '',
          '¿Desea salir de la app?\nSe cerrará la sesión por defecto.',
          [ {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Salir', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        )
        return true;
      }
    );

    setTimeout(() => this.setState({view: 'login'}), 3500)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  onPressLogin(){
    let { login_user, login_pass } = this.state
    fetch(`${rootUrl}/users/login/?username=${login_user}&password=${login_pass}`)
    .then((res) => { return res.json() })
    .then(
      (json) => {
        if (json.code === 200) {
          alert('Sesión Iniciada.')
          this.setState({view: 'menu'})       
        }else{
          console.log('json login --->', json)
          alert('Usuario y/o contraseña incorrectos.')
        }
      }
    )
  }

  renderView(){
    let render = []
    switch (this.state.view) {
      case 'login':
        return(
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={{fontSize: 27}}>
              Login
            </Text>
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Username' onChangeText={(text) => this.setState({login_user: text})} value={this.state.login_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' onChangeText={(text) => this.setState({login_pass: text})} value={this.state.login_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressLogin()} title="Entrar" />
            <View style={{margin:14}} />
            <Text style={styles.link} onPress={() => this.setState({view: 'register'})}>¿No tienes cuenta? Regístrate.</Text>
          </ScrollView>
        )
      break;
      case 'register':
        return(
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={{fontSize: 27}}>
              Registro
            </Text>
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Username' onChangeText={(text) => this.setState({register_user: text})} value={this.state.register_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' onChangeText={(text) => this.setState({register_pass: text})} value={this.state.register_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressLogin()} title="Registrar" />
          </ScrollView>
        )
      break;
      case 'menu':
        return(
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={{fontSize: 27}}>
              Menú
            </Text>
            <View style={{margin:7}} />
            <Button onPress={() => console.log('Opción 1 clicked...')} title='Opción 1' />
            <View style={{margin:7}} />
            <Button onPress={() => console.log('Opción 2 clicked...')} title='Opción 2' />
            <View style={{margin:7}} />
            <Button onPress={() => console.log('Opción 3 clicked...')} title='Opción 3' />
            <View style={{margin:7}} />
            <Button onPress={() => console.log('Opción 4 clicked...')} title='Opción 4' />
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

  onActionSelected(position) {
    if (position === 0) { // index of 'Settings'
      this.setState({view: 'login'});
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <ToolbarAndroid
          logo={SplashLogo}
          title="SmartSaleApp"
          actions={[{title: '<-', show: 'always'}]}
          onActionSelected={this.onActionSelected} 
          style={styles.toolbar}
        />
        {/*<Text>{JSON.stringify(this.state)}</Text>*/}
        {this.renderView()}
      </View>
    )
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#2196F3',
    height: 30,
    alignSelf: 'stretch',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
});
