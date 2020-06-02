import createPopup from "../utils/popup.js";

window.onload = () => {
    const token = localStorage.getItem("token");

    console.log(token);

    if (token !== undefined && token !== null && token !== "") {

        const url = "http://localhost:3000/api/user-info";

        axios.get(url, { params: { token } })
            .then(response => {
                console.log(response);

                const userInfo = response.data.user;

                // DISPLAYING INFO
                document.querySelector("#account-id").textContent = userInfo._id ?? "Not specified";
                document.querySelector("#username").textContent = userInfo.userName ?? "Not specified";
                document.querySelector("#title-user").textContent = userInfo.userName ?? "Not specified";
                document.querySelector("#realname").textContent = userInfo.realName ?? "Not specified";
                document.querySelector("#email").textContent = userInfo.email ?? "Not specified";

                document.querySelector("#birthday-date").textContent =
                    userInfo.dateOfBirthday === "" || userInfo.dateOfBirthday === null ?
                        "Not specified" : userInfo.dateOfBirthday.split("-").reverse().join(".");

                document.querySelector("#phone-number").textContent =
                    userInfo.phoneNumber === "" || userInfo.phoneNumber === null ?
                        "Not specified" : userInfo.phoneNumber;

                document.querySelector("#country").textContent =
                    userInfo.country === "" || userInfo.country === null ?
                        "Not specified" : userInfo.country;

                document.querySelector("#city").textContent =
                    userInfo.city === "" || userInfo.city === null ?
                        "Not specified" : userInfo.city;

                document.querySelector("#registration-date").textContent =
                    userInfo.dateOfRegistration.split("T")[0].split("-").reverse().join(".");


                if (userInfo.isPremium) {
                    document.querySelector("#title-premium")
                        .classList.add("page-cabinet__premium-title--active");
                    document.querySelector("#title-premium")
                        .classList.remove("page-cabinet__premium-title--disabled");
                } else {
                    document.querySelector("#title-premium")
                        .classList.remove("page-cabinet__premium-title--active");
                    document.querySelector("#title-premium")
                        .classList.add("page-cabinet__premium-title--disabled");
                }
                document.querySelector("#balance").textContent = userInfo.balance ?? 320;

                // DISPLAYING BETS
                document.querySelector("#bets-done").textContent = userInfo.bets.length;

                const betsContainer = document.querySelector(".page-cabinet__bets-history");
                userInfo.bets.forEach(bet => {
                    const betInfo = `
                        <div class="page-cabinet__bet animate__animated animate__zoomIn animate__faster">
                            <div class="page-cabinet__bet-info page-cabinet__bet-info--name">
                                ${bet.team1} — ${bet.team2} 
                            </div>
                            <div class="page-cabinet__bet-info page-cabinet__bet-info--coefficient">
                                ${bet.coefficient} (${parseFloat(bet.coefficientValue).toFixed(2)})
                            </div>
                            <div class="page-cabinet__bet-info page-cabinet__bet-info--bet">
                                <span>${bet.amount}</span>
                                <span>UAH</span>
                            </div>
                            <div class="page-cabinet__bet-info page-cabinet__bet-info--date">
                                <span>Date: </span>
                                <span>${bet.time.split("T")[0].split("-").reverse().join(".")}</span>
                            </div>
                        </div>
                    `;

                    betsContainer.insertAdjacentHTML("beforeend", betInfo);
                });
            })
            .catch(error => {
                console.log(error);
            })

        document.querySelector("#btn-logout").addEventListener("click", e => {
            localStorage.clear();
            window.location.replace('http://127.0.0.1:8080/login.html');
        });

        const editUrl = "http://localhost:3000/api/update-user";

        document.querySelector("#btn-upgrade").addEventListener("click", e => {
            axios.post(editUrl, { token, isPremium: true })
                .then(response => {
                    if (response.status === 200) {
                        location.reload();   
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        });

        document.querySelector("#btn-edit").addEventListener("click", e => {
            if (document.querySelector(".page-register__form-data")) {
                document.querySelector(".page-cabinet__form").innerHTML = "";
            } else {
                document.querySelector(".page-cabinet__form").innerHTML = `
                    <div class="page-register__form-data">
                        <div class="page-register__row">
                            <div class="page-register__item">
                                <div>
                                    <label for="name">Username:</label>
                                    <span>*</span>
                                </div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    class="page-register__name input"
                                    id="usernameInput"
                                    value="${document.querySelector("#username").textContent}"
                                >
                            </div>
                            <div class="page-register__item">
                                <div>
                                    <label for="surname">Real Name:</label>
                                    <span>*</span>
                                </div>
                                <input 
                                    type="text" 
                                    name="surname" 
                                    class="page-register__surname input"
                                    id="realnameInput"
                                    value="${document.querySelector("#realname").textContent}"
                                >
                            </div>
                            <div class="page-register__item">
                                <label for="phone">Phone:</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    class="page-register__phone input"
                                    id="phoneInput"
                                    value="${document.querySelector("#phone-number").textContent}"
                                >
                            </div>
                        </div>
                        <div class="page-register__row">
                            <div class="page-register__item">
                                <div>
                                    <label for="birthday-date">Birthday date:</label>
                                </div>
                                <input 
                                    type="date" 
                                    name="birthday-date" 
                                    class="page-register__birthday input"
                                    id="birthdayInput"
                                    value="${document.querySelector("#birthday-date").textContent}"
                                >
                            </div>
                            <div class="page-register__item">
                                <div>
                                    <label for="country">Country:</label>
                                    <span>*</span>
                                </div>
                                <input 
                                    type="text" 
                                    name="country" 
                                    class="page-register__country input"
                                    id="countryInput"
                                    value="${document.querySelector("#country").textContent}"
                                >
                            </div>
                            <div class="page-register__item">
                                <label for="city">City:</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    class="page-register__city input"
                                    id="cityInput"
                                    value="${document.querySelector("#city").textContent}"
                                >
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Apply changes" class="btn center" id="btn-apply-changes">
                `;

                

                document.querySelector("#btn-apply-changes").addEventListener("click", e => {
                    e.preventDefault();

                    const editData = {
                        dateOfBirthday: document.querySelector("#birthdayInput").value,
                        userName: document.querySelector("#usernameInput").value,
                        realName: document.querySelector("#realnameInput").value,
                        country: document.querySelector("#countryInput").value,
                        city: document.querySelector("#cityInput").value,
                        phoneNumber: document.querySelector("#phoneInput").value
                    };

                    const fullData = { token, ...editData};
                    console.log(fullData);

                    axios.post(editUrl, fullData)
                        .then(response => {
                            if (response.status === 200) {
                                location.reload();   
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });

    } else {
        const cabinet = document.querySelector(".page-cabinet .row");

        cabinet.innerHTML = "";

        const accessDenied = document.createElement("div");
        accessDenied.className = "page__access-denied";
        accessDenied.textContent = "You are not authenticated and don't have permissions to view this page";

        cabinet.appendChild(accessDenied);

        window.location.replace('http://127.0.0.1:8080/login.html');
    }
};