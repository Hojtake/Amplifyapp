import FunctionSelection from "./FunctionSelection";
import React from "react";
import ReactDOM  from "react-dom";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";


it("正常系、機能選択画面入力時にIDが表示されているかのテスト",async ()=>{
    const TEST_ID_VAL = "testuser"

    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    expect(document.querySelector("p").innerHTML).toBe(`ID:${TEST_ID_VAL}`);
});

it("正常系、ログアウトボタンを押したときにログイン画面に戻るかのテスト",async() =>{
    const TEST_ID_VAL = "testuser"
    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    
    const logoutButton = document.querySelector("button[id='logout']");
    const spyRender = jest.spyOn(ReactDOM,"render");
    spyRender.mockImplementation(()=>{return jest.fn()});
    await act (async ()=> {
        userEvent.click(logoutButton);
    });

    expect(spyRender).toHaveBeenCalled();
    spyRender.mockRestore();
    
});



it("正常系、イキイキ顔診断ボタンを押したときにイキイキ顔診断画面に遷移するかのテスト",async() =>{

    const TEST_ID_VAL = "testuser"
    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    const spyRender = jest.spyOn(ReactDOM,"render");
    spyRender.mockImplementation(()=>{return jest.fn()});
    const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
    await act(async() =>{
        userEvent.click(diagnoseFaceButton);
    });
    expect(spyRender).toHaveBeenCalled();
    spyRender.mockRestore();
});

