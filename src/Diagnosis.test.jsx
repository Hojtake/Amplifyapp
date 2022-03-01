import Diagnosis from "./Diagnosis";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {shallow} from "enzyme";

jest.mock("./IkiikiFaceDiagnoseAPI");
it("イキイキ顔診断が失敗した場合にメッセージが正しく表示されていることの確認",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "画像ファイルが大きすぎます。5MB以下の画像を選択してください。"
    const fakeResult = {
        hasFaceDiagnosed:false,
        ikiikiValue:0,
        date:null,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(RESULT_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("イキイキ顔診断が成功した場合にメッセージが正しく表示されていることの確認",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！"
    const IKIIKI_VAL = 70;
    const DATE_VAL = "2022/03/01"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });
    expect(document.querySelector("p[id='ID']").innerHTML).toBe(`ID:${TEST_ID_VAL}`)
    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(RESULT_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe(`${DATE_VAL}本日のイキイキ度は${IKIIKI_VAL}です。`);
})

it("レスポンスが正常に返らなかった場合のテスト（レスポンスの中身が空）",async ()=>{
    const TEST_ID_VAL = "testuser";
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {

    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("レスポンスが正常に返らなかった場合のテスト（レスポンスの中身がnull）",async ()=>{
    const TEST_ID_VAL = "testuser";
    const fakeResult = null;
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("診断は成功しているがイキイキ度がnullの場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！"
    const IKIIKI_VAL =null;
    const DATE_VAL = "2022/03/01"
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("診断は成功しているがdateがnullの場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！"
    const IKIIKI_VAL = 70;
    const DATE_VAL = null
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("診断は成功しているがmessageがnullの場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = null;
    const IKIIKI_VAL = 70;
    const DATE_VAL = "2022/03/01"
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("診断は成功しているがmessageが空白の場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "";
    const IKIIKI_VAL = 70;
    const DATE_VAL = "2022/03/01"
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("診断は成功しているがdateが空白の場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！";
    const IKIIKI_VAL = 70;
    const DATE_VAL = "";
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("診断は成功しているがikiikiValueが空白の場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！";
    const IKIIKI_VAL = "";
    const DATE_VAL = "2022/03/01"
    const ERR_MSG_VAL = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const dammyData = document.createElement("img");
    dammyData.src = "dammy";
    dammyData.id = "getimg";
    document.getElementById("photo_area").appendChild(dammyData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("画像を選択する前に診断を実行したの場合のテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const RESULT_MSG_VAL = "本日も元気に働きましょう！";
    const IKIIKI_VAL = "";
    const DATE_VAL = "2022/03/01"
    const ERR_MSG_VAL = "画像を選択してから診断するボタンを押してください。"
    const fakeResult = {
        hasFaceDiagnosed:true,
        ikiikiValue:IKIIKI_VAL,
        date:DATE_VAL,
        message:RESULT_MSG_VAL
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Diagnosis ID={TEST_ID_VAL}/>);
    });
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async() =>{
        diagnoseButton.dispatchEvent(new MouseEvent("click",{bubbles:true}))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(ERR_MSG_VAL);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

