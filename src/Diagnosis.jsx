
import React from "react";
import FunctionSelection  from "./FunctionSelection.jsx";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import classes from "./Diagnosis.module.css";
export default class Diagnosis extends React.Component {
    constructor(props){
        super(props);
        this.clickReturnToFunctionSelection = this.clickReturnToFunctionSelection.bind(this);
        this.clickDiagnose = this.clickDiagnose.bind(this);
        this.clickImageSelect = this.clickImageSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickImageSelect = this.handleClickImageSelect.bind(this);
        this.state={resistDayMessage:null,resultMessage:null,operationMessage:"・画像選択ボタンを押してください",photoimage:"",marginTop:0,cursorWait:false, curs:true,
            callback:this.props.callback,
            setIkiikiResults:this.props.setIkiikiResults

        };
    }
    
    //画像をアップロードしたときに画像表示領域に画像を表示する関数
    clickImageSelect= (e)=>{
        
        this.setState({resultMessage:null});
        this.setState({resistDayMessage:null});
        const filelist = e.target.files;
        if(filelist.length == 0) return;
        this.setState({photoimage:""});
        const reader = new FileReader();
        const faceImage = new Image();
        const file = filelist[0];
        reader.onload = function (e) {
            faceImage.onload = function () {
                //画像表示領域の横幅(px)
                const windowWidth = 700;
                //画像表示領域の縦幅(px)
                const windowHeight =400;
                //画像表示領域の縦横比
                const windowRatio=windowHeight/windowWidth;
                //表示する画像の横幅
                let imageWidth;
                //表示する画像の縦幅
                let imageHeight;
                const ratio = faceImage.height / faceImage.width;
                //縦横比に応じて画面表示領域にフィットするようにimgのwidth,heightを決定する。
                if (ratio > windowRatio) {
                    //画像の縦幅を画像表示領域に合わせてフィットさせる
                    imageHeight = windowHeight;
                    imageWidth =faceImage.width * windowHeight / faceImage.height;
                }
                else {
                    //画像の横幅を画像表示領域に合わせてフィットさせる
                    imageHeight = faceImage.height * windowWidth / faceImage.width;
                    imageWidth=windowWidth;
                }
                //画像を画像表示領域内に埋め込む
                const imgdata = <img src={e.target.result} width={imageWidth} height={imageHeight} id="getimg"/>;
                this.setState({photoimage:imgdata});
                this.setState({disabled:false});
                if(imageHeight<700){
                    this.setState({marginTop:(windowHeight-imageHeight)/2})
                }
            }.bind(this)
            faceImage.src= e.target.result;
        }.bind(this)
        reader.readAsDataURL(file);
        this.setState({operationMessage:"・診断するボタンを押してください"});
        
    }

    clickReturnToFunctionSelection = ()=>{
       this.state.callback(FunctionSelection.name);
    }

    clickDiagnose = ()=>{
        this.setState({cursorWait:true});
    	this.setState({resistDayMessage:null});
    	this.setState({resultMessage:null});
        this.setState({disabled:true});
        const image = document.getElementById("getimg");
        //Base64エンコードによるファイルサイズの増加率を33%としてファイルサイズの上限を決定する
        const fileSizeUpperLimit = 4*(1+0.33)*1024*1024;

        if(image == null){
            this.setState({resultMessage:"画像を選択してから診断するボタンを押してください。"});
            this.setState({cursorWait:false});
            return ;    
        }
        
        if(image.getAttribute("src").length >= fileSizeUpperLimit){
            
            this.setState({resultMessage:"画像ファイルが大きすぎます。4MB以下の画像を選択してください。"});
            this.setState({cursorWait:false});
            return ;  
        }
        
        const api = new IkiikiFaceDiagnoseAPI();
        api.callFaceDiagnoseAPI(image.getAttribute("src"),this.props.ID)
        .then(result => {
            //result及びresult内部のパラメータがnullまたはundefinedの場合にエラーとして処理を行う
            if(!result || !result.message || result.hasFaceDiagnosed === null || result.hasFaceDiagnosed === ""){
                throw new Error();
                }
            if(result.hasFaceDiagnosed){
                if(!result.date || result.ikiikiValue === null || result.ikiikiValue === ""){
                    throw new Error();
                }
                this.setState({resistDayMessage:`${result.date}本日のイキイキ度は${result.ikiikiValue}です。`});
                this.setState({resultMessage:`${result.message}`});
                this.setState({cursorWait:false});
                const ikiikiResult = {diagnosedDate:result.date,ikiikiValue:result.ikiikiValue};
                this.props.ikiikiResults.pop();
                this.props.ikiikiResults.unshift(ikiikiResult);
                this.state.setIkiikiResults(this.props.ikiikiResults);
                
            }else{                     
                this.setState({resultMessage:result.message});
                this.setState({cursorWait:false});
            }                    
        }).catch(err =>{
            this.setState({resultMessage:"予期しないエラーが発生しました。しばらく待ってから再度実行してください。"});
            this.setState({cursorWait:false});
        });           
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleClickImageSelect = ()=>{
        document.querySelector("input[type='file']").dispatchEvent(new MouseEvent("click",{bubbles:true}));
    }

    render(){
        if(this.state.cursorWait){
            document.body.style.cursor = "wait";
        }else{
            document.body.style.cursor = "auto";
        }
        return (
            <>
                <h1>イキイキ顔診断画面</h1>
                <div className={classes.username}><p id="ID">ID:{this.props.ID}</p></div>
                <div className={classes.return_to_function_select_area} ><button tabIndex={1} onClick={this.clickReturnToFunctionSelection} id="clickreturn">機能選択画面に戻る</button></div>
                <div className={classes.message_area}><p id="operationMsg">{this.state.operationMessage}</p></div>
                <div className={classes.display}>
                <div style={{marginTop:this.state.marginTop}} id="photo_area">{this.state.photoimage}</div>
                </div>
                <div className={classes.button_area}>
                    <form onSubmit={this.handleSubmit}>
                        <input type="file"id="filename" className={classes.hidden} accept=".png,.jpg,.jpeg" onChange={this.clickImageSelect}/>
                        <button type="submit" onClick={this.handleClickImageSelect} tabIndex={2} className={classes.imageSelect}>画像を選択</button>    
                    </form>
                        <button tabIndex={3} className={classes.diagnose_button} onClick={this.clickDiagnose} id="diagnose_button" disabled={this.state.disabled}>診断する</button>
                </div>
                <div className={classes.diagnose_result_area} id="diagnose_result_area">
                    <p id="resist_day">{this.state.resistDayMessage}</p>
                     <p id="result_msg">{this.state.resultMessage}</p>
                </div>
            </>
        );
    }
}