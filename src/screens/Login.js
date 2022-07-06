import React, { Component } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { countDown, countUp } from '../actions';
import auth from '@react-native-firebase/auth';
import { setUser } from '../actions/UserActions';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getImage } from '../utils/imageHolder';

GoogleSignin.configure({
  webClientId:
    '798790664697-l4ame1ob6j07mpdtaitvmb7vvgjmjgoe.apps.googleusercontent.com',
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      loading: false,
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
  makeLogin() {
    this.setState({ error: null, loading: true });
    auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ error: null, loading: false });
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.setState({
            error: 'That email address is already in use!',
            loading: false,
          });

          console.log('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          this.setState({
            error: 'That email address is invalid!',
            loading: false,
          });

          console.log('That email address is invalid!');
        } else if (error.code === 'auth/wrong-password') {
          this.setState({
            error: 'The password is invalid',
            loading: false,
          });

          console.log('That password is invalid!');
        } else if (error.code === 'auth/too-many-requests') {
          this.setState({
            error:
              'Access to this account has been temporarily disabled due to many failed login attempts.',
            loading: false,
          });

          console.log(
            'Access to this account has been temporarily disabled due to many failed login attempts.',
          );
        } else {
          console.error(error);
          this.setState({ error: error.message, loading: false });
        }
      });
  }
  async onGoogleButtonPress() {
    this.setState({ error: null, loading: true });

    // Get the users ID token
    try {
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (e) {
      this.setState({
        error: 'failed to connect via google account',
        loading: false,
      });
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f0ead6',
          justifyContent: 'center',
        }}>
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
            placeholder="Your password"
            secureTextEntry={true}
            style={{ borderBottomWidth: 1, flex: 1 }}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        {this.state.error && (
          <Text style={{ color: '#ff4444' }}>{this.state.error}</Text>
        )}
        <TouchableOpacity
          disabled={this.state.loading}
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
          onPress={() => this.makeLogin()}>
          {this.state.loading ? <ActivityIndicator /> : <Text>Login</Text>}
        </TouchableOpacity>
        <Text></Text>
        <Button
          title="login with Goggle"
          onPress={() =>
            this.onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
        <Text></Text>
        <Button
          title="register instead"
          onPress={() => navigation.navigate('Register', { id: '2' })}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
