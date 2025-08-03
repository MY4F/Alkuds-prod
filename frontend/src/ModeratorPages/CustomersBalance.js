import React, { useEffect, useState } from "react";

import { useClientContext } from "../hooks/useClientContext";
import CustomerTable from "../SharedComponents/CustomerTable";

const CustomersBalance = () => {
  const { client } = useClientContext();
  const clientsArray = Object.values(client);
  const [clients, setClients] = useState([]);
  const [factoryClients, setFactoryClients] = useState([]);

  useEffect(() => {
    if (client) {
      const arr = Object.entries(client).map(([id, data]) => ({
        id,
        ...data,
      }));
      
      setClients(arr.filter(c=> c.isClient));
      setFactoryClients(arr.filter(c=> c.isFactory))
    }
  }, [client]);

 
  return (
   <>
    <CustomerTable clients={clients} clientType={'العملاء'}/>
    <CustomerTable clients={factoryClients} clientType={'الموردين'} />
   </>
  );
};

export default CustomersBalance;
