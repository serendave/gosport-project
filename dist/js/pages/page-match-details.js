let matchId;
let chosenCoefficient;
let teamName;

window.onload = () => {

    // Check if user is authenticated
    const token = localStorage.getItem("token");

    if (!token) {

        // Parse the URL parameter
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        matchId = getParameterByName("id");
        console.log(matchId);

        // Get the match and display it
        const url = "api to backend";

        // axios.post(url, token)
        //     .then(response => {
        // DISPLAYING COEFFICIENTS
        // document.querySelector("#coefficient-1 span:last-child").textContent = response.data;
        // document.querySelector("#coefficient-x span:last-child").textContent = response.data;
        // document.querySelector("#coefficient-2 span:last-child").textContent = response.data;
        // document.querySelector("#coefficient-1x span:last-child").textContent = response.data;
        // document.querySelector("#coefficient-12 span:last-child").textContent = response.data;
        // document.querySelector("#coefficient-2x span:last-child").textContent = response.data;
        const coefficients = Array.from(
            document.querySelectorAll(".match-detail__coefficients .match-detail__item"));

        coefficients.forEach(coefficient => {
            coefficient.addEventListener("click", e => {
                const modalMakeBet = document.querySelector("#modal-make-bet");
                modalMakeBet.classList.remove("page__modal--hidden");

                const modalClose = document.querySelector("#modal-make-bet .page__modal-content--close");
                modalClose.addEventListener("click", e => {
                    modalMakeBet.classList.add("page__modal--hidden");
                });
            });
        });



        // document.querySelector("#math-prediction-1 span:last-child").textContent = response.data;
        // document.querySelector("#math-prediction-x span:last-child").textContent = response.data;
        // document.querySelector("#math-prediction-2 span:last-child").textContent = response.data;
        // document.querySelector("#math-prediction-1x span:last-child").textContent = response.data;
        // document.querySelector("#math-prediction-12 span:last-child").textContent = response.data;
        // document.querySelector("#math-prediction-2x span:last-child").textContent = response.data;

        // document.querySelector("#neuro-prediction-1 span:last-child").textContent = response.data;
        // document.querySelector("#neuro-prediction-x span:last-child").textContent = response.data;
        // document.querySelector("#neuro-prediction-2 span:last-child").textContent = response.data;
        // document.querySelector("#neuro-prediction-1x span:last-child").textContent = response.data;
        // document.querySelector("#neuro-prediction-12 span:last-child").textContent = response.data;
        // document.querySelector("#neuro-prediction-2x span:last-child").textContent = response.data;

        // DISPLAYING DATE
        // document.querySelector("#match-date").textContent = response.data;
        // document.querySelector("#match-time").textContent = response.data;

        // DISPLAYING STATS

        // const urlDetailsFirstTeam = "api to backend";
        // const firstTeamId = response.data.teamId

        // axios.post(urlDetailsFirstTeam, {
        //     token,
        //     firstTeamId
        // })
        // .then(response => {
        //     const statsContainer = document.querySelector("#statistics-team-1 .statistics__container");

        //     response.data.matches.forEach(match => {
        //         const matchInfo = `
        //             <div class="statistics__row">
        //                 <div class="statistics__element">${match.team1.teamName}</div>
        //                 <div class="statistics__element statistics__element--win">${match.goalsTeam1}:${match.goalsTeam2}</div>
        //                 <div class="statistics__element">${match.team2.teamName}</div>
        //             </div>
        //         `;

        //         statsContainer.insertAdjacentHTML("beforeend", matchInfo);
        //     });
        // })
        // .catch(error => {
        //     console.log(error);
        // })

        // const urlDetailsSecondTeam = "api to backend";
        // const secondTeamId = response.data.teamId

        // axios.post(urlDetailsFirstTeam, token)
        //     .then(response => {

        //     })

        // })
        // .catch(error => {
        //     console.log(error);
        // });

    } else {

        const cabinet = document.querySelector(".page-match-details .row");

        cabinet.innerHTML = "";

        const accessDenied = document.createElement("div");
        accessDenied.className = "page__access-denied";

        const accessDeniedContainter = document.createElement("div");
        accessDeniedContainter.className = "page__access-denied--container";
        accessDeniedContainter.textContent = "You are not authenticated and don't have permissions to view this page";

        accessDenied.appendChild(accessDeniedContainter);
        cabinet.appendChild(accessDenied);
    }
};