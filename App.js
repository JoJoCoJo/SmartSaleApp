/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      view: 'suuuuuuuup? from state',
      categories: {}
    }
  }

  componentDidMount(){
    fetch('http://smart-sale.000webhostapp.com/api/v1/categories/read/')
    .then(
      (res) => {
        return res.json()
      }
    )
    .then(
      (json) => {
        this.setState({categories: json})
      }
    )
  }

  render() {
    return (
      this.state.categories.data === undefined ?
      <View style={styles.loading}>
        {console.log('sssuuuuuup?')}
        <ActivityIndicator size='large' />
      </View>
      :
      <View style={styles.container}>
      { this.state.categories.data.map(
          (category, c) => {
            return (<Text style={styles.instructions} key={c}>Categoria {c+1}: {category.name}</Text>)
          }
        )
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
