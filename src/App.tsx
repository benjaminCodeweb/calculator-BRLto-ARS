import { useEffect, useState } from 'react'
import './App.css'
import argentinaBandera from '../src/assets/argPng.png'
import brasilBandera from '../src/assets/brasilPng.png'
import axios from 'axios';

type History = {
  amount: number,
  from_:string,
  to_:string,
  fecha:string
}
function App() {

  const[br, setBr] = useState<number>(0);
  const[cant,setCant] = useState<number>(0);
  const[from, setFrom] = useState('argentina');
  const[to,setTo] = useState('brasil');
  const[rate,setRate] = useState();
  const[history,setHistory] = useState<History[]>([]);
  const[show,setShow] = useState(false);

  

  const sendData =async() => {
    

    if(br <= 0)return;
   const win =  window.confirm('Desea guardar historial');

   if(!win) return;
      try{
        const now = new Date();
        
      await axios.post('http://localhost:3000/sethistory', {br,from,to,now});
        }catch(err){
          console.error(err);
        }
    }

      const handleHistory = async() => {
    
        
      try{
      const res =   await axios.get('http://localhost:3000/history');
        
      setHistory(res.data.history);
    
      }catch(err){
        console.error(err);
      }
    }

  useEffect(() => {
      
     const fetchRange = async() => {
      const value = Number.isFinite(br) ? br : 0;
      const base = from === 'brasil' ? 'BRL' : 'ARS';
      const target = to === 'brasil' ? 'BRL' : 'ARS';
      

      const resp = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
      const rate = resp.data.rates[target];
      

      setCant(Number((value * rate).toFixed(2)));
      setRate(rate);
      
    };
    
    
    handleHistory();
    fetchRange();

     
  
  
  },[br,from,to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    sendData();
  }


  

 


  return (
    <>
    
    <div className='card'>
       <button onClick={() => setShow(!show)}>Historial</button>
     
      <nav>
       
      </nav>
      {show && history.map((h,index)=> (
        <div key={index}>
          <p>desde: {h.amount}</p>
          <p>de: {h.from_}</p>
          <p>monto: {h.to_}</p>
          <p>fecha: {h.fecha}</p>

        </div>
      ))}
      
      
      
      <p style={{color: 'red'}}>Cotizacion: {rate} </p>
  <div className="input-group mb-3">
  
  <span >Cantidad</span>
  <br />

    <input type="number"  value={Number.isFinite(br) ? br : 0} style={{ borderRadius: '5px',backgroundImage: `url(${from === 'brasil' ? brasilBandera : argentinaBandera})`, backgroundRepeat: 'no-repeat', backgroundSize: '40px 28px', backgroundPosition: "8px center",  paddingLeft: "50px",   // espacio para que no pise el texto
    height: "40px"}}  onChange={e => setBr(e.target.valueAsNumber)} className="form-control"  aria-label="Dollar amount (with dot and two decimal places)"/>

</div>
<div style={{padding: '10px'}} onClick={swap}> ⇅</div>

<div className="input-group">
   <span className="input-group-text">Se convierte</span>
   <br />
  <input type="text" className="form-control" value={cant} style={{borderRadius: '5px',backgroundImage: `url(${to === 'brasil' ? brasilBandera : argentinaBandera})`, backgroundRepeat: 'no-repeat', backgroundSize: '40px 28px', backgroundPosition: "8px center",  paddingLeft: "50px",   // espacio para que no pise el texto
    height: "40px"}}   readOnly placeholder='BRL'aria-label="Dollar amount (with dot and two decimal places)"/>

 
</div>
  </div>
    </>
  )
}

export default App
