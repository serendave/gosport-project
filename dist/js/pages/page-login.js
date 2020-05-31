import validate from "./validation.js";

validate(() => {
    const loginData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    };

    const url = "api to backend";

    axios.post(url, loginData)
        .then(response => {
            console.log(response.data);
            // localStorage.clear();
            // localStorage.setItem("token", response.data.token);

            window.location.replace('http://127.0.0.1:8080/cabinet.html');
        })
        .catch(error => {
            console.log(error);
        })
}, () => {
    console.log("Invalid data");
});