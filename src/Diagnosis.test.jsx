import Diagnosis from "./Diagnosis";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, waitFor, screen} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import fs from "fs";
import userEvent from "@testing-library/user-event";



const VALID_ID = "testuser";
const dummyImageData = document.createElement("img");
dummyImageData.src = "dummy";
dummyImageData.id = "getimg";
//診断成功時の結果
const RESULT_MSG = "本日も元気に働きましょう！"
const IKIIKI_VAL = 70;
const DATE = "2022/03/01";
const ERR_MSG = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"

jest.mock("./IkiikiFaceDiagnoseAPI");
it("正常系、イキイキ顔診断が失敗した場合にメッセージが正しく表示されていることの確認",async ()=>{
    const dummyResponseJson
 = {
        hasFaceDiagnosed:false,
        ikiikiValue:0,
        date:null,
        message: "画像ファイルが大きすぎます。5MB以下の画像を選択してください。"
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        userEvent.click(diagnoseButton);
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(RESULT_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("正常系、イキイキ顔診断が成功した場合にメッセージが正しく表示されていることの確認",async ()=>{

    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE,
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        userEvent.click(diagnoseButton);
    });
    expect(document.querySelector("p[id='ID']").innerHTML).toBe(`ID:${VALID_ID}`)
    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(RESULT_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe(`${DATE}本日のイキイキ度は${IKIIKI_VAL}です。`);
})

it("正常系、画像を選択したときにテスト操作ガイドのメッセージが更新されること",async() =>{
    const imagefile=fs.readFileSync("./testImage/sample1.jpeg");
    
    const inputImage = new File([imagefile],"sample1.jpeg",{type:"image/jpeg",});
    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    const operationMsg = document.getElementById("operationMsg");
    expect(operationMsg.innerHTML).toBe("・画像選択ボタンを押してください");
    const inputFile = screen.getByLabelText("画像を選択");
    
    userEvent.upload(inputFile,inputImage);
    expect(inputFile.files[0]).toStrictEqual(inputImage);
    expect(inputFile.files).toHaveLength(1);
    expect(operationMsg.innerHTML).toBe("・診断するボタンを押してください");
});

it("正常系、機能選択画面に戻るボタンを押したときに関数が実行されることの確認",async()=>{
    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    const spyRender = jest.spyOn(ReactDOM,"render");
    spyRender.mockImplementation(()=>{return jest.fn()});
    const clickReturnToFunctionSelection = document.getElementById("clickreturn");

    await act(async() =>{
        userEvent.click(clickReturnToFunctionSelection);
    });
    
    expect(spyRender).toBeCalled();
    spyRender.mockRestore();
});

it("異常系、レスポンスが正常に返らなかった場合のテスト（レスポンスの中身が空）",async ()=>{

    const dummyResponseJson
 = {

    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、レスポンスが正常に返らなかった場合のテスト（レスポンスの中身がnull）",async ()=>{
    const dummyResponseJson
 = null;
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがイキイキ度がnullの場合のテスト",async ()=>{
    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:null,
        date:DATE,
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがdateがnullの場合のテスト",async ()=>{

    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:null,
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがmessageがnullの場合のテスト",async ()=>{
    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE,
        message:null
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがmessageが空白の場合のテスト",async ()=>{

    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE,
        message:""
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがdateが空白の場合のテスト",async ()=>{

    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:"",
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがikiikiValueが空白の場合のテスト",async ()=>{
    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:"",
        date:DATE,
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、画像を選択する前に診断を実行したの場合のテスト",async ()=>{
    const ERR_MSG = "画像を選択してから診断するボタンを押してください。"
    const dummyResponseJson
 = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE,
        message:RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={VALID_ID}/>);
    });
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");

});

