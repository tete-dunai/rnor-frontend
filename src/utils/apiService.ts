interface CalculationRequest {
  departure: string;
  return: string;
  avg_days: number;
}

interface FYData {
  fy: string;
  status: string;
}

interface CalculationResponse {
  status: string;
  output: FYData[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mukundlahoty.pythonanywhere.com/';

export const calculateRNORStatus = async (data: CalculationRequest): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: result.message || 'Something went wrong.',
      };
    }

    return result;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      status: 'error',
      message: 'Please retry after some interval.',
    };
  }
};

export const listSheets = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sheets`);
    const result = await response.json();
    return result.sheets;
  } catch (error) {
    console.error('Failed to fetch sheets:', error);
    throw error;
  }
};
