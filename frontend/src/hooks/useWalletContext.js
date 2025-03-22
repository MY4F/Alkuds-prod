import { WalletContext } from "../context/WalletContext"
import { useContext } from "react"

export const useWalletContext = () => {
  const context = useContext(WalletContext)

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}