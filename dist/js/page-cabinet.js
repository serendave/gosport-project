window.onload = () => {
    console.log("Hello");

    const token = localStorage.getItem("tokenId");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
        console.log("Authenticated")
        console.log("There is token");
        console.log("There is userId");

        document.querySelector("#account-id").textContent = userId;
    } else {
        console.log("Unauthenticated");
    }
};