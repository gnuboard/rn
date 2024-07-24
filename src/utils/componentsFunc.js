import { fetchBoardNewDataRequest, fetchWriteRequest } from '../services/api/ServerApi';

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

export async function fetchWrite(bo_table, wr_id, setWrite) {
  try {
    const response = await fetchWriteRequest(bo_table, wr_id);
    const data = response.data;
    setWrite(data);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}