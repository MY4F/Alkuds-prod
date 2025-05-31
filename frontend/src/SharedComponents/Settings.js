import React, { useState } from 'react'
import swal from 'sweetalert';
const Settings = () => {

  const [driverName, setDriverName] = useState("")
  const [driverNumber, setDriverNumber] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [clientType, setClientType] = useState("")

  const handleClientAdd = async(e) =>{
    e.preventDefault()
    let obj = {
      "name": clientName,
      "address":clientAddress,
      "isFactory": clientType
    }
    const response = await fetch('/client/addClient',
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json'
        }
      }


    )
    const json = await response.json()
    console.log(json)
    if(response.ok)
        swal ( "تم اضافعه عميل جديد بنجاح." ,"" ,  "success" )
  }


  const handleDriverAdd = async(e) =>{
    e.preventDefault()
    let obj = {
      "name": driverName,
      "mobile":driverNumber
    }
    const response = await fetch('/driver/addDriver',
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json'
        }
      }


    )
    const json = await response.json()
    console.log(json)
    if(json["msg"] === "success")
      swal ( "تم اضافعه العمليه بنجاح." ,  "تم تحديث البانات الماليه" ,  "success" )
  }

  return (
    <div className='setting-holder'>
      <form className='setting-holder-form' onSubmit={e=>handleDriverAdd(e)}>
        <div className="data-input">
          <input name="name" type="text" value={driverName} onChange={e => setDriverName(e.target.value)} required/>
          <label htmlFor="name"> اسم السائق </label>
        </div>
        <div className="data-input">
          <input name="number" type="text" value={driverNumber} onChange={e => setDriverNumber(e.target.value)} required/>
          <label htmlFor="number"> رقم السائق </label>
        </div>
        <button type='submit' className="iron-btn"> اضافه سائق جديد</button>

      </form>
      <form className='setting-holder-form' onSubmit={e=>handleClientAdd(e)}>
      <select required  onChange={(e) => {
                setClientType(e.target.value);
          }} >
            <option disabled selected> اختر نوع  </option>
            <option value="مورد"> مورد </option>
            <option value="عميل"> عميل </option>
             
          </select>
        <div className="data-input">
          <input name="name" type="text" value={clientName} onChange={e => setClientName(e.target.value)} required />
          <label htmlFor="name"> اسم العميل </label>
        </div>
        <div className="data-input">
          <input name="address" type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} required/>
          <label htmlFor="address"> عنوان العميل </label>
        </div>
        <button type='submit' className="iron-btn"> اضافه عميل جديد</button>
      </form>
    </div>
  )
}

export default Settings