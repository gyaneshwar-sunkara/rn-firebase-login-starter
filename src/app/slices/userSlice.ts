import {createSlice} from '@reduxjs/toolkit';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('Users');

/**
 * Initial state
 */
const initialState = {
  uid: '',
  name: '',
  age: '',
  stored: false,
  loading: true,
  error: '',
};

/**
 * Slice
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.age = action.payload.age;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStored: (state, action) => {
      state.stored = action.payload;
    },
  },
});

/**
 * Reducer
 */
export default userSlice.reducer;

/**
 * Actions
 */
export const {setUser, setStored, setLoading, setError} = userSlice.actions;

/**
 * Selectors
 */
export const selectUid = (state: any) => state.user.uid;
export const selectName = (state: any) => state.user.name;
export const selectAge = (state: any) => state.user.age;
export const selectStored = (state: any) => state.user.stored;
export const selectLoading = (state: any) => state.user.loading;
export const selectError = (state: any) => state.user.error;

/**
 * Thunks
 */

export const signinRequest = () => (dispatch: any) => {
  dispatch(setLoading(true));

  GoogleSignin.signIn()
    .then(user => {
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);

      auth()
        .signInWithCredential(googleCredential)
        .then(() => {
          // Invokes onAuthStateChanged listener
        })
        .catch(err => {
          dispatch(setError(err));
        });
    })
    .catch(err => {
      dispatch(setError(err));
    });
};

export const checkUserRequest = () => async (dispatch: any, getState: any) => {
  dispatch(setLoading(true));
  const uid = selectUid(getState());

  let user: any;
  try {
    user = await firestore().collection('Users').doc(uid).get();
    if (user._exists) {
      const {uid, name, age} = user._data;
      dispatch(setUser({uid, name, age}));
      dispatch(setStored(true));
    }
  } catch (error) {
    dispatch(setError(error));
  }

  dispatch(setLoading(false));
};

export const addUserRequest =
  ({name, age}: any) =>
  (dispatch: any, getState: any) => {
    dispatch(setLoading(true));

    const uid = selectUid(getState());

    firestore()
      .collection('Users')
      .doc(uid)
      .set({
        name,
        age,
      })
      .then(() => {
        dispatch(setUser({uid, name, age}));
        dispatch(setStored(true));
        dispatch(setLoading(false));
      })
      .catch((error: any) => {
        dispatch(setError(error));
        dispatch(setLoading(false));
      });
  };
