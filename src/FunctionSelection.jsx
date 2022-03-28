import React from "react";
import ReactDOM from "react-dom";
import Diagnosis from "./Diagnosis";
import Login from "./Login";
import classes from"./FunctionSelection.module.css";

export default class FunctionSelection extends React.Component{
    constructor(props){
        super(props);
        this.clickLogout = this.clickLogout.bind(this);
        this.clickIkiikiDiagnoseFace = this.clickIkiikiDiagnoseFace.bind(this);
        this.state= {callback:this.props.callback}
    }
    clickLogout = () =>{
        this.state.callback(Login.name)
    }
    clickIkiikiDiagnoseFace = () => {
       this.state.callback(Diagnosis.name)
    }

    render(){
        let errMsg=null;
        let ikiikiData=[]; 
        let noDataMsg= null
        if(this.props.hasReadIkiikiResult){
            if(this.props.ikiikiResults.length > 0){
                for(let i=0;i <this.props.ikiikiResults.length;i++){
                    let styleData;
                    let diagnosedData = this.props.ikiikiResults[i];
                    if(diagnosedData["ikiikiValue"]<50){
                        styleData="rgb(255, 125, 125)";
                    }else{
                        styleData="transparent";
                    }
                    ikiikiData.push(<tr key={i} style={{backgroundColor:styleData}}><td>{diagnosedData["diagnosedDate"]}</td><td>{diagnosedData["ikiikiValue"]}</td></tr>);
                }
            }else{
                noDataMsg = "まだイキイキ度が登録されていません。";
            }
        }else{
            errMsg = "過去のデータの読み込みに失敗しました。\n過去の記録を閲覧したい場合は一度ログアウトして再度ログインしてください。";
        }
        return(
            <>
                <h1>機能選択画面</h1>
                <p className={classes.error_message}>{errMsg}</p>
                <div className={classes.username}><p>ID:{this.props.ID}</p></div>
                <div className={classes.logout_button}><button onClick={this.clickLogout} id="logout">ログアウト</button></div>
                <div className={classes.function_area}>
                <button className={classes.function} onClick={this.clickIkiikiDiagnoseFace} id="diagnoseFace">イキイキ顔診断</button>
                </div>
                <div className={classes.table}>
                <div className={classes.table_area}>
                <p>{this.props.ID}さんの過去のイキイキ度の記録</p>
                <p>{noDataMsg}</p>
                    <table border="2" width="650">
                    <thead>
                    <tr>
                        <th width="50%">登録日</th>
                        <th>イキイキ度</th>
                    </tr>
                    </thead>
                    <tbody>{ikiikiData}</tbody>
                    </table></div>
                    </div>
            </>
        )
    }

}