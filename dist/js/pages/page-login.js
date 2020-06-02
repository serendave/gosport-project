import validate from "../utils/validation.js";
import createPopup from "../utils/popup.js"

validate(() => {
    const loginData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    };

    const url = "http://localhost:3000/api/login";

    axios.post(url, loginData)
        .then(response => {
            console.log(response);
            localStorage.clear();
            localStorage.setItem("token", response.data.token);

            window.location.replace('http://127.0.0.1:8080/cabinet.html');
        })
        .catch(error => {
            const content = document.querySelector("body");
            createPopup(error, content);
            console.log(error);
        })
}, () => {
    createPopup("Invalid data. Please, fill in all the necessary fields");
});