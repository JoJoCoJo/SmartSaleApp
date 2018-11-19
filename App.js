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
  Linking,
  AsyncStorage,
  TouchableOpacity,
  Modal
} from 'react-native';
import Dimensions from 'Dimensions';
import SplashLogo from './assets/splash.png';
import DeleteImage from './assets/delete.png';
import UpdateImage from './assets/update.png';

const rootUrl = 'http://smart-sale.000webhostapp.com/api/v1'
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWithoutFlex: {
    width: DEVICE_WIDTH,
    paddingRight: 35,
    paddingLeft: 35,
  },
  toolbar: {
    backgroundColor: '#2196F3',
    height: 30,
    alignSelf: 'stretch',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  loadingWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  input: {
    width: DEVICE_WIDTH - 75,
    height: 40,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10
  },
  textArea: {
    width: DEVICE_WIDTH - 75,
    height: 150,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10
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
  imagesActions: {
    width: 20,
    height: 20
  },
  logoSmall: {
    width: DEVICE_WIDTH - 152,
    height: DEVICE_WIDTH - 150
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    elevation : 3,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
});

type Props = {};
export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {
      view: 'default',
      loading: false,
      modalAddVisible: false,
      modalAddType: '',
      user: {},
      login_user: 'jojo@msn.com',
      login_pass: '1234567',
      register_user: '',
      register_pass: '',
      register_names: '',
      register_last_names: '',
      add_category_name: '',
      add_category_description: '',
    }
    this.onPressLogin = this.onPressLogin.bind(this)
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.onBackPressed);

    Linking.addEventListener('url', this._handleOpenURL);

    setTimeout(() => this.setState({view: 'login'}), 3500)
  }

  onBackPressed = () => {
    let { view } = this.state
    switch (view) {
      case 'register':
        this.setState({view: 'login'});
      break;
      case 'tutorial':
        this.setState({view: 'register'});
      break;
      case 'menu':
        Alert.alert(
          '',
          '¿Desea cerrar sesión?',
          [ {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Salir', onPress: () => this.setState({view: 'login'}) },
          ],
          { cancelable: false }
        )
      break;
      case 'optionCategories':
        this.setState({view: 'menu'});
      break;
      case 'optionProducts':
        this.setState({view: 'menu'});
      break;
      case 'optionSales':
        this.setState({view: 'menu'});
      break;
      case 'optionForecast':
        this.setState({view: 'menu'});
      break;
      case 'login':
        Alert.alert(
          '',
          '¿Desea salir de la app?',
          [ {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Salir', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        )
      break;
    }
    return true;
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
          console.log('json if ---->', json)
          return fetch(`${rootUrl}/users/read/${json.data[0].id_user}/categories,products,sales,SalesProducts,forecasts`);
        }else{
          console.log('json else --->', json)
          this.setState({loading: false})
          Alert.alert('', 'Usuario y/o contraseña incorrectos.')
        }
      }
    )
    .then((dataUser) => { console.log('dataUser first --->', dataUser); return dataUser.json() })
    .then(
      (dataUserRes) => {
        console.log('dataUserRes ---->', dataUserRes.data[0])
        this.setState({user: dataUserRes.data[0]})
        this.setState({view: 'menu'})
        this.setState({loading: false})
      }
    )
  }

  onPressRegister(){
    this.setState({loading: true})

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
          this.setState({loading: false})
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
          this.setState({loading: false})
          errors += `${json.message}\n`
          if (errors !== '') {
            Alert.alert('', errors)
          }
        }else{
          Alert.alert('', 'Usuario Creado correctamente.\nYa puede iniciar sesión.')
          this.setState({loading: false})
          this.setState({user: json.data})
          this.setState({view: 'tutorial'})
        }
      }
    )
  }

  onPressDeleteIcon(table, id_name, id){
    Alert.alert(
      '',
      '¿Desea eliminar el registro?',
      [ {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Eliminar', onPress: () => {
            this.setState({loading: true})
            fetch(`${rootUrl}/${table}/delete/?${id_name}=${id}`)
            .then(
              (res) => { console.log('res --->', res); return res.json(); }
            )
            .then(
              (json) => {
                if (json.errors) {
                  Alert.alert('', 'Ha ocurrido un error, intentelo de nuevo más tarde.')
                }else{
                  return fetch(`${rootUrl}/users/read/${this.state.user.id_user}/categories,products,sales,SalesProducts,forecasts`);
                }
              }
            )
            .then( (newRes) => { return newRes.json(); })
            .then(
              (newDataUser) => {
                this.setState({user: newDataUser.data[0]})
                this.setState({loading: false})
                Alert.alert('', 'Registro eliminado con éxito.')
              }
            )
          }
        },
      ],
      { cancelable: false }
    )
    //alert(`delete: ${id}`)
  }

  onPressUpdateCategory(id){
    alert(`update: ${id}`)
  }

  renderView(){
    let render = []    
    switch (this.state.view) {
      case 'login':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Login
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:7}} />
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Correo' onChangeText={(text) => this.setState({login_user: text})} value={this.state.login_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Contraseña' onChangeText={(text) => this.setState({login_pass: text})} value={this.state.login_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressLogin()} title="Entrar" />
            <View style={{margin:14}} />
            <View style={styles.containerFlex}>
              <Text style={styles.link} onPress={() => this.setState({view: 'register'})}>¿No tienes cuenta? ¡Regístrate!</Text>
            </View>
            <View style={{margin:14}} />
          </ScrollView>
        )
      break;
      case 'register':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Registro
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:7}} />
            <TextInput style={styles.input} placeholder='Ingrese su nombre(s):' onChangeText={(text) => this.setState({register_names: text})} value={this.state.register_names} />
            <TextInput style={styles.input} placeholder='Ingrese su apellido(s):' onChangeText={(text) => this.setState({register_last_names: text})} value={this.state.register_last_names} />
            <TextInput keyboardType='email-address' style={styles.input} placeholder='Ingrese su correo:' onChangeText={(text) => this.setState({register_user: text})} value={this.state.register_user} />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Ingrese su contraseña:' onChangeText={(text) => this.setState({register_pass: text})} value={this.state.register_pass} />
            <View style={{margin:7}} />
            <Button onPress={() => this.onPressRegister()} title="Registrar" />
            <View style={{margin:7}} />
            <View style={styles.containerFlex}>
              <Text style={styles.link} onPress={() => this.setState({view: 'login'})}>¿Ya tienes cuenta? ¡Ingresa!</Text>
            </View>
            <View style={{margin:14}} />
          </ScrollView>
        )
      break;
      case 'menu':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Menú
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
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
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Categorias
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:14}} />
            <Button onPress={() => this.setState({modalAddVisible: true, modalAddType: 'categories'})} title='Nueva Categoria' />
            <View style={{margin:7}} />
            { this.state.user.categories && this.state.user.categories.length > 0 ?
                this.state.user.categories.map(
                  (category, c) => {
                    return(
                      <View style={styles.card} key={c}>
                        <View style={{ flex: 5, alignSelf: 'stretch', padding: 5 }} >
                          <Text>{category.name}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressUpdateCategory(category.id_category)}>
                            <Image style={styles.imagesActions} source={UpdateImage} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('categories', 'id_category', category.id_category)}>
                            <Image style={styles.imagesActions} source={DeleteImage} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }
                )
              :
              <View style={styles.card}>
                <Text>No hay categorias disponibles.</Text>
              </View>
            }
          </ScrollView>
        )
      break;
      case 'optionProducts':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Productos
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:14}} />
            <Button onPress={() => this.setState({modalAddVisible: true, modalAddType: 'products'})} title='Nuevo Producto' />
            <View style={{margin:7}} />
            { this.state.user.products && this.state.user.products.length > 0 ?
                this.state.user.products.map(
                  (product, p) => {
                    return(
                      <View style={styles.card} key={p}>
                        <View style={{ flex: 5, alignSelf: 'stretch', padding: 5 }} >
                          <Text>{product.name}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressUpdateCategory(product.id_product)}>
                            <Image style={styles.imagesActions} source={UpdateImage} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('products', 'id_product', product.id_product)}>
                            <Image style={styles.imagesActions} source={DeleteImage} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }
                )
              :
              <View style={styles.card}>
                <Text>No hay productos disponibles.</Text>
              </View>
            }
          </ScrollView>
        )
      break;
      case 'optionSales':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Ventas
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:7}} />
            <Button onPress={() => this.setState({modalAddVisible: true, modalAddType: 'sales'})} title='Nueva Venta' />
            <View style={{margin:7}} />
            { this.state.user.sales && this.state.user.sales.length > 0 ?
                this.state.user.sales.map(
                  (sale, s) => {
                    return(
                      <View style={styles.card} key={s}>
                        <View style={{ flex: 5, alignSelf: 'stretch', padding: 5 }} >
                          <Text>{`Venta: #${sale.id_sale}\nFecha: ${sale.date_sale}`}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressUpdateCategory(sale.id_sale)}>
                            <Image style={styles.imagesActions} source={UpdateImage} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('sales', 'id_sale', sale.id_sale)}>
                            <Image style={styles.imagesActions} source={DeleteImage} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }
                )
              :
              <View style={styles.card}>
                <Text>No hay productos disponibles.</Text>
              </View>
            }
          </ScrollView>
        )
      break;
      case 'optionForecast':
        return(
          <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
            <View style={styles.containerFlex}>
              <View style={{margin:7}} />
              <Text style={{fontSize: 27}}>
                Pronósticos
              </Text>
              <View style={{margin:7}} />
              <Image
                style={styles.logoSmall}
                source={SplashLogo}
              />
            </View>
            <View style={{margin:7}} />
            <Button onPress={() => this.setState({modalAddVisible: true, modalAddType: 'forecasts'})} title='Nuevo Pronóstico' />
            <View style={{margin:7}} />
            { this.state.user.forecasts && this.state.user.forecasts.length > 0 ?
                this.state.user.forecasts.map(
                  (forecast, f) => {
                    return(
                      <View style={styles.card} key={f}>
                        <View style={{ flex: 5, alignSelf: 'stretch', padding: 5 }} >
                          <Text>{`ID: #${forecast.id_forecast}\nVenta: ${forecast.sale_id}`}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressUpdateCategory(forecast.id_forecast)}>
                            <Image style={styles.imagesActions} source={UpdateImage} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('forecast', 'id_forecast', forecast.id_forecast)}>
                            <Image style={styles.imagesActions} source={DeleteImage} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }
                )
              :
              <View style={styles.card}>
                <Text>No hay pronósticos disponibles.</Text>
              </View>
            }
          </ScrollView>
        )
      break;
      default:
        return(
          <View style={styles.containerFlex}>
            <Image
              style={styles.logoBig}
              source={SplashLogo}
            />
          </View>
        )
      break;
    }
  }

  render() {
    console.log('this.state ---->', this.state)
    console.log('this.state.user ---->', this.state.user)
    return(
      <View style={styles.containerFlex}>
        <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.loading}
          onRequestClose={() => console.log('close modal')}
        >
          <View style={styles.loading}>
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalAddVisible}
          onRequestClose={() => this.setState({modalAddVisible: false})}
        >
          { this.state.modalAddType === 'categories' ?
              <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
                <View style={styles.containerFlex}>
                  <View style={{margin:7}} />
                  <Text style={{fontSize: 27}}>
                    Nueva Categoria
                  </Text>
                </View>
                <View style={{margin:14}} />
                <TextInput style={styles.input} placeholder='Nombre de la categoria:' onChangeText={(text) => this.setState({add_category_name: text})} value={this.state.add_category_name} />
                <TextInput style={styles.textArea} multiline={true} numberOfLines={10} placeholder='Descripción de la categoria: (Opcional)' onChangeText={(text) => this.setState({add_category_description: text})} value={this.state.add_category_description} />
                {/*<TextInput keyboardType='email-address' style={styles.input} placeholder='Ingrese su correo:' onChangeText={(text) => this.setState({register_user: text})} value={this.state.register_user} />
                                <TextInput keyboardType='email-address' style={styles.input} placeholder='Ingrese su correo:' onChangeText={(text) => this.setState({register_user: text})} value={this.state.register_user} />*/}
                <Button onPress={() => this.setState({modalAddVisible: false})} title='Guardar' />
                <View style={{margin:7}} />
              </ScrollView>
            :
            this.state.modalAddType === 'products' ?
              <View>
                <Text>Agregar productos</Text>
              </View>
            :
            this.state.modalAddType === 'sales' ?
              <View>
                <Text>Agregar ventas</Text>
              </View>
            :
              <View>
                <Text>Agregar pronósticos</Text>
              </View>
          }
        </Modal>        
        { this.renderView() }
      </View>
    )
  }
}
