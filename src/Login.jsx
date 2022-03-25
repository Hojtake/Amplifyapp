import React from "react";
import ReactDOM from "react-dom";
import FunctionSelection from "./FunctionSelection";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import classes from "./Login.module.css";


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.clickLogin = this.clickLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangePassWord = this.handleChangePassWord.bind(this);
        this.state = { message: "", ID: "", password: "",cursorWait:false ,disabled:false}
    }

    clickLogin = () => {
        this.setState({cursorWait:true});
        this.setState({disabled:true});
        let hasReadIkiikiResult = false;
        let ikiikiResults = null;
        if (String(this.state.password).match(/[A-Za-z0-9]+/) == null || String(this.state.ID).match(/[A-Za-z0-9]+/) == null) {
            this.setState({cursorWait:false});
            this.setState({disabled:false});
            return;
        }
        const api = new IkiikiFaceDiagnoseAPI();
        api.callLoginAPI(this.state.ID, this.state.password)
            .then(result => {
                //console.log(result);
                //resultがnull,undefinedな場合にエラーとして処理を行う
                if (!result) {
                    throw new Error();
                }
                if (result.hasLoginAuthenticated && result.ID) {
                    api.readIkiikiResultAPI(result.ID).then(result=>{

                        if(result.hasReadIkiikiResult){
                            if(result.ikiikiResults == null){
                                ikiikiResults = [];
                            }else{
                                ikiikiResults = result.ikiikiResults;
                            }
                            hasReadIkiikiResult = result.hasReadIkiikiResult;
                        }
                        
                    }).finally(()=>{
                        this.setState({cursorWait:false});
                        this.setState({disabled:false});
                        ReactDOM.render(<FunctionSelection ID={this.state.ID} ikiikiResults={ikiikiResults} hasReadData={hasReadIkiikiResult}/>,document.getElementById("root"));
                    })
                } else {
                    if (!result.message) {
                        throw new Error();
                    }
                    this.setState({cursorWait:false});
                    this.setState({disabled:false});
                    this.setState({ message: result.message });
                }
            }).catch(() => {
                this.setState({cursorWait:false});
                this.setState({disabled:false});
                this.setState({ message: "予期しないエラーが発生しました。しばらく待ってから再度実行してください。" });

            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleChangeID = (e) => {
        this.setState({ ID: e.target.value });
    }

    handleChangePassWord = (e) => {
        this.setState({ password: e.target.value });
    }

    render() {
        if(this.state.cursorWait){
            document.body.style.cursor = "wait";
        }else{
            document.body.style.cursor = "auto";
        }
        return (
            <>
                <h1>イキイキ顔診断　ログイン画面</h1>
                <div className={classes.main}>
                    <form onSubmit={this.handleSubmit}>
                        ID<br />
                        <input type="text" className={classes.box1} placeholder="ID" id="ID" pattern="^[0-9a-zA-Z]+$" title="半角英数字のみ入力してください" required value={this.state.ID} onChange={this.handleChangeID}></input><br />
                        パスワード<br />
                        <input type="password" className={classes.box2} placeholder="Password" id="password" pattern="^[0-9a-zA-Z]+$" title="半角英数字のみ入力してください" required value={this.state.password} onChange={this.handleChangePassWord}></input>
                        <button type="submit" onClick={this.clickLogin} disabled={this.state.disabled}>ログイン</button>
                        <div className={classes.errMessage} id="errMsg">
                            <p>{this.state.message}</p>
                        </div>
                    </form>
                </div>
            </>
        )
    }
}