import React from 'react'
import './App.css';
import web3 from './web3';
import lottery from './lottery'

class App extends React.Component{
  // constructor(props){
  //   super(props);
  //   this.state = {manager : ''};
  // }
  // the below  code is equivalent for declaring the constrictor
  state = {
    manager : "",
    players : [],
    balance : "",
    value : "",
    message : ""
  };
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance });
  }
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message : "Hang On! transaction is completing..."});
    await lottery.methods.enter().send({
      from : accounts[0],
      value :web3.utils.toWei(this.state.value,'ether')
    })
    this.setState({message : "hooray! transaction completed"});
    console.log(this.state.players)

  }
  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message : "Hang On! transaction is completing..."});
    await lottery.methods.pickWinner().send({
      from : accounts[0]
    })
    this.setState({message : 'winner has picked!'});
  }
  render(){
    return(
      <div>
        <h2> Lottery Contract</h2>
        <p>This Contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered into contract
            competing to win {web3.utils.fromWei(this.state.balance,'ether')} eth! </p>

      <hr/>
      <form onSubmit = {this.onSubmit}>
        <h4>want to try your luck ? </h4>
        <div>
        <label> amount of ether to enter </label>
        <input
          value = {this.state.value}
          onChange = {event => this.setState({value : event.target.value})}
        />
        </div>
        <button>Enter</button>
      </form>
      <hr/>
        <h4>Ready to pick the winner ? </h4>
        <button onClick={this.onClick} >pick a winner </button>
      <hr/>
      <h1>{this.state.message}</h1>
      </div>
    );
  }

}
export default App;
