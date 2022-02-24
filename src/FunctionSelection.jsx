import React from "react";
import ReactDOM from "react-dom";
import Diagnosis from "./Diagnosis";
import Login from "./Login.jsx";
import classes from"./FunctionSelection.module.css";

export default class FunctionSelection extends React.Component{
    constructor(props){
        super(props);
        this.clickLogout = this.clickLogout.bind(this);
        this.clickIkiikiDiagnoseFace = this.clickIkiikiDiagnoseFace.bind(this);
    }
    clickLogout = ()=>{
        ReactDOM.render(<Login/>,document.getElementById("root"));
    }
    clickIkiikiDiagnoseFace = ()=>{
        ReactDOM.render(<Diagnosis ID={this.props.ID}/>,document.getElementById("root"));
    }

    render(){
        return(
            <>
                <h1>機能選択画面</h1>
                <div className={classes.username}><p>ID:{this.props.ID}</p></div>
                <div className={classes.logout_button}><button onClick={()=>{this.clickLogout()}}>ログアウト</button></div>
                <div className={classes.function_area}>
                <button className={classes.function} onClick={()=>{this.clickIkiikiDiagnoseFace()}}>イキイキ顔診断</button>
                </div>
            </>
        )
    }

}