// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://iogqlyaeajgbfymkdcwb.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ3FseWFlYWpnYmZ5bWtkY3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyODU2NTIsImV4cCI6MTk5ODg2MTY1Mn0.0Tv9LdzXboO7WryR5iDF7cxNAntI0TXCiFX_sJPV9Ng'

// const supabase = createClient(supabaseUrl, supabaseKey)


// let { data: funds, error } = await supabase
//   .from('funds')
//   .select('*')


// console.log(funds);

// // Define function to retrieve data from Supabase and display in table
// async function showTable() {
//     // Retrieve data from Supabase
//     let { data: funds, error } = await supabase
//       .from('funds')
//       .select('*')
    
//     // If there was an error retrieving the data, log it to the console
//     if (error) {
//       console.error(error)
//       return
//     }
    
//     // If there is no data, display a message to the user
//     if (funds.length === 0) {
//       document.getElementById('table-container').innerHTML = 'No data to display'
//       return
//     }
    
//     // Generate HTML table
//     let tableHtml = '<table><thead><tr><th>id</th><th>funds</th></tr></thead><tbody>'
//     funds.forEach(fund => {
//       tableHtml += `<tr><td>${fund.id}</td><td>${fund.funds}</td></tr>`
//     })
//     tableHtml += '</tbody></table>'
    
//     // Display table in HTML page
//     document.getElementById('table-container').innerHTML = tableHtml
//   }
  
//   // Add event listener to "Show Table" button
//   document.getElementById('show1').addEventListener('click', showTable)


// new code
import express from 'express';
import path from 'path';
import cors from 'cors';
import { supabase } from './supabase.js';

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

const router = express.Router();

router.get('/showfunds', async (req, res) => {
  let { data: funds, error } = await supabase
    .from('funds')
    .select('*');
  
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch funds data' });
  }
  
  return res.json(funds);
});
router.get('/showstocks',async (req,res) => {
  let {data: Stocks,error} = await supabase
  .from('Stocks')
  .select('*');

  if(error) {
    console.error(error);
    return res.status(500).json({error: 'Failed to fetch stocks data'});
  }

  return res.json(Stocks);
});
router.get('/showcmp',async (req,res) => {
  let {data: cmp,error} = await supabase
  .from('cmp')
  .select('*');

  if(error) {
    console.error(error);
    return res.status(500).json({error: 'Failed to fetch cmp data'});
  }
  console.log(res);
  return res.json(cmp);
});
router.post('/transaction', async (req, res) => {
  const newtrade={
    bid:req.body.bid,
    sid:req.body.sid,
    tp:req.body.tp,
    st:req.body.st,
    stid:req.body.stid
  }

  // Check if buyer has sufficient funds
  let { data: buyer, error: buyerError } = await supabase
    .from('funds')
    .select('*')
    .eq('id', newtrade.bid)
    .single();
    if (buyerError) {
      return res.status(500).json({ message: 'Error fetching buyer funds' });
    }
  
    if (buyer.funds < newtrade.tp * newtrade.st) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
  let { data: scheck, error: scheckError } = await supabase
    .from('Stocks')
    .select('*')
    .eq('id', newtrade.sid)
    .single();
    if (scheckError) {
      return res.status(500).json({ message: 'Error fetching sellers stock details' });
    }
  
    if (scheck[newtrade.stid] < newtrade.st) {
      return res.status(400).json({ message: 'Insufficient stocks' });
    }
    const sellerstocks = scheck[newtrade.stid]-newtrade.st;
  const { data: supdate, error: supdateerror } = await supabase
    .from('Stocks')
    .update({ [newtrade.stid]:  sellerstocks})
    .eq('id', newtrade.sid);

  if (supdateerror) {
    return res.status(500).json({ message: 'Error updating seller stocks' });
  }

  let { data: bcheck, error: bcheckError } = await supabase
    .from('Stocks')
    .select('*')
    .eq('id', newtrade.bid)
    .single();
    if (scheckError) {
      return res.status(500).json({ message: 'Error fetching sellers stock details' });
    }
  

    const buyerstocks = bcheck[newtrade.stid]+newtrade.st;
  const { data: bupdate, error: bupdateerror } = await supabase
    .from('Stocks')
    .update({ [newtrade.stid]:  buyerstocks})
    .eq('id', newtrade.bid);

  if (bupdateerror) {
    return res.status(500).json({ message: 'Error updating buyer stocks' });
  }
  // cmp changes

  let { data: cmpData, error: cmpError } = await supabase
  .from('cmp')
  .select('*')
  .eq('id', newtrade.stid)
  .single();
  if (cmpError) {
    return res.status(500).json({ message: 'Error fetching sellers stock details' });
  }

  let change = (newtrade.st*newtrade.tp)-(newtrade.st*cmpData.cmp);   
  let new_price = cmpData.cmp + (change*5)/150;
  // const cmpchange = cmpData.cmp+newtrade.st;
const { data: cmpupdate, error: cmpupdateerror } = await supabase
  .from('cmp')
  .update({ 'cmp':  new_price})
  .eq('id', newtrade.stid);

if (cmpupdateerror) {
  return res.status(500).json({ message: 'Erroe fetching cmp error' });
}

  // Update buyer and seller funds
  const buyerFunds = buyer.funds - newtrade.tp * newtrade.st;

  const { data: seller, error: sellerError } = await supabase
    .from('funds')
    .select('*')
    .eq('id', newtrade.sid)
    .single();

  if (sellerError) {
    return res.status(500).json({ message: 'Error fetching seller funds' });
  }

  const sellerFunds = seller.funds + newtrade.tp * newtrade.st;

  const { data: buyerUpdate, error: buyerUpdateError } = await supabase
    .from('funds')
    .update({ funds: buyerFunds })
    .eq('id', newtrade.bid);

  if (buyerUpdateError) {
    return res.status(500).json({ message: 'Error updating buyer funds' });
  }

  const { data: sellerUpdate, error: sellerUpdateError } = await supabase
    .from('funds')
    .update({ funds: sellerFunds })
    .eq('id', newtrade.sid);

  if (sellerUpdateError) {
    return res.status(500).json({ message: 'Error updating seller funds' });
  }

  return res.status(200).json({ message: 'Transaction successful' });
});


// router.post('/trade',async (req,res)=>{
//   console.log(JSON.stringify(req.body));
//   const newmember={
//     bid:req.body.bid,
//     sid:req.body.sid,
//     tp:req.body.tp,
//     st:req.body.st,
// }

// const { data, error } = await supabase
// .from('funds')
// .update({ funds: })
// .eq('some_column', 'someValue')

// connection= async ()=>{
//   var result = await db.promise("SELECT * FROM users");
//   // console.log(result);
//   return result;
// }
// connection().then((result)=>{
//   var members=(result);
//   const found1=members.some((members=>members.user_email===(newmember.user_email)));
//   const found2=members.some((members=>members.user_password===(newmember.user_password)));
//   if(found1 && found2){
//       var s=(members.filter(members=>members.user_email===(newmember.user_email)));
//       console.log(s[0].user_id);
//       res.json(s[0]);
//   }
//   else{
//       res.json("invalid login credentials");
//   }});
// });





app.use(router);
export default app;

