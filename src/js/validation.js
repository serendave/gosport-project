const validate = (onDataValid, onDataInvalid) => {
    const submitButton = document.querySelector("#btn-submit");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const name = document.querySelector("#name");
    const surname = document.querySelector("#surname");
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

    if (name) {
        name.addEventListener("keyup", () => {
            if (name.value !== "") {
                name.classList.add("input--valid");
                name.classList.remove("input--invalid");
                valid = true;
            } else {
                name.classList.remove("input--valid");
            }
        });
    }

    if (surname) {
        surname.addEventListener("keyup", () => {
            if (surname.value !== "") {
                surname.classList.add("input--valid");
                surname.classList.remove("input--invalid");
                valid = true;
            } else {
                surname.classList.remove("input--valid");
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

        if (name) {
            if (name.value === "") {
                name.classList.add("input--invalid");
                valid = false;
            } else {
                name.classList.remove("input--invalid");
                name.classList.add("input--valid");
            }
        }

        if (surname) {
            if (surname.value === "") {
                surname.classList.add("input--invalid");
                valid = false;
            } else {
                surname.classList.remove("input--invalid");
                surname.classList.add("input--valid");
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
