window.onload = () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
        const url = "http://localhost:3000/api/user-info";

        axios.post(url, { token })
            .then(response => {
                console.log(response.data);

                // document.querySelector("#account-id").value = response.data.id;
                // document.querySelector("#username").value = response.data.value
                // document.querySelector("#title-user").value = response.data.value
                // document.querySelector("#realname").value = response.data.value
                // document.querySelector("#birthday-date").value = response.data.value
                // document.querySelector("#phone-number").value = response.data.value
                // document.querySelector("#email").value = response.data.value
                // document.querySelector("#country").value = response.data.value
                // document.querySelector("#city").value = response.data.value
                // document.querySelector("#registration-date").value = response.data.value
                // document.querySelector("#bets-done").value = response.data.value
                // if (response.data.isPremium) {
                //     document.querySelector("#title-premium")
                //         .classList.add("page-cabinet__premium-title--active"); 
                //     document.querySelector("#title-premium")
                //         .classList.remove("page-cabinet__premium-title--disabled"); 
                // } else {
                //     document.querySelector("#title-premium")
                //         .classList.remove("page-cabinet__premium-title--active"); 
                //     document.querySelector("#title-premium")
                //         .classList.add("page-cabinet__premium-title--disabled"); 
                // }
                // document.querySelector("#balance").textContent = response.data.value
            })
            .catch(error => {
                console.log(error);
            })
    } else {

        const cabinet = document.querySelector(".page-cabinet .row");

        cabinet.innerHTML = "";

        const accessDenied = document.createElement("div");
        accessDenied.className = "page__access-denied";
        accessDenied.textContent = "You are not authenticated and don't have permissions to view this page";

        cabinet.appendChild(accessDenied);
    }
};