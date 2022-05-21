import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Input, Text} from '@rneui/base';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {
  addUserRequest,
  checkUserRequest,
  selectAge,
  selectError,
  selectLoading,
  selectName,
  selectStored,
} from '../app/slices/userSlice';
import Loader from '../components/Loader';

interface UserValues {
  name: string;
  age: string;
}

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const name = useAppSelector(selectName);
  const age = useAppSelector(selectAge);
  const stored = useAppSelector(selectStored);

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(checkUserRequest());
  }, []);

  const initialValues: UserValues = {
    name: name,
    age: age,
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number()
      .required('Age is required')
      .min(0, 'Age must be greater than 0')
      .max(200, 'Age out of range'),
  });

  function UserForm() {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          dispatch(addUserRequest({name: values.name, age: values.age}));
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <View>
            <View>
              <Input
                label="Name"
                placeholder="Please enter your name"
                keyboardType="default"
                autoFocus
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                errorMessage={touched.name ? errors.name : ''}
              />

              <Input
                label="Age"
                placeholder="Please enter your age"
                keyboardType="numeric"
                onChangeText={handleChange('age')}
                onBlur={handleBlur('age')}
                value={values.age}
                errorMessage={touched.age ? errors.age : ''}
              />
            </View>
            <Button
              onPress={handleSubmit}
              containerStyle={userFormStyles.submitButton}
              title="Submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </View>
        )}
      </Formik>
    );
  }

  const userFormStyles = StyleSheet.create({
    submitButton: {
      margin: 10,
    },
  });

  function UserDetails() {
    return (
      <View>
        <Text h3>{name}</Text>
        <Text h4>{age}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? <Loader /> : !stored ? <UserForm /> : <UserDetails />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
