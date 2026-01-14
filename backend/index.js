import cors from 'cors';
import express from 'express';

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

app.listen(PORT, () => {
    console.log("servidor corriendo en 3000")
})