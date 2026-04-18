import axios from 'axios';

interface PathaoToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

let cachedToken: PathaoToken | null = null;
let tokenExpiry: Date | null = null;

const getAccessToken = async (): Promise<string> => {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken.access_token;
  }

  const response = await axios.post(
    `${process.env.PATHAO_API_BASE_URL}/aladdin/api/v1/issue-token`,
    {
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_USERNAME,
      password: process.env.PATHAO_PASSWORD,
      grant_type: 'password'
    }
  );

  cachedToken = response.data;
  // Expire token 5 minutes early to be safe
  tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
  return cachedToken.access_token;
};

export const createBulkOrder = async (orders: any[]): Promise<any> => {
  const token = await getAccessToken();
  const response = await axios.post(
    `${process.env.PATHAO_API_BASE_URL}/aladdin/api/v1/orders/bulk`,
    { orders },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const getOrderStatus = async (consignmentId: string): Promise<any> => {
  const token = await getAccessToken();
  const response = await axios.get(
    `${process.env.PATHAO_API_BASE_URL}/aladdin/api/v1/orders/${consignmentId}/info`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
