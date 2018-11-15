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
  ToolbarAndroid,
  Linking,
  AsyncStorage 
} from 'react-native';
import Dimensions from 'Dimensions';
import SplashLogo from './assets/splash.png';

const rootUrl = 'http://smart-sale.000webhostapp.com/api/v1'
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerWithoutFlex: {
    width: DEVICE_WIDTH - 150,
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
  },
  linkBig: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 27
  },  
  logoBig: {
    width: DEVICE_WIDTH - 63,
    height: DEVICE_WIDTH - 60
  },  
  logoSmall: {
    width: DEVICE_WIDTH - 152,
    height: DEVICE_WIDTH - 150
  }
});

type Props = {};
export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {
      view: 'default',
      loading: false,
      user: {},
      login_user: '',
      login_pass: '',
      register_user: '',
      register_pass: '',
      register_names: '',
      register_last_names: '',
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

    Linking.addEventListener('url', this._handleOpenURL);

    setTimeout(() => this.setState({view: 'login'}), 3500)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    Linking.removeEventListener('url');
  }

  _handleOpenURL(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  onPressLogin(){
    this.setState({loading: true})
    let { login_user, login_pass } = this.state

    fetch(`${rootUrl}/users/login/?username=${login_user}&password=${login_pass}`)
    .then((res) => { return res.json() })
    .then(
      (json) => {
        if (json.code === 200) {
          this.setState({user: json.data[0]})
          this.setState({view: 'menu'})
          this.setState({loading: false})
        }else{
          console.log('json else --->', json)
          this.setState({loading: false})
          Alert.alert('', 'Usuario y/o contraseña incorrectos.')
        }
      }
    )
  }

  onPressRegister(){
    let {
      register_user,
      register_pass,
      register_names,
      register_last_names,
    } = this.state

    fetch(`${rootUrl}/users/create/?names=${register_names}&last_names=${register_last_names}&email=${register_user}&password=${register_pass}`)
    .then(
      (res) => {
        return res.json();
      }
    )
    .then(
      (json) => {
        console.log('json ---->', json)
        let errors = ''
        if (json.errors) {
          if (json.errors.email) {
            if (json.errors.email.length > 0) {
              errors += `${json.errors.email[0]}\n`
            }
          }
          if (json.errors.names) {
            if (json.errors.names.length > 0) {
              errors += `${json.errors.names[0]}\n`
            }
          }
          if (json.errors.last_names) {
            if (json.errors.last_names.length > 0) {
              errors += `${json.errors.last_names[0]}\n`
            }
          }
          if (json.errors.password) {
            if (json.errors.password.length > 0) {
              errors += `${json.errors.password[0]}\n`
            }
          }

          if (errors !== '') {
            Alert.alert('', errors)
          }
        }else if (json.code === 500 || json.code === null) {
          errors += `${json.message}\n`
          if (errors !== '') {
            Alert.alert('', errors)
          }
        }else{
          Alert.alert('', 'Usuario Creado correctamente.\nYa puede iniciar sesión.')
          this.setState({user: json.data})
          this.setState({view: 'tutorial'})
        }
      }
    )
  }

  renderView(){
    let render = []    
    switch (this.state.view) {
      case 'login':
        return(
          <ScrollView contentContainerStyle={styles.containerFlex}>
            <Text style={{fontSize: 27}}>
              Login
            </Text>
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Correo' onChangeText={(text) => this.setState({login_user: text})} value={this.state.login_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Contraseña' onChangeText={(text) => this.setState({login_pass: text})} value={this.state.login_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressLogin()} title="Entrar" />
            <View style={{margin:14}} />
            <Text style={styles.link} onPress={() => this.setState({view: 'register'})}>¿No tienes cuenta? ¡Regístrate!</Text>
          </ScrollView>
        )
      break;
      case 'register':
        return(
          <ScrollView contentContainerStyle={styles.containerFlex}>
            <Text style={{fontSize: 27}}>
              Registro
            </Text>
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Ingrese su nombre(s):' onChangeText={(text) => this.setState({register_names: text})} value={this.state.register_names} />
            <TextInput style={styles.input} placeholder='Ingrese su apellido(s):' onChangeText={(text) => this.setState({register_last_names: text})} value={this.state.register_last_names} />
            <TextInput style={styles.input} placeholder='Ingrese su correo:' onChangeText={(text) => this.setState({register_user: text})} value={this.state.register_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Ingrese su contraseña:' onChangeText={(text) => this.setState({register_pass: text})} value={this.state.register_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressRegister()} title="Registrar" />
            <View style={{margin:14}} />
            <Text style={styles.link} onPress={() => this.setState({view: 'login'})}>¿Ya tienes cuenta? ¡Ingresa!</Text>
          </ScrollView>
        )
      break;
      case 'menu':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <Text style={{fontSize: 27}}>
                Menú
              </Text>
            </View>
            <View style={{margin:7}} />
            <Image
              style={styles.logoSmall}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Button onPress={() => this.setState({view: 'optionCategories'})} title='Categorias' />
            <View style={{margin:7}} />
            <Button onPress={() => this.setState({view: 'optionProducts'})} title='Productos' />
            <View style={{margin:7}} />
            <Button onPress={() => this.setState({view: 'optionSales'})} title='Ventas' />
            <View style={{margin:7}} />
            <Button onPress={() => this.setState({view: 'optionForecast'})} title='Pronósticos' />
          </ScrollView>
        )
      break;
      case 'tutorial':
        return(
          <ScrollView contentContainerStyle={styles.containerFlex}>
            <Image
              style={styles.logoBig}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Text style={styles.linkBig} onPress={() => this._handleOpenURL('http://google.com')}>
              Ver Tutorial
            </Text>
            <View style={{margin:14}} />
            <Button onPress={() => this.setState({view: 'menu'})} title='Omitir' />
          </ScrollView>
        )
      break;
      case 'optionCategories':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <Text style={{fontSize: 27}}>
                Categorias
              </Text>
            </View>
            <View style={{margin:7}} />
            <Image
              style={styles.logoSmall}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Button onPress={() => console.log('Nueva Categorias clicked...')} title='Nueva Categoria' />
            <View style={{margin:7}} />
          </ScrollView>
        )
      break;
      case 'optionProducts':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <Text style={{fontSize: 27}}>
                Productos
              </Text>
            </View>
            <View style={{margin:7}} />
            <Image
              style={styles.logoSmall}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Button onPress={() => console.log('Nuevo Productos...')} title='Nuevo Producto' />
            <View style={{margin:7}} />
          </ScrollView>
        )
      break;
      case 'optionSales':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <Text style={{fontSize: 27}}>
                Ventas
              </Text>
            </View>
            <View style={{margin:7}} />
            <Image
              style={styles.logoSmall}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Button onPress={() => console.log('Nueva Venta clicked...')} title='Nueva Venta' />
            <View style={{margin:7}} />
          </ScrollView>
        )
      break;
      case 'optionForecast':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <Text style={{fontSize: 27}}>
                Pronósticos
              </Text>
            </View>
            <View style={{margin:7}} />
            <Image
              style={styles.logoSmall}
              source={SplashLogo}
            />
            <View style={{margin:14}} />
            <Button onPress={() => console.log('Nuevo Pronostico clicked...')} title='Nuevo Pronóstico' />
            <View style={{margin:7}} />
          </ScrollView>
        )
      break;
      default:
        return(
          <View style={styles.loading}>
            <Image
              style={styles.logoBig}
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
    console.log('this.state ---->', this.state)
    return(
      <View style={styles.containerFlex}>
        { this.state.view !== 'default' && this.state.loading === false &&
          <ToolbarAndroid
            logo={SplashLogo}
            overflowIcon={SplashLogo}
            title="SmartSaleApp"
            actions={[{title: 'BACK', show: 'always'}]}
            onActionSelected={this.onActionSelected} 
            style={styles.toolbar}
          />
        }
        { this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
        { this.state.loading === false && this.renderView() }
      </View>
    )
  }
}
