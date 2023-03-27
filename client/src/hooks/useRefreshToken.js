import axios from 'axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        
        const response = await axios.get(`${process.env.REACT_APP_URL}/refresh`, {
            withCredentials: true
        });
        setAuth(prev => {
            return {
                ...prev,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;