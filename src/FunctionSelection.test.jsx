import FunctionSelection from "./FunctionSelection";
import React from "react";

import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

const VALID_ID = "testuser"
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
    )
    const table = document.querySelector("table");
    console.log(table.innerHTML);

});

// it("正常系、ログアウトボタンを押したときにログイン画面に戻るかのテスト", async () => {
//     act(() => {
//         render(<FunctionSelection ID={VALID_ID} />);
//     });

//     const logoutButton = document.querySelector("button[id='logout']");
//     const spyRender = jest.spyOn(ReactDOM, "render");
//     spyRender.mockImplementation(() => { return jest.fn() });
//     await act(async () => {
//         userEvent.click(logoutButton);
//     });

//     expect(spyRender).toHaveBeenCalled();
//     spyRender.mockRestore();

// });



// it("正常系、イキイキ顔診断ボタンを押したときにイキイキ顔診断画面に遷移するかのテスト", async () => {
//     act(() => {
//         render(<FunctionSelection ID={VALID_ID} />);
//     });
//     const spyRender = jest.spyOn(ReactDOM, "render");
//     spyRender.mockImplementation(() => { return jest.fn() });
//     const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
//     await act(async () => {
//         userEvent.click(diagnoseFaceButton);
//     });
//     expect(spyRender).toHaveBeenCalled();
//     spyRender.mockRestore();
// });

