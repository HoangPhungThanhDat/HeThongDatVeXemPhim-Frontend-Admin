import axios from "./AxiosAdmin";
const AuthApi = {
    Login: (Credentials)=> axios.post("/login", Credentials),
    Logout: (Credentials)=> axios.post("/logout", Credentials),
};
export default AuthApi;