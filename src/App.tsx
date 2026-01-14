import { useEffect, useState } from 'react'
import './App.css'
import argentinaBandera from '../src/assets/argPng.png'
import brasilBandera from '../src/assets/brasilPng.png'
import axios from 'axios';
function App() {

  const[br, setBr] = useState<number>(0);
  const[cant,setCant] = useState<number>(0);
  const[from, setFrom] = useState('argentina');
  const[to,setTo] = useState('brasil');




  
  useEffect(() => {
  
    
     const fetchRange = async() => {
      const value = Number.isFinite(br) ? br : 0;
      const base = from === 'brasil' ? 'BRL' : 'ARS';
      const target = to === 'brasil' ? 'BRL' : 'ARS';

      const resp = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
      const rate = resp.data.rates[target];

      setCant(Number((value * rate).toFixed(2)));
      
    };

    fetchRange();
  
  
  },[br,from,to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  }


  return (
    <>
    <div className='card'>
      <h2>Conversor</h2>
  <div className="input-group mb-3">
  
  <span >Cantidad</span>
  <br />

    <input type="number" value={Number.isFinite(br) ? br : 0} style={{backgroundImage: `url(${from === 'brasil' ? brasilBandera : argentinaBandera})`, backgroundRepeat: 'no-repeat', backgroundSize: '40px 28px', backgroundPosition: "8px center",  paddingLeft: "50px",   // espacio para que no pise el texto
    height: "40px"}}  onChange={e => setBr(e.target.valueAsNumber)} className="form-control"  aria-label="Dollar amount (with dot and two decimal places)"/>

</div>
<p onClick={swap}> ⇅</p>

<div className="input-group">
   <span className="input-group-text">Se convierte</span>
   <br />
  <input type="text" className="form-control" value={cant} style={{backgroundImage: `url(${to === 'brasil' ? brasilBandera : argentinaBandera})`, backgroundRepeat: 'no-repeat', backgroundSize: '40px 28px', backgroundPosition: "8px center",  paddingLeft: "50px",   // espacio para que no pise el texto
    height: "40px"}}   readOnly placeholder='BRL'aria-label="Dollar amount (with dot and two decimal places)"/>

 
</div>
  </div>
    </>
  )
}

export default App
