import { ClientContext } from "../context/ClientContext"
import { useContext } from "react"

export const useClientContext = () => {
  const context = useContext(ClientContext)

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}