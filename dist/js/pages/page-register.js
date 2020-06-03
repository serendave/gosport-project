import validate from "../utils/validation.js";
import createPopup from "../utils/popup.js";

validate(() => {

    // Data for registration
    const registerData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        dateOfBirthday: document.querySelector("#birthday").value,
        userName: document.querySelector("#username").value,
        realName: document.querySelector("#realname").value,
        country: document.querySelector("#country").value,
        city: document.querySelector("#city").value,
        phoneNumber: document.querySelector("#phone").value
    };

    console.log(document.querySelector("#email").value);
    console.log(document.querySelector("#password").value);

    const url = "http://localhost:3000/api/register";

    axios.post(url, registerData)
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
        });
}, () => {
    createPopup("Invalid data. Please, fill in all the necessary fields");
});
