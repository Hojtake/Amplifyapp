import React from "react";
import {render ,unmountComponentAtNode } from "react-dom";
import { act, renderIntoDocument } from "react-dom/test-utils";
import Login from "./Login";
import TestRenderer from "react-test-renderer"
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

it("API実行後のメッセージが反映されているかのテスト",async ()=>{
    const component = TestRenderer.create(<Login/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})