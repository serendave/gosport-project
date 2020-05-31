const validate = (onDataValid, onDataInvalid) => {
    const submitButton = document.querySelector("#btn-submit");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const username = document.querySelector("#username");
    const realname = document.querySelector("#realname");
    const country = document.querySelector("#country");

    const emailPattern = /[\w\d-_]+@\w+.(com|net|ua)/;
    const passwordPattern = /([\w+\d+]){8,}/;

    let valid = true;

    if (email) {
        email.addEventListener("keyup", () => {
            if (emailPattern.test(email.value)) {
                email.classList.add("input--valid");
                email.classList.remove("input--invalid");
                valid = true;
            } else {
                email.classList.remove("input--valid");
            }
        });
    }

    if (password) {
        password.addEventListener("keyup", () => {
            if (passwordPattern.test(password.value)) {
                password.classList.add("input--valid");
                password.classList.remove("input--invalid");
                valid = true;
            } else {
                password.classList.remove("input--valid");
            }
        });
    }

    if (username) {
        username.addEventListener("keyup", () => {
            if (username.value !== "") {
                username.classList.add("input--valid");
                username.classList.remove("input--invalid");
                valid = true;
            } else {
                username.classList.remove("input--valid");
            }
        });
    }

    if (realname) {
        realname.addEventListener("keyup", () => {
            if (realname.value !== "") {
                realname.classList.add("input--valid");
                realname.classList.remove("input--invalid");
                valid = true;
            } else {
                realname.classList.remove("input--valid");
            }
        });
    }

    if (country) {
        country.addEventListener("keyup", () => {
            if (country.value !== "") {
                country.classList.add("input--valid");
                country.classList.remove("input--invalid");
                valid = true;
            } else {
                country.classList.remove("input--valid");
            }
        });
    }

    submitButton.addEventListener("click", e => {
        e.preventDefault();

        if (email) {
            if (!emailPattern.test(email.value)) {
                email.classList.add("input--invalid");
                valid = false;
            } else {
                email.classList.remove("input--invalid");
                email.classList.add("input--valid");
            }
        }

        if (password) {
            if (!passwordPattern.test(password.value)) {
                password.classList.add("input--invalid");
                valid = false;
            } else {
                password.classList.remove("input--invalid");
                password.classList.add("input--valid");
            }
        }

        if (username) {
            if (username.value === "") {
                username.classList.add("input--invalid");
                valid = false;
            } else {
                username.classList.remove("input--invalid");
                username.classList.add("input--valid");
            }
        }

        if (realname) {
            if (realname.value === "") {
                realname.classList.add("input--invalid");
                valid = false;
            } else {
                realname.classList.remove("input--invalid");
                realname.classList.add("input--valid");
            }
        }

        if (country) {
            if (country.value === "") {
                country.classList.add("input--invalid");
                valid = false;
            } else {
                country.classList.remove("input--invalid");
                country.classList.add("input--valid");
            }
        }

        if (valid) {
            onDataValid();
        } else {
            onDataInvalid();
        }
    });
};

export default validate;