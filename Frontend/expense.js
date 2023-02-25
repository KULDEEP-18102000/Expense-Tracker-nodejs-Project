const username=document.getElementById('name')
const useremail=document.getElementById('email')
const userpassword=document.getElementById('password')

document.getElementById('my-form').addEventListener('submit',onSubmit);

async function onSubmit(e){
    e.preventDefault();
    my_obj={
        name:username.value,
        email:useremail.value,
        password:userpassword.value
    }
    const response=await axios.post('http://localhost:3000/user',my_obj)
    if(response.data.message=="user already exists"){
        document.body.innerHTML=document.body.innerHTML+'<h3>User already exists</h3>'
    }
    console.log(response)
}