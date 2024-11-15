import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '저장공간 액세스 권한 요청',
          message: '파일을 다운로드하려면 저장공간에 액세스해야 합니다. 허용하시겠습니까?',
          buttonNegative: "아니오",
          buttonPositive: "네"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};