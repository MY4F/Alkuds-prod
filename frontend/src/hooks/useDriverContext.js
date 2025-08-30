import { DriverContext } from "../context/DriverContext"
import { useContext } from "react"

export const useDriverContext = () => {
  const context = useContext(DriverContext)

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}