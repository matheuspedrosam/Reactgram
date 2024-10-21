import axios from 'axios';
import { MAIN_CONFIGS } from '../../mainConfigs';

const api = `${MAIN_CONFIGS.API_URL}/api/`;

export default function useGetData() {

    async function getData(endPoint, user){
        try{
            const res = await axios.get(api+endPoint, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if(res.status === 200){
                return res.data;
            }
        } catch (e){
            throw new Error(e);
        }
    }

    return { getData }
}
