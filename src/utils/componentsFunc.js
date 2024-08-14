import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBoardNewDataRequest, fetchPersonalInfoRequest } from '../services/api/ServerApi';

export async function fetchPersonalInfo() {
  try {
    const meInfoResponse = await fetchPersonalInfoRequest();
    const userData = meInfoResponse.data;
    const keys = Object.keys(userData);
    const promises = keys.map(key => 
      AsyncStorage.setItem(key, JSON.stringify(userData[key]))
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch personal info');
  }
}

export async function fetchBoardNewData(bo_table, setBoardWrites, params ) {
  try {
    const response = await fetchBoardNewDataRequest(bo_table, params);
    const data = response.data;
    if (Array.isArray(data)) {
      setBoardWrites(data);
    } else {
      console.error('API response data is not in the expected format:', data);
    }
  } catch(error) {
    console.error(JSON.stringify(error));
  }
}

export const handleInputChange = (name, value, setFormValue) => {
  setFormValue(prevState => ({
    ...prevState,
    [name]: value,
  }));
};