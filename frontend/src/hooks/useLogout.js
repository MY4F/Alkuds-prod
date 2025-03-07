import { useUserContext } from "./useUserContext"

const useLogout = () =>{
    const { dispatch } = useUserContext()

    const logout = () =>{
        localStorage.removeItem('user');
        dispatch({type:'LOGOUT'})
    }

    return {logout}
}

export default useLogout