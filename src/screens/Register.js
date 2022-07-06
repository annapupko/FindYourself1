import React, { Component } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { countDown, countUp } from '../actions';
import auth from '@react-native-firebase/auth';
import { setUser } from '../actions/UserActions';
import { getImage } from '../utils/imageHolder';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      error: null,
    };
    this.subscriber = null;
  }
  onAuthStateChanged(user) {
    this.props.setUser(user, this.props.navigation);
  }
  componentDidMount() {
    this.subscriber = auth().onAuthStateChanged(
      this.onAuthStateChanged.bind(this),
    );
  }
  componentWillUnmount() {
    if (this.subscriber) {
      this.subscriber();
    }
  }
  makeRegister() {
    this.setState({ error: null });
    if (this.state.confirmPassword == this.state.password) {
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            this.setState({ error: 'That email address is already in use!' });
          } else if (error.code === 'auth/invalid-email') {
            console.log('');
            this.setState({ error: 'That email address is invalid!' });
          } else {
            this.setState({ error: error.message });
            console.error(error);
          }
        });
    } else {
      console.log(this.state.confirmPassword, this.state.password);
      this.setState({ error: "The passwords isn't match" });
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex:1,backgroundColor: '#f0ead6',justifyContent:'center' }}>
        <Image
          source={getImage('logo')}
          resizeMode="contain"
          style={{ width: '100%', height: 100 }}
        />
        <View
          style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
          <Text style={{ minWidth: 75 }}>Email</Text>
          <TextInput
            placeholder="my@email.com"
            keyboardType="email-address"
            style={{ borderBottomWidth: 1, flex: 1 }}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </View>
        <View
          style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
          <Text style={{ minWidth: 75 }}>Password</Text>
          <TextInput
            placeholder="Super secret password"
            secureTextEntry={true}
            style={{ borderBottomWidth: 1, flex: 1 }}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        <View
          style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
          <Text style={{ minWidth: 75 }}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm your password"
            secureTextEntry={true}
            style={{ borderBottomWidth: 1, flex: 1 }}
            value={this.state.confirmPassword}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
        </View>
        {this.state.error && (
          <Text style={{ color: '#ff4444' }}>{this.state.error}</Text>
        )}
        <TouchableOpacity
          style={[
            {
              margin: 10,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              alignItems: 'center',
            },
            { backgroundColor: '#fff' },
          ]}
          onPress={() => this.makeRegister()}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});
const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
