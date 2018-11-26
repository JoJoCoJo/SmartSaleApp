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
  Picker,
  DatePickerAndroid,
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
import DeleteIcon from './assets/delete.png';
import UpdateIcon from './assets/update.png';
import AddIcon from './assets/add.png';
import GraphsIcon from './assets/graphs.png';
import DataIcon from './assets/data.png';

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
  inputFlex: {
    flex: 1,
    height: 40,
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

let todayDate = new Date()
let year      = todayDate.getFullYear()
let month     = Number(todayDate.getMonth()) + 1
let day       = String(todayDate.getDate()).length < 2 ? `0${todayDate.getDate()}` : todayDate.getDate()
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
      add_product_category_id: '',
      add_product_name: '',
      add_product_price: '',
      add_sales_category_id: '',
      add_sales_date_sale: `${year}-${month}-${day}`,
      add_sales_type_sale: '',
      add_sales_show_total_units_sales: 1,
      add_sales_products_id: {},
      add_sales_products_total: 0
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

  async openAndroidDatePicker(stateNewDate) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });

      if (action === DatePickerAndroid.dateSetAction) {
        /*String(todayDate.getDate()).length < 2 ? `0${todayDate.getDate()}` : todayDate.getDate()*/
        this.setState({ [stateNewDate]: `${year}-${Number(month) + 1}-${String(day).length < 2 ? `0${day}` : day }` })
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
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

  onPressAddButton(table) {
    let {
      user,
      add_category_name,
      add_category_description,
      add_product_category_id,
      add_product_name,
      add_product_price,


      add_sales_category_id,
      add_sales_date_sale,
      add_sales_type_sale,
      add_sales_products_id,
      add_sales_products_total
    } = this.state
    let dataUrl = ''

    switch (table) {
      case 'categories':
        dataUrl = `?user_id=${user.id_user}&name=${add_category_name}&description=${add_category_description}`
      break;
      case 'products':
        dataUrl = `?user_id=${user.id_user}&category_id=${add_product_category_id}&name=${add_product_name}&price=${add_product_price}`
      break;
      case 'sales':
        if (add_sales_products_total > 0) {
          dataUrl = `?user_id=${user.id_user}&category_id=${add_sales_category_id}&date_sale=${add_sales_date_sale}&type_sale=${add_sales_type_sale}&total_units_sales=${add_sales_products_total}`
        }else{
          Alert.alert('', 'Debe agregar al menos 1 producto a la venta')
          return
        }
        
      break;
    }
    console.log('dataUrl --->', dataUrl)
    this.setState({loading: true})
    fetch(`${rootUrl}/${table}/create/${dataUrl}`)
    .then((res) => { return res.json() })
    .then(
      (json) => {
        console.log('json ---->', json)
        let errors = ''
        if (json.errors) {
          if (json.errors.name) {
            if (json.errors.name.length > 0) {
              errors += `${json.errors.name[0]}\n`
            }
          }
          if (json.errors.description) {
            if (json.errors.description.length > 0) {
              errors += `${json.errors.description[0]}\n`
            }
          }
          if (json.errors.price) {
            if (json.errors.price.length > 0) {
              errors += `${json.errors.price[0]}\n`
            }
          }
          if (json.errors.date_sale) {
            if (json.errors.date_sale.length > 0) {
              errors += `${json.errors.date_sale[0]}\n`
            }
          }
          if (json.errors.total_units_sales) {
            if (json.errors.total_units_sales.length > 0) {
              errors += 'El Total de Productos debe ser mayor a 0.\n'
            }
          }
          if (json.errors.type_sale) {
            if (json.errors.type_sale.length > 0) {
              errors += `${json.errors.type_sale[0]}\n`
            }
          }

          if (errors !== '') {
            this.setState({loading: false})
            Alert.alert('', errors)
          }
        }else{
          console.log('json data --->', json.data)
          
          user[`${table}`].push(json.data)
          this.setState({ user })

          this.setState({
            add_category_name: '',
            add_category_description: '',
            add_product_category_id: '',
            add_product_name: '',
            add_product_price: '',
          })
          
          Alert.alert('', 'Registro agregado.')
          this.setState({loading: false})
          this.setState({modalAddVisible: false})
        }
      }
    )
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
                          <Text style={styles.link} onPress={() => Alert.alert(category.name, `${category.description === null ? `No hay descripción disponible.` : `Descripción: ${category.description}`}`)}>{category.name}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('categories', 'id_category', category.id_category)}>
                            <Image style={styles.imagesActions} source={DeleteIcon} />
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
            <View style={{margin:14}} />
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
                          <Text style={styles.link} onPress={() => Alert.alert(product.name, product.category_id === null ? `Categoría: No hay categoría disponible.\nPrecio: ${product.price}` : `Categoría Id: ${product.category_id}\nPrecio: ${product.price}`)}>{product.name}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('products', 'id_product', product.id_product)}>
                            <Image style={styles.imagesActions} source={DeleteIcon} />
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
            <View style={{margin:14}} />
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
                          <Text style={styles.link} onPress={() => Alert.alert('', `Ver info de la venta: ${sale.id_sale}`) } >{`Venta: #${sale.id_sale}\nFecha: ${sale.date_sale}`}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => Alert.alert('', `Agregar/Ver Productos a las venta: ${sale.id_sale}`)}>
                            <Image style={styles.imagesActions} source={AddIcon} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('sales', 'id_sale', sale.id_sale)}>
                            <Image style={styles.imagesActions} source={DeleteIcon} />
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
            <View style={{margin:14}} />
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
                          <Text style={styles.link} onPress={() => Alert.alert('', `Info pronóstico: ${forecast.id_forecast}`)}>{`ID: #${forecast.id_forecast}\nVenta: ${forecast.sale_id}`}</Text>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => Alert.alert('', `Generar datos del pronóstico: ${forecast.id_forecast}`)}>
                            <Image style={styles.imagesActions} source={DataIcon} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => Alert.alert('', `Generar gráfica del pronóstico: ${forecast.id_forecast}`)}>
                            <Image style={styles.imagesActions} source={GraphsIcon} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.containerFlex} >
                          <TouchableOpacity onPress={() => this.onPressDeleteIcon('forecast', 'id_forecast', forecast.id_forecast)}>
                            <Image style={styles.imagesActions} source={DeleteIcon} />
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
            <View style={{margin:14}} />
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

  renderAddProductsInSales(){
    let render = []

    let { add_sales_products_id } = this.state

    for (let i = 1; i < (Number(this.state.add_sales_show_total_units_sales) + 1); i++) {
      if (this.state.add_sales_products_id[`product${i}`] == undefined) {
        add_sales_products_id[`product${i}`] = {
          [`id_product${i}`]: null,
          [`quantity_sale${i}`]: 0
        }
        this.setState({ add_sales_products_id })
      }
      render.push(
        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row'}} key={i}>
          <View style={{ justifyContent: 'center'}}>
            <Text>{`${i}.-`}</Text>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch'}}>
            { this.state.user.products && this.state.user.products.length > 0 ?
              <Picker
                selectedValue={this.state.add_sales_products_id[`product${i}`][`id_product${i}`]}
                style={styles.inputFlex}
                mode='dropdown'
                onValueChange={(itemValue) => {
                  let { add_sales_products_id } = this.state
                  add_sales_products_id[`product${i}`][`id_product${i}`] = itemValue
                  this.setState({ add_sales_products_id }) 
                  }
                }
              >
                <Picker.Item label='Seleccione un producto' value={null} />
                { this.state.user.products.map(
                    (product, p) => {
                      return(<Picker.Item label={product.name} value={product.id_product} key={p} />)
                    }
                  )
                }
              </Picker>
              :
              <Text>No hay categorias disponibles. Puede ingresar nuevas en el apartado de categorias.</Text>
            }
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row'}} >
            <View style={styles.containerFlex}>
              <Button onPress={
                () => {
                  if (Number(this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`]) > 1) {
                    let { add_sales_products_id } = this.state
                    add_sales_products_id[`product${i}`][`quantity_sale${i}`] = Number(this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`] != undefined ? this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`] : 1 ) - 1
                    this.setState({
                      add_sales_products_id
                    })
                  }
                  this.renderTotalProductsToAdd()
                }
              } title='-' />
            </View>
            <View style={styles.containerFlex}>
              <TextInput
                editable={false}
                style={styles.inputFlex}
                onChangeText={
                  (text) => {
                    let { add_sales_products_id } = this.state
                    add_sales_products_id[`product${i}`][`quantity_sale${i}`] = text
                    this.setState({ add_sales_products_id })
                  }
                }
                value={String(this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`])} />
            </View>
            <View style={styles.containerFlex}>
              <Button onPress={
                () => {
                  let { add_sales_products_id } = this.state
                  add_sales_products_id[`product${i}`][`quantity_sale${i}`] = Number(this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`] != undefined ? this.state.add_sales_products_id[`product${i}`][`quantity_sale${i}`] : 1 ) + 1
                  this.setState({ add_sales_products_id })
                  this.renderTotalProductsToAdd()
                }
              } title='+' />
            </View>
          </View>
        </View>
      )
    }

    return render
  }

  renderTotalProductsToAdd(){
    let totalProducts = 0
    Object.keys(this.state.add_sales_products_id).forEach(
      (product, p) => {
        console.log('this.state.add_sales_products_id[product] --->', this.state.add_sales_products_id[product][`quantity_sale${p+1}`])
        totalProducts = totalProducts + this.state.add_sales_products_id[product][`quantity_sale${p+1}`]
      }
    )
    this.setState({add_sales_products_total: totalProducts })
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
              <Text>Procesando...</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalAddVisible}
          onRequestClose={
            () => {
              this.setState({
                add_sales_show_total_units_sales: 1,
                add_sales_products_id: {},
                add_sales_products_total: 0
              })
              this.setState({ modalAddVisible: false })
            }
          }
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
                <Button onPress={() => this.onPressAddButton('categories')} title='Guardar' />
                <View style={{margin:7}} />
              </ScrollView>
            :
            this.state.modalAddType === 'products' ?
              <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
                <View style={styles.containerFlex}>
                  <View style={{margin:7}} />
                  <Text style={{fontSize: 27}}>
                    Nuevo Producto
                  </Text>
                </View>
                <View style={{margin:14}} />
                { this.state.user.categories && this.state.user.categories.length > 0 ?
                  <Picker
                    selectedValue={this.state.add_product_category_id}
                    style={styles.input}
                    mode='dropdown'
                    onValueChange={(itemValue) => this.setState({add_product_category_id: itemValue})}
                  >
                    <Picker.Item label='Sin Categoria' value='' />
                    { this.state.user.categories.map(
                        (categoriesUser, cu) => {
                          return(<Picker.Item label={categoriesUser.name} value={categoriesUser.id_category} key={cu} />)
                        }
                      )
                    }
                  </Picker>
                  :
                  <Text>No hay categorias disponibles. Puede ingresar nuevas en el apartado de categorias.</Text>
                }
                <TextInput style={styles.input} placeholder='Nombre del producto:' onChangeText={(text) => this.setState({add_product_name: text})} value={this.state.add_product_name} />
                <TextInput style={styles.input} keyboardType='decimal-pad' placeholder='Precio del producto:' onChangeText={(text) => this.setState({add_product_price: text})} value={this.state.add_product_price} />
                <View style={{margin:7}} />
                <Button onPress={() => this.onPressAddButton('products')} title='Guardar' />
                <View style={{margin:7}} />
              </ScrollView>
            :
            this.state.modalAddType === 'sales' ?
              <ScrollView contentContainerStyle={styles.containerWithoutFlex}>
                <View style={styles.containerFlex}>
                  <View style={{margin:7}} />
                  <Text style={{fontSize: 27}}>
                    Nueva Venta
                  </Text>
                </View>
                <View style={{margin:14}} />
                { this.state.user.categories && this.state.user.categories.length > 0 ?
                  <Picker
                    selectedValue={this.state.add_sales_category_id}
                    style={styles.input}
                    mode='dropdown'
                    onValueChange={(itemValue) => this.setState({add_sales_category_id: itemValue})}
                  >
                    <Picker.Item label='Sin Categoria' value='' />
                    { this.state.user.categories.map(
                        (categoriesUser, cu) => {
                          return(<Picker.Item label={categoriesUser.name} value={categoriesUser.id_category} key={cu} />)
                        }
                      )
                    }
                  </Picker>
                  :
                  <Text>No hay categorias disponibles. Puede ingresar nuevas en el apartado de categorias.</Text>
                }
                <TouchableOpacity onPress={() => this.openAndroidDatePicker('add_sales_date_sale')}>
                  <TextInput editable={false} style={styles.input} placeholder='Fecha de la venta:' onChangeText={(text) => this.setState({add_sales_date_sale: text})} value={this.state.add_sales_date_sale} />
                </TouchableOpacity>
                <Picker
                  selectedValue={this.state.add_sales_type_sale}
                  style={styles.input}
                  mode='dropdown'
                  onValueChange={(itemValue) => this.setState({add_sales_type_sale: itemValue})}
                >
                  <Picker.Item label='Selecione un tipo de venta' value='' />
                  <Picker.Item label='Tipo de venta 1' value={1} />
                  <Picker.Item label='Tipo de venta 2' value={2} />
                  <Picker.Item label='Tipo de venta 3' value={3} />
                </Picker>
                <View style={styles.containerFlex}>
                  <Text>Registre los productos:</Text>
                </View>
                <View style={{ flex: 5, alignSelf: 'stretch', flexDirection: 'row'}} >
                  <View style={styles.containerFlex} />
                  <View style={styles.containerFlex}>
                    <Button onPress={
                      () => {
                        if (this.state.add_sales_show_total_units_sales > 1) {
                          this.setState({add_sales_show_total_units_sales: Number(this.state.add_sales_show_total_units_sales) - 1 })
                        }
                      }
                    } title='-' />
                  </View>
                  <View style={styles.containerFlex}>
                    <TextInput editable={false} style={styles.inputFlex} onChangeText={(text) => this.setState({add_sales_show_total_units_sales: text})} value={String(this.state.add_sales_show_total_units_sales)} />
                  </View>
                  <View style={styles.containerFlex}>
                    <Button onPress={() => this.setState({add_sales_show_total_units_sales: Number(this.state.add_sales_show_total_units_sales) + 1 }) } title='+' />
                  </View>
                  <View style={styles.containerFlex} />
                </View>
                {this.renderAddProductsInSales()}
                {/*<TextInput style={styles.input} keyboardType='numeric' placeholder='Cantidad vendidos:' onChangeText={(text) => this.setState({add_sales_date_sale: text})} value={this.state.add_sales_date_sale} />*/}
                <View style={{margin:7}} />
                <Text>Total Productos: {this.state.add_sales_products_total}</Text>
                <View style={{margin:7}} />
                <View style={styles.containerFlex}>
                  <Button onPress={() => this.onPressAddButton('sales')} title='Guardar' />
                </View>
                <View style={{margin:14}} />
              </ScrollView>
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
