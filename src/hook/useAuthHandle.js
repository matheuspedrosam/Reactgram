import { useAuthContext } from "./useAuthContext";
import axios from 'axios';
import { MAIN_CONFIGS } from "../../mainConfigs.js";

const api = `${MAIN_CONFIGS.API_URL}/api/users/`;

export default function useAuthHandle() {
    const { setUser } = useAuthContext();

    async function handleRegister(user){
        if(user.password != user.confirmPassword) {
            throw new Error("As senhas não condizem!");
        }
        delete user.confirmPassword;

        try{
            const res = await axios.post(api + "create", user);
            if (res.status === 201) {
                localStorage.setItem("user", JSON.stringify(res.data));
                setUser(res.data);
                return user.data;
            }
        } catch (error) {
            if (error.response.data.error) {
                console.log("Erro do servidor:", error.response.data.error);
                throw new Error(error.response.data.error);
            } else {
                console.log(error);
                throw new Error("Erro, por favor, tente novamente mais tarde!");
            }
        }
    }

    async function handleLogin(user){
        try{
            const res = await axios.post(api + "login", user);
            if (res.status === 200) {
                localStorage.setItem("user", JSON.stringify(res.data));
                setUser(res.data);
                return user.data;
            }
        } catch (error) {
            if (error.response.data.error) {
                console.log("Erro do servidor:", error.response.data.error);
                throw new Error(error.response.data.error);
            } else {
                console.log(error);
                throw new Error("Erro, por favor, tente novamente mais tarde!");
            }
        }
    }

    async function handleSignOut() {
        localStorage.removeItem("user");
        setUser(null);
    }

    return { handleRegister, handleLogin, handleSignOut }

}
