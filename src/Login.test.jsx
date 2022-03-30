import Login from "./Login";
import FunctionSelection from "./FunctionSelection";
import APP from "./APP";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import React from "react";
import renderer from "react-test-renderer";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";


jest.mock("./IkiikiFaceDiagnoseAPI");
const VALID_ID = "testuser";
const VALID_PASSWORD = "testpassword";

it("正常系、ID未入力で押した場合APIが実行されないことの確認", async () => {
    const dummyLoginAPI = jest.fn();
    const dummyReadResultAPI = jest.fn()
    
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return dummyLoginAPI;
            },
            readIkiikiResultAPI : () =>{
                return dummyReadResultAPI;
            }
        };
    });
    
    act(() => {
        render(<Login />);
    });
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(dummyLoginAPI).toBeCalledTimes(0);
    expect(dummyReadResultAPI).toBeCalledTimes(0);
});

it("正常系、ID,Passwordの入力に合わせてinputのonChangeメソッドが実行されているかの確認", () => {

    act(() => {
        render(<Login />);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    expect(inputID.value).toBe(VALID_ID);
    expect(inputPassWord.value).toBe(VALID_PASSWORD);
});



it("正常系、ログイン認証失敗時にメッセージが反映されているかのテスト", async () => {

    const dummyResponseJson = {
        hasLoginAuthenticated: false,
        ID: null,
        message: "IDまたはパスワードが異なります。"
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Login />);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");

    expect(errMsg.innerHTML).toBe("IDまたはパスワードが異なります。");
});

it("正常系、過去の診断結果が存在する状態でログイン認証成功時に機能選択画面に遷移するかの確認", async () => {

    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:[
            {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
            {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
            {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
        ]
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseLoginResult);
            },
            readIkiikiResultAPI: () =>{
                return Promise.resolve(dummyResponseReadIkiikiResults);
            }
        };
    });
    act(() => {
        render(<APP/>);
    });
    const tree = renderer.create(
    <FunctionSelection 
    ID={VALID_ID}
    ikiikiResults={dummyResponseReadIkiikiResults.ikiikiResults}
    hasReadIkiikiResult={dummyResponseReadIkiikiResults.hasReadIkiikiResult}/>).toJSON();
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);

    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(tree).toMatchSnapshot();
});

it("正常系、過去のデータが存在しない状態でログイン認証成功時に機能選択画面に遷移するかの確認", async () => {

    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseLoginResult);
            },
            readIkiikiResultAPI: () =>{
                return Promise.resolve(dummyResponseReadIkiikiResults);
            }
        };
    });
    act(() => {
        render(<APP/>);
    });
    const tree = renderer.create(
    <FunctionSelection 
    ID={VALID_ID}
    ikiikiResults={[]}
    hasReadIkiikiResult={dummyResponseReadIkiikiResults.hasReadIkiikiResult}/>).toJSON();
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);

    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(tree).toMatchSnapshot();
});

it("異常系、API実行時レスポンスが空で返る場合", async () => {
    const dummyResponseJson = {

    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Login />);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");

    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
})

it("異常系、API実行時レスポンスがnullで返る場合", async () => {
    const dummyResponseJson = null;
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Login />);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");

    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

it("異常系、API実行時、ログイン認証に失敗しているがメッセージが返らなかった場合", async () => {
    const dummyResponseJson = {
        hasLoginAuthenticated: false,
        ID: null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Login />);
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    const errMsg = document.querySelector("p");

    expect(errMsg.innerHTML).toBe("予期しないエラーが発生しました。しばらく待ってから再度実行してください。");
});

it("正常系、ログイン認証成功時に機能選択画面に遷移するかの確認", async () => {

    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:[
            {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
            {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
            {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
        ]
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseLoginResult);
            },
            readIkiikiResultAPI: () =>{
                return Promise.resolve(dummyResponseReadIkiikiResults);
            }
        };
    });
    act(() => {
        render(<APP/>);
    });
    const tree = renderer.create(
    <FunctionSelection 
    ID={VALID_ID}
    ikiikiResults={dummyResponseReadIkiikiResults.ikiikiResults}
    hasReadIkiikiResult={dummyResponseReadIkiikiResults.hasReadIkiikiResult}/>).toJSON();
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);

    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(tree).toMatchSnapshot();
});

it("異常系、過去のデータ参照に失敗した状態でログイン認証成功時に機能選択画面に遷移するかの確認", async () => {

    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:false,
        ikiikiResults:null
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseLoginResult);
            },
            readIkiikiResultAPI: () =>{
                return Promise.resolve(dummyResponseReadIkiikiResults);
            }
        };
    });
    act(() => {
        render(<APP/>);
    });
    const tree = renderer.create(
    <FunctionSelection 
    ID={VALID_ID}
    ikiikiResults={dummyResponseReadIkiikiResults.ikiikiResults}
    hasReadIkiikiResult={dummyResponseReadIkiikiResults.hasReadIkiikiResult}/>).toJSON();
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);

    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    expect(tree).toMatchSnapshot();
});