import { useState } from "react";
import { useUserContext } from "./useUserContext";
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useUserContext();
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    let cred = JSON.stringify({ username, password});
    const response = await fetch(`/user/login`, {
      method:"POST",
      body: cred,
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : '*'
      }
    })
    const json = await response.json();
    if(response.ok && json.status ==="success"){
      console.log(json)
      localStorage.setItem("user", JSON.stringify(json.msg));
      // update the auth context
      dispatch({ type: "LOGIN", payload: json.msg });
      setIsLoading(false);
    }
    else{
      setError(json.msg)
      setIsLoading(false);
    }
    
  };

  return { login, isLoading, error };
};
