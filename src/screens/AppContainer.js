import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { connect } from 'react-redux';
import Home from './Home';
import Home2 from './Home2';
import Register from './Register';
import Login from './Login';
import Events from './Events';
import UserCargory from './UserCargory';
import BusinessScreen, { FeedbackScreen, MenuScreen } from './BusinessScreen';
import BusinessAdminScreen, { MenuScreenEdit } from './BusinessAdminScreen';
import { Button, Text, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
class AppContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Welcome' }}
          />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen
            name="BusinessScreen"
            component={BusinessScreen}
            options={{ title: 'מידע לגבי בית העסק' }}
          />
          <Stack.Screen
            name="MenuScreen"
            component={MenuScreen}
            options={{ title: 'תפריט' }}
          />
          <Stack.Screen
            name="MenuScreenEdit"
            component={MenuScreenEdit}
            options={{
              title: 'עריכת התפריט',
            }}
          />
          <Stack.Screen
            name="FeedbackScreen"
            component={FeedbackScreen}
            options={{
              title: 'תגובות ודירוג',
            }}
          />
          <Stack.Screen
            name="UserCategory"
            component={UserCargory}
            options={{
              title: 'בחר את הקטגוריה',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="BusinessAdminScreen"
            component={BusinessAdminScreen}
            options={{
              headerBackVisible: false,
              title: 'עריכת המידע של בית העסק',
            }}
          />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
