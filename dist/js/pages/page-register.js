import validate from "./validation.js";

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

    const url = "api to backend";

    axios.post(url, registerData)
        .then(response => { 
            console.log(response);
            // localStorage.clear();
            // localStorage.setItem("token", response.data.token);

            // window.location.replace('http://127.0.0.1:8080/cabinet.html');
        })
        .catch(error => {
            console.log(error);
        });
}, () => {
    console.log("Invalid data");
});
