import React from "react";
import {render ,unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import renderer from "reat"

import Login from "./Login";

let container = null;

beforeEach(() =>{
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

jest.mock("fetch");
it("API実行後のメッセージが反映されているかのテスト",async ()=>{
    const fakeResult = {
        hasLoginAuthenticated:false,
        ID:null,
        message:"ID、またはパスワードが異なります。"
    };    
    fetch.mockRestore


    act(() => {
        render(<Login/>,container);
    });

    const button = document.querySelector("button[type='submit']");
    
    await act(async () => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const msg = document.querySelector("p");
    expect(msg.innerText).toBe("ID、またはパスワードが異なります。");
    
    global.fetch.mockRestore();

});