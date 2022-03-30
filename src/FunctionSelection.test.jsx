import FunctionSelection from "./FunctionSelection";
import React from "react";
import APP from "./APP";
import renderer from "react-test-renderer";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import Diagnosis from "./Diagnosis";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import Login from "./Login";

jest.mock("./IkiikiFaceDiagnoseAPI");
const VALID_ID = "testuser";
const VALID_PASSWORD = "testpassword";
it("正常系、過去の診断結果が存在する場合テーブルが作成されていることの確認", async () => {
    const dummyIkiikiResults=[
        {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
        {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
        {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
    ]
    render(
        <FunctionSelection
        ID={VALID_ID}
        ikiikiResults={dummyIkiikiResults}
        hasReadIkiikiResult={true}
        />
    );
    const table = document.querySelector("table");
    expect(table.rows.length).toBe(4);

});

it("正常系、過去の診断結果が存在しない場合、メッセージが表示されることの確認", async () => {

    const dummyIkiikiResults=[];

    render(<FunctionSelection 
        ID={VALID_ID}
        ikiikiResults={dummyIkiikiResults}
        hasReadIkiikiResult={true}
        />
    );
    const message = document.getElementById("nodata_message");
    
    expect(message.innerHTML).toBe("まだイキイキ度が登録されていません。");

});


it("正常系、イキイキ顔診断ボタンを押したときにイキイキ顔診断画面に遷移するかのテスト", async () => {
    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const ikiikiResults=[
        {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
        {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
        {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
    ]
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:ikiikiResults
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
    render(<APP/>);
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });

    const tree = renderer.create(
    <Diagnosis 
    ID={VALID_ID}
    ikiikiResults={ikiikiResults}
    />);
    const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
    await act(async () => {
        userEvent.click(diagnoseFaceButton);
    });
    expect(tree).toMatchSnapshot();
});

it("正常系、イキイキ顔診断ボタンを押したときにイキイキ顔診断画面に遷移するかのテスト", async () => {
    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const ikiikiResults=[
        {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
        {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
        {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
    ]
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:ikiikiResults
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
    render(<APP/>);
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });

    const tree = renderer.create(
    <Diagnosis 
    ID={VALID_ID}
    ikiikiResults={ikiikiResults}
    />);
    const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
    await act(async () => {
        userEvent.click(diagnoseFaceButton);
    });
    expect(tree).toMatchSnapshot();
});

it("正常系、ログアウトボタンを押したときにログイン画面に遷移するかのテスト", async () => {
    const dummyResponseLoginResult = {
        hasLoginAuthenticated: true,
        ID: VALID_ID,
        message: null
    }
    const ikiikiResults=[
        {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
        {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
        {"diagnoseDate":"2022/01/03","ikiikiValue":60 }
    ]
    const dummyResponseReadIkiikiResults = {
        hasReadIkiikiResult:true,
        ikiikiResults:ikiikiResults
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
    render(<APP/>);
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");

    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });

    const tree = renderer.create(
    <Login
    />);
    const diagnoseFaceButton = document.querySelector("button[id='logout']");
    await act(async () => { 
        userEvent.click(diagnoseFaceButton);
    });
    expect(tree).toMatchSnapshot();
});