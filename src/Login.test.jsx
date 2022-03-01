import Login from "./Login";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {shallow} from "enzyme";


jest.mock("./IkiikiFaceDiagnoseAPI");

it("ログイン認証失敗時にメッセージが反映されているかのテスト",async ()=>{
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
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        loginButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("IDまたはパスワードが異なります。");
})

it("API実行時、レスポンスが正常に返されなかった場合に表示されるメッセージのテスト（レスポンスが空の場合）",async ()=>{
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
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        loginButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("API実行時、レスポンスが正常に返されなかった場合に表示されるメッセージのテスト（ログイン認証に失敗しているがメッセージが返らなかった場合）",async ()=>{
    const fakeResult = {
        hasLoginAuthenticated:false
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
        loginButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("API実行時、レスポンスが正常に返されなかった場合に表示されるメッセージのテスト（レスポンスが空の場合）",async ()=>{
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
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        loginButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("API実行時、レスポンスが正常に返されなかった場合に表示されるメッセージのテスト（レスポンスがnullの場合）",async ()=>{
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
    const loginButton = document.querySelector("button[type='submit']"); 
    await act(async () => {
        loginButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    });
    const errMsg = document.querySelector("p");
    
    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})
it("ID,Passwordの入力に合わせてstateが更新されるかの確認",() =>{
    const TEST_ID_VAL = "testuser";
    const TEST_PASSWORD_VAL = "testpassword";
    const mockLogin = shallow(<Login/>);
    expect(mockLogin.state().ID).toBe("");
    expect(mockLogin.state().password).toBe("");
    mockLogin.find("input[id='ID']").simulate("change",{target:{value:TEST_ID_VAL}});
    mockLogin.find("input[id='password']").simulate("change",{target:{value:TEST_PASSWORD_VAL}});
    
    expect(mockLogin.state().ID).toBe(TEST_ID_VAL);
    expect(mockLogin.state().password).toBe(TEST_PASSWORD_VAL);
});

