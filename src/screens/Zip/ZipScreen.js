import React from 'react';
import { View } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import { HeaderBackwardArrow } from '../../components/Common/Arrow';
import { Styles } from '../../styles/styles';

const ZipScreen = ({ navigation }) => {
  return (
    <>
      <HeaderBackwardArrow navigation={navigation} />
      <View style={styles.container}>
        <Postcode
          style={{ width: '100%', height: '100%' }}
          jsOptions={{ animation: true }}
          onSelected={(data)=>{
            navigation.navigate('ProfileUpdate', data);
          }}
        />
      </View>
    </>
  )
};

const styles = new Styles.ZipScreen();

export default ZipScreen;