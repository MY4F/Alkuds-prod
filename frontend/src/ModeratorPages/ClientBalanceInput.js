import { useUserContext } from "../hooks/useUserContext";
import { useClientContext } from "../hooks/useClientContext";
import { useState } from "react";
import LoadingButton from "../SharedComponents/LoadingButton";

const ClientBalanceInput = () =>{
    const {  user } = useUserContext();
    const { client } = useClientContext();
    const [balance, setBalance] = useState(client)
    const [ isLoading, setIsLoading ] = useState(false);
    if(!client){
        return <div> Loading.... </div>
    }
    const handleUpdate = async(e) =>{
        e.preventDefault();
        setIsLoading(true)
        try{
            console.log(balance)
            const response = await fetch('/client/updateBalances',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({balance})
            });

            if(!response.ok) throw new Error('Failed to update balances');

            const result = await response.json();
            if(response.ok){
                console.log(result);
                alert('تم التحديث بنجاح')
                window.location.reload();
            }
        }catch(err){
            console.error(err);
            alert('حدث خطأ أثناء التحديث')
        }
        setIsLoading(false)
    }
    return (
        <div className="clients-container" dir="rtl">
            {balance && Object.entries(balance).map(([key, value]) => (
                <div key={key} style={{"display":"flex","flexDirection":"row","alignItems":'center',"justifyContent":'center',"gap":"20px"}}>
                    <p style={{"width":"40%"}}>
                    {value.name}
                    </p>
                    <input style={{"width":"40%", "margin":"5px"}} type="number" step="any" value={parseFloat(value.balance)} onChange={(e) => {
                       const newBalance = e.target.value;
                       setBalance((prev) => ({
                         ...prev,
                         [key]: { ...prev[key], balance: parseFloat(newBalance) }, 
                       }));
                    }}/>
                </div>
            ))}
            <LoadingButton
              onClick={(e) => handleUpdate(e)}
              defaultText="حفظ التغيرات"
              loadingText="يتم الحفظ ..."
              className="print-submit w-[300px]"
              loading={isLoading}
            />
        </div>
    )
}


export default ClientBalanceInput