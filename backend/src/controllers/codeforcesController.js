import axios from 'axios';

// Fetch Codeforces user info
export const getUserInfo = async (req, res) => {
  try {
    const { handle } = req.params;
    if (!handle) {
      return res.status(400).json({ message: 'Handle is required' });
    }
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (response.data.status !== 'OK') {
      return res.status(500).json({ message: 'Failed to fetch Codeforces user info', error: response.data.comment });
    }
    const userInfo = response.data.result[0];
    res.json(userInfo);
  } catch (error) {
    console.error('Codeforces getUserInfo error:', error);
    res.status(500).json({ message: 'Failed to fetch Codeforces user info', error: error.message });
  }
};
