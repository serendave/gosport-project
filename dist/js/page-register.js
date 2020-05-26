import validate from "./validation.js";

validate(() => {
    const authData = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        returnSecureToken: true
    }
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
                AIzaSyDKyWcIFUiX3NbLyVDtK0nd8w_frBklP30`;

    axios.post(url, authData)
        .then(response => {
            localStorage.clear();
            localStorage.setItem("tokenId", response.data.idToken);
            localStorage.setItem("userId", response.data.localId);
            console.log(response.data);

            window.location.replace('http://127.0.0.1:8080/cabinet.html');
        })
        .catch(error => {
            console.log(error);
        });
}, () => {
    console.log("Invalid data");
});
