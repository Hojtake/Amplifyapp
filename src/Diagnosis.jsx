
import React from "react";
import ReactDOM from "react-dom";
import FunctionSelection  from "./FunctionSelection.jsx";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import classes from "./Diagnosis.module.css";
export default class Diagnosis extends React.Component {
    constructor(props){
        super(props);
        this.clickReturnToFunctionSelection = this.clickReturnToFunctionSelection.bind(this);
        this.clickDiagnose = this.clickDiagnose.bind(this);
        this.clickImageSelect = this.clickImageSelect.bind(this);
        this.state={resistDayMessage:null,resultMessage:null,operationMessage:"・画像選択ボタンを押してください",photoimage:""};
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
                this.setState({photoimage:imgdata})
            }.bind(this)
            faceImage.src= e.target.result;
        }.bind(this)
        reader.readAsDataURL(file);
        this.setState({operationMessage:"・診断するボタンを押してください"});
    }

    clickReturnToFunctionSelection = ()=>{
        ReactDOM.render(<FunctionSelection ID={this.props.ID}/>,document.getElementById("root"));
    }

    clickDiagnose = ()=>{
    	this.setState({resistDayMessage:null});
    	this.setState({resultMessage:null});
        const image = document.getElementById("getimg");
        if(image == null){
            this.setState({resultMessage:"画像を選択してから診断するボタンを押してください。"});
            return ;    
        }
        
        const api = new IkiikiFaceDiagnoseAPI();
        api.callFaceDiagnoseAPI(image.getAttribute("src"),this.props.ID)
        .then(result =>{
            //result及びresult内部のパラメータがnullまたはundifinedの場合にエラーとして処理を行う
            if(!result || !result.message){
                throw new Error();
                }
            if(result.hasFaceDiagnosed){
                if(!result.date || result.ikiikiValue === null || result.ikiikiValue === ""){
                    throw new Error();
                }
                this.setState({resistDayMessage:`${result.date}本日のイキイキ度は${result.ikiikiValue}です。`});
                this.setState({resultMessage:`${result.message}`});
            }else{                     
                this.setState({resultMessage:result.message});
            }                    
        }).catch(()=>{
            this.setState({resultMessage:"予期しないエラーが発生しました。しばらく待ってから再度実行してください。"});
        });           
    }

    render(){        
        return (
            <>
                <h1>イキイキ顔診断画面</h1>
                <div className={classes.username}><p id="ID">ID:{this.props.ID}</p></div>
                <div className={classes.return_to_function_select_area} ><button onClick={this.clickReturnToFunctionSelection} id="clickreturn">機能選択画面に戻る</button></div>
                <div className={classes.message_area}><p id="operationMsg">{this.state.operationMessage}</p></div>
                <div className={classes.photo_area} id="photo_area">{this.state.photoimage}</div>
                <div className={classes.button_area}>
                    <label htmlFor="filename" className={classes.label}>画像を選択<input type="file" id="filename" accept=".png,.jpg,.jpeg" onChange={this.clickImageSelect}/></label>    
                    <button className={classes.diagnose_button} onClick={this.clickDiagnose} id="diagnose_button">診断する</button>
                </div>
                <div className={classes.diagnose_result_area} id="dianose_result_area">
                    <p id="resist_day">{this.state.resistDayMessage}</p>
                     <p id="result_msg">{this.state.resultMessage}</p>
                </div>
            </>
        );
    }
}