import { fetchBoardNewDataRequest } from '../services/api/ServerApi';

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