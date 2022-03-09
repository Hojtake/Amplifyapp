import Login from "./Login";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import ReactDOM  from "react-dom";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import UserEvent from "@testing-library/user-event"
import userEvent from "@testing-library/user-event";

const VALID_ID = "testuser";
const VALID_PASSWORD = "testpassword";
jest.mock("./IkiikiFaceDiagnoseAPI");
it("正常系、ID未入力で押した場合APIが実行されないことの確認",async() =>{
    const dummyResponseJson = {
        hasLoginAuthenticated:true,
        ID:VALID_ID,
        message:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const loginButton = document.querySelector("button[type='submit']"); 
    const spyRender = jest.spyOn(ReactDOM,"render");
    spyRender.mockImplementation(()=>{return jest.fn()})
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(spyRender).toBeCalledTimes(0);
    spyRender.mockRestore();
});

it("正常系、ID,Passwordの入力に合わせてinputのonChangeメソッドが実行されているかの確認",() =>{

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);
    expect(inputID.value).toBe(VALID_ID);
    expect(inputPassWord.value).toBe(VALID_PASSWORD);
});



it("正常系、ログイン認証失敗時にメッセージが反映されているかのテスト",async ()=>{

    const dummyResponseJson = {
        hasLoginAuthenticated:false,
        ID:null,
        message:"IDまたはパスワードが異なります。"
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("IDまたはパスワードが異なります。");
});

it("正常系、ログイン認証成功時にReactDomが実行されるかの確認",async ()=>{

    const dummyResponseJson = {
        hasLoginAuthenticated:true,
        ID:VALID_ID,
        message:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });
    act (() => {
        render(<Login/>);
    });
    
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);

    const spyRender = jest.spyOn(ReactDOM,"render");
    spyRender.mockImplementation(()=>{return jest.fn()});

    const loginButton = document.querySelector("button[type='submit']");
    await act(async() =>{
        UserEvent.click(loginButton);
    })
    expect(spyRender).toBeCalled();
    spyRender.mockRestore();
});

it("異常系、API実行時レスポンスが空で返る場合",async ()=>{
    const dummyResponseJson = {

    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("異常系、API実行時レスポンスがnullで返る場合",async ()=>{
    const dummyResponseJson = null;
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

it("異常系、API実行時、ログイン認証に失敗しているがメッセージが返らなかった場合",async ()=>{
    const dummyResponseJson = {
        hasLoginAuthenticated:false,
        ID:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, VALID_ID);
    UserEvent.type(inputPassWord,VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

