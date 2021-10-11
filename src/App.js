import React,{useEffect,useState} from 'react'
import Web3 from 'web3'
import axios from 'axios'
// import logo from './logo.svg';
import './App.css';

function App() {

  const [web3,setWeb3] = useState(null);
  const [add,setAdd] = useState("");
  const [pAdd,setPAdd] = useState("");
  const [loggedInn,setLoggedInn] = useState(false);

  useEffect(()=>{
    console.log("web3 sync started");
    const web3 = new Web3('http://ropsten.infura.io/')
    // const accounts = await web3.eth.getAccounts()
    setWeb3(web3);
  },[])


  // useEffect(()=>{
  //   console.log("web3 changed ",web3);
  //   if(web3 && web3.eth){
  //     var privateKey =  "a2c386f844dcd73d8b762bbaacca7444a0247b1cdc6c59fdaf15cc153dcc11ed";
  //     console.log("eth is ",web3.eth.accounts.sign("hello there", privateKey))
  //   }
  // },[web3]);

  const handleLogout = async()=>{
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `http://127.0.0.1:1234/user/logout`,
        {
          Address:add
        },
        config
      )
      .then(res=>{
        console.log("logout ")
        setLoggedInn(false);
        setAdd("");
        setPAdd("");
      })
      .catch(err => {
        alert("error logging out")
      })
  }

  const handleSubmit = async()=>{
    let timestamp = Date.now();
    var message = `${add}${timestamp}`;
    localStorage.setItem("message",message);
    var hash = web3.utils.sha3(message);
    var signature = web3.eth.accounts.sign(hash,pAdd);
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `http://127.0.0.1:1234/user/login`,
        {
          message:message,
          hash:hash,
          signature:signature,
          Address:add
        },
        config
      ).then(res=>{
        if(res && res.data && res.data.isSuccessfull){
          console.log("response of user",res.data)
          // alert("login ",res.data.message)
          if(res.data.user !== null){
            setLoggedInn(true);
            setTimeout( function() { 
              setLoggedInn(false);
            }, 10000);
          }
          else{
            alert("user not in whitelist")
            setLoggedInn(false);
          }
          setAdd("");
          setPAdd("");
        } 
        else{
          console.log("login failed",res.data);
          alert("login falied ",res.data.message)
          setLoggedInn(false);
          setAdd("");
          setPAdd("");
        }
      })
      .catch(err=>{
        alert("error logging in",err)
      })
  }
  

  return (
    <div className="App">
      {!loggedInn?
      <>
      <h1>
        Login Please
      </h1>
      <input type="text" value={add} onChange={(e)=>setAdd(e.target.value)} placeholder="Address" />
      <input type="text" value={pAdd} onChange={(e)=>setPAdd(e.target.value)} placeholder="private key" />
      <button onClick={handleSubmit}>login</button>
      </>:
      <div>
        <h1>logged in</h1>
        <button onClick={handleLogout}>logout</button>
      </div>
      }
    </div>
  );
}

export default App;
