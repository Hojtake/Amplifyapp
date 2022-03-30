import Diagnosis from "./Diagnosis";
import IkiikiFaceDiagnoseAPI from "./IkiikiFaceDiagnoseAPI";
import renderer from "react-test-renderer";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import fs from "fs";
import APP from "./APP";
import userEvent from "@testing-library/user-event";
import FunctionSelection from "./FunctionSelection";

jest.mock("./IkiikiFaceDiagnoseAPI");
const VALID_ID = "testuser";
const VALID_PASSWORD = "testpassword";
const dummyImageData = document.createElement("img");
dummyImageData.src = "dummy";
dummyImageData.id = "getimg";
//診断成功時の結果
const SUCCESS_RESULT_MSG = "本日も元気に働きましょう！";
const IKIIKI_VAL = 70;
const DATE = "2022/03/01";
const ikiikiResults =[        
    {"diagnoseDate":"2022/01/01","ikiikiValue":70 },
    {"diagnoseDate":"2022/01/02","ikiikiValue":50 },
    {"diagnoseDate":"2022/01/03","ikiikiValue":60 }];
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

//想定しないエラーが発生したときのメッセージ
const UNEXPECTED_ERR_MSG = "予期しないエラーが発生しました。しばらく待ってから再度実行してください。";
//

it("正常系、イキイキ顔診断が成功した場合にメッセージが正しく表示されていることの確認", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: IKIIKI_VAL,
        date: DATE,
        message: SUCCESS_RESULT_MSG
    }
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Diagnosis
            ID={VALID_ID}
            setIkiikiResults = {jest.fn()}
            ikiikiResults={ikiikiResults}
        />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        userEvent.click(diagnoseButton);
    });
    
    expect(document.querySelector("p[id='ID']").innerHTML).toBe(`ID:${VALID_ID}`);
    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(SUCCESS_RESULT_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe(`${DATE}本日のイキイキ度は${IKIIKI_VAL}です。`);
})

it("正常系、画像を選択したときにテスト操作ガイドのメッセージが更新されること", async () => {
    const imageFile = fs.readFileSync("./testImage/sample1.jpeg");

    const inputImage = new File([imageFile], "sample1.jpeg", { type: "image/jpeg", });
    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    const operationMsg = document.getElementById("operationMsg");
    expect(operationMsg.innerHTML).toBe("・画像選択ボタンを押してください");
    const inputFile = document.querySelector("input[type='file']");
    userEvent.upload(inputFile,inputImage);
    expect(inputFile.files[0]).toStrictEqual(inputImage);
    expect(inputFile.files).toHaveLength(1);
    expect(operationMsg.innerHTML).toBe("・診断するボタンを押してください");
});

it("正常系、機能選択画面に戻るボタンを押したときにFunctionSelectionがrenderされることの確認", async () => {
    act(() => {
        render(<APP/>);
    });

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callLoginAPI: () => {
                return Promise.resolve(dummyResponseLoginResult);
            },
            readIkiikiResultAPI: () => {
                return Promise.resolve(dummyResponseReadIkiikiResults);
            }
        };
    });
    const inputID = document.getElementById("ID");
    const inputPassWord = document.getElementById("password");
    userEvent.type(inputID, VALID_ID);
    userEvent.type(inputPassWord, VALID_PASSWORD);
    const loginButton = document.querySelector("button[type='submit']");
    await act(async () => {
        userEvent.click(loginButton);
    });
    const diagnoseFaceButton = document.querySelector("button[id='diagnoseFace']");
    await act(async () => {
        userEvent.click(diagnoseFaceButton);
    });
    const clickReturnToFunctionSelection = document.getElementById("clickreturn");
    await act(async () => {
        userEvent.click(clickReturnToFunctionSelection);
    });
    const tree = renderer.create(
        <FunctionSelection
        ID={VALID_ID}
        ikiikiResults={ikiikiResults}
        hasReadIkiikiResult={true}/>
    )
});

it("異常系、イキイキ顔診断が失敗した場合にメッセージが正しく表示されていることの確認", async () => {
    const FAILED_RESULT_MSG = "画像ファイルが大きすぎます。4MB以下の画像を選択してください。"
    const dummyResponseJson
        = {
        hasFaceDiagnosed: false,
        ikiikiValue: 0,
        date: null,
        message: FAILED_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        userEvent.click(diagnoseButton);
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(FAILED_RESULT_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、レスポンスが正常に返らなかった場合のテスト（レスポンスの中身が空）", async () => {

    const dummyResponseJson
        = {

    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、レスポンスが正常に返らなかった場合のテスト（レスポンスの中身がnull）", async () => {
    const dummyResponseJson
        = null;
    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
})

it("異常系、診断は成功しているがイキイキ度がnullの場合のテスト", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: null,
        date: DATE,
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがイキイキ度が空白の場合のテスト", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: "",
        date: DATE,
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがdateがnullの場合のテスト", async () => {

    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: IKIIKI_VAL,
        date: null,
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがdateが空白の場合のテスト", async () => {

    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: IKIIKI_VAL,
        date: "",
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson);
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがmessageがnullの場合のテスト", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: IKIIKI_VAL,
        date: DATE,
        message: null
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });

    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    
    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがmessageが空白の場合のテスト", async () => {

    const dummyResponseJson
        = {
        hasFaceDiagnosed: true,
        ikiikiValue: IKIIKI_VAL,
        date: DATE,
        message: ""
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがhasFaceDiagnosedがnullの場合のテスト", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: null,
        ikiikiValue: IKIIKI_VAL,
        date: DATE,
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、診断は成功しているがhasFaceDiagnosedが空白の場合のテスト", async () => {
    const dummyResponseJson
        = {
        hasFaceDiagnosed: "",
        ikiikiValue: IKIIKI_VAL,
        date: DATE,
        message: SUCCESS_RESULT_MSG
    }

    IkiikiFaceDiagnoseAPI.mockImplementation(() => {
        return {
            callFaceDiagnoseAPI: () => {
                return Promise.resolve(dummyResponseJson
                );
            }
        };
    });

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    document.getElementById("photo_area").appendChild(dummyImageData);
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(UNEXPECTED_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");
});

it("異常系、画像を選択する前に診断を実行したの場合のテスト", async () => {
    const EMPTY_IMAGE_ERR_MSG = "画像を選択してから診断するボタンを押してください。"

    act(() => {
        render(<Diagnosis ID={VALID_ID} />);
    });
    const diagnoseButton = document.querySelector("button[id='diagnose_button']")
    await act(async () => {
        diagnoseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    });

    expect(document.querySelector("p[id='result_msg']").innerHTML).toBe(EMPTY_IMAGE_ERR_MSG);
    expect(document.querySelector("p[id='resist_day']").innerHTML).toBe("");

});

