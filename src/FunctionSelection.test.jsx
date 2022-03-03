import FunctionSelection from "./FunctionSelection";
import React from "react";
import ReactDOM  from "react-dom";
import {render} from "@testing-library/react";
import { act } from "react-dom/test-utils";



it("機能選択画面入力時にIDが表示されているかのテスト",async ()=>{
    const TEST_ID_VAL = "testuser"

    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    expect(document.querySelector("p").innerHTML).toBe(`ID:${TEST_ID_VAL}`);
});
/*
it("ログアウトボタンを押したときにログイン画面に戻るかのテスト",() =>{

    const TEST_ID_VAL = "testuser"
    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    const spy = jest.spyOn(ReactDOM,"render")
    const logoutButton = document.querySelector("button[id='logout']");
    act(() =>{
        logoutButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    })
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
});



it("イキイキ顔診断ボタンを押したときにイキイキ顔診断画面に遷移するかのテスト",() =>{

    const TEST_ID_VAL = "testuser"
    act (() => {
        render(<FunctionSelection ID={TEST_ID_VAL}/>);
    });
    const spyRender = jest.spyOn(ReactDOM,"render"); 
    const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
    act(() =>{
        diagnoseFaceButton.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    })
    expect(spyRender).toHaveBeenCalled();
    spyRender.mockRestore();
});
*/
