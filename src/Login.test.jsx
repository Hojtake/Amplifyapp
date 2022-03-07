import Login from "./Login";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import ReactDOM  from "react-dom";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import UserEvent from "@testing-library/user-event"
import userEvent from "@testing-library/user-event";


jest.mock("./IkiikiFaceDiagnoseAPI");
it("正常系、ID未入力で押した場合APIが実行されないことの確認",async() =>{
    const TEST_ID_VAL = "testuser";
    const fakeResult = {
        hasLoginAuthenticated:true,
        ID:TEST_ID_VAL,
        message:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });

});

it("正常系、ID,Passwordの入力に合わせてinputのonCahgeメソッドが実行されているかの確認",() =>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);
    expect(inputID.value).toBe(TEST_ID_VAL);
    expect(inputPassWord.value).toBe(TEST_PASSWORD_VAL);
});



it("正常系、ログイン認証失敗時にメッセージが反映されているかのテスト",async ()=>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";

    const fakeResult = {
        hasLoginAuthenticated:false,
        ID:null,
        message:"IDまたはパスワードが異なります。"
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("IDまたはパスワードが異なります。");
});

it("正常系、ログイン認証成功時にReactDomが実行されるかの確認",async ()=>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    const fakeResult = {
        hasLoginAuthenticated:true,
        ID:TEST_ID_VAL,
        message:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });
    act (() => {
        render(<Login/>);
    });
    
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);

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
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    const fakeResult = {

    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("異常系、API実行時レスポンスがnullで返る場合",async ()=>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    const fakeResult = null;
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

it("異常系、API実行時、ログイン認証に失敗しているがメッセージが返らなかった場合",async ()=>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    const fakeResult = {
        hasLoginAuthenticated:false,
        ID:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() =>{
        return{
            callLoginAPI: () => {
                return Promise.resolve(fakeResult);
            }
        };
    });

    act (() => {
        render(<Login/>);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    UserEvent.type(inputID, TEST_ID_VAL);
    UserEvent.type(inputPassWord,TEST_PASSWORD_VAL);
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

