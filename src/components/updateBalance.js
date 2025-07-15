import axios from 'axios';

export default function updateBalance(amount) {

        axios.get('http://localhost:4000/balance')
        .then(res=>{
            const newBalanceAmount = parseFloat(res.data.amount) + parseFloat(amount);
            axios.put('http://localhost:4000/balance',{amount:newBalanceAmount});
        })
        .catch(err=>alert(err))
}
