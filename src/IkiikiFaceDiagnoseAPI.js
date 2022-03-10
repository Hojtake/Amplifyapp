export default class IkiikiFaceDiagnoseAPI {
    async callLoginAPI (ID, password) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
       
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ "ID": ID, "password": password }),
            redirect: 'follow'
        };
        const response = await fetch("https://nczxmo91g3.execute-api.ap-northeast-1.amazonaws.com/login", requestOptions);
        return response.json();
    }

    async callFaceDiagnoseAPI (Image, ID) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ "Image": Image, "ID": ID }),
            redirect: 'follow'
        };
        const response = await fetch("https://sdnl1xmao1.execute-api.ap-northeast-1.amazonaws.com/ikiiki-value", requestOptions);
        return response.json();
    }
}