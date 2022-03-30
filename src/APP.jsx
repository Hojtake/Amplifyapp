import React from "react";
import Login from "./Login";
import FunctionSelection from "./FunctionSelection";
import Diagnosis from "./Diagnosis";

export default class APP extends React.Component{
    constructor(props){
        super(props);
        this.state = {renderComponent : Login.name, ID : "", ikiikiResults:[],hasReadIkiikiResult:false};
        this.selectComponent = this.selectComponent.bind(this);
        this.setID = this.setID.bind(this);
        this.setHasReadIkiikiResult = this.setHasReadIkiikiResult.bind(this);
        this.setIkiikiResults = this.setIkiikiResults.bind(this);
    }
    
    selectComponent = (ComponentName) => {

        this.setState({renderComponent : ComponentName});
    }

    setID(ID){
        this.setState({ID : ID});
    }

    setHasReadIkiikiResult(result){
        this.setState({hasReadIkiikiResult: result});
    }

    setIkiikiResults(ikiikiResults){
        this.setState({ikiikiResults:ikiikiResults})
    }

    render(){
        if(this.state.renderComponent == Login.name){
            return(
                <>   
                    <Login 
                    callback={this.selectComponent} 
                    setID={this.setID}
                    setIkiikiResults={this.setIkiikiResults}
                    setHasReadIkiikiResult={this.setHasReadIkiikiResult} />
                </>
            );
        }else if(this.state.renderComponent == FunctionSelection.name){
            return(
                <>   
                    <FunctionSelection 
                    callback={this.selectComponent} 
                    ID={this.state.ID} 
                    ikiikiResults={this.state.ikiikiResults}
                    hasReadIkiikiResult={this.state.hasReadIkiikiResult}
                    />
                </>
            );
        }else if(this.state.renderComponent == Diagnosis.name){
            return(
                <>   
                    <Diagnosis 
                    callback={this.selectComponent} 
                    ID={this.state.ID}
                    setIkiikiResults={this.setIkiikiResults}
                    ikiikiResults={this.state.ikiikiResults}/>
                </>
            );
        }else{
            return(
                <>
                エラーが発生しました再度読み込みを行ってください
                </>
            )
        }
    }
}