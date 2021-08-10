Moralis.initialize(""); // Application id from moralis.io
Moralis.serverURL = ""; //Server url from moralis.io

const tokenAddress = "" //token address in the network you are working with 
/* If you try with special cases of ERC20 like chainlink which is an ERC-677 this code might not work, focus in the transaction passing correctly to metamask */

const web3 = new Web3(window.ethereum);

//frontend logic

async function login(){
  document.getElementById('submit').setAttribute("disabled", null);
  document.getElementById('username').setAttribute("disabled", null);
  document.getElementById('useremail').setAttribute("disabled", null);
  Moralis.Web3.authenticate().then(function (user) {
      user.set("name",document.getElementById('username').value);
      user.set("email",document.getElementById('useremail').value);
      user.save();
      document.getElementById("amountToken").removeAttribute("disabled");
      document.getElementById("transfer").removeAttribute("disabled");
      document.getElementById("sendTo").removeAttribute("disabled");
  })
}

async function transfer(){
  const recipient = document.getElementById("sendTo").value;
  
  const amount = getWei(document.getElementById("amountToken").value)
  
  const encodedFunction = web3.eth.abi.encodeFunctionCall({
    name: "transfer",
    type: "function",
    inputs: [{
      type: 'address',
      name: '_to'
      },
      {
      type: 'uint256',
      name: '_value'
      }]
  }, [recipient,amount]);

  const transactionParameters = {
    to: tokenAddress,
    from: ethereum.selectedAddress,
    data: encodedFunction
  };
  const txHash = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters]
  });
  console.log(txHash);
}


// values in Wei are huge, for managing bit quantities in your front end correctly this function is not enough, you need to use a big numbers function
function getWei(_value){
  const result = parseInt(web3.utils.toWei(_value, 'ether')).toString();
  return result;
}