import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import {
  selectError,
  selectLoading,
  setLoading,
  setUser,
  signinRequest,
} from '../app/slices/userSlice';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import Loader from '../components/Loader';

GoogleSignin.configure({
  webClientId:
    '922634262242-8nukk0um4uqa04trthh7dttdrsui30ht.apps.googleusercontent.com',
});

export default function AuthScreen({navigation}: any) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser({name: user.displayName, uid: user.uid}));
        navigation.replace('Home');
      }

      if (loading) {
        dispatch(setLoading(false));
      }
    });
    return subscriber;
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <View>
          <MaterialCommunityIcons name={'react'} size={200} color="#61dbfb" />
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => {
              dispatch(signinRequest());
            }}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    color: 'red',
    textAlign: 'center',
  },
});
