import cors from 'cors';
import express from 'express';
import axios from 'axios';
import mysql2 from 'mysql2/promise';


const db = mysql2.createPool({
    host: 'localhost',
    database: 'divisas',
    user: 'root',
    password: '46967641',
    port: 3306
});

export function formatSQLDate(sqlDate) {
  const d = new Date(sqlDate);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


app.get('/convert', async(req,res)=>{
    try{
     const response =    await axios.get(`https://open.er-api.com/v6/latest/BRL`);

     res.json({
        brlToArs: response.rates.ARS
     })

    }catch(err){
        console.error(err);
    }
});

app.post('/sethistory', async(req,res)=> {
    const{br,from,to,now} = req.body;

    const fechaSql = formatSQLDate(now);
     try{

        
        await db.query(`INSERT INTO history(from_, to_, amount,fecha)VALUES(?,?,?, ?)`,[
           from,to,br,fechaSql
        ]);

    }catch(err){
        console.error(err);
    }
});

app.get('/history', async(req,res) => {
    const [resp] = await db.query(`SELECT * FROM history LIMIT 3`);
   
        
        res.json({
           history:resp
        })
})


app.listen(PORT, () => {
    console.log("servidor corriendo en 3000")
});

