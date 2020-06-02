$(document).ready(() => {

    // Sticky navigation
    $(".features").waypoint(function (direction) {
        if (direction == "down") {
            $(".header").addClass("header--sticky");
        } else {
            $(".header").removeClass("header--sticky");
        }
    }, {
        offset: "55px"
    });

    const url = "http://localhost:3000/api/get-current-matches";
    const numberOfMatchesToShow = 4;
    const matchesContainer = document.querySelector(".matches__container .slider__items");

    axios.get(url)
        .then(response => {
            for (let i = 1; i <= numberOfMatchesToShow; i++) {
                const match = response.data.matches[i];
                const matchTemplate = `
                    <figure class="matches__match slider__item slider__item_${i}">
                        <div class="matches__team">
                            <img src="dist/images/team-logo-1.png" alt="Team 1 logo" class="matches__team-logo">
                            <p class="matches__team-name">${match.team1.teamName}</p>
                        </div>
                        <div class="matches__info">
                            <img src="dist/images/match.jpg" alt="Match image" class="matches__image">
                            <p class="matches__date">05.04.2020</p>
                            <p class="matches__time">12:55</p>
                        </div>
                        <div class="matches__team">
                            <img src="dist/images/team-logo-2.jpg" alt="Team 2 logo" class="matches__team-logo">
                            <p class="matches__team-name">${match.team2.teamName}</p>
                        </div>
                    </figure>
                `;

                matchesContainer.insertAdjacentHTML("beforeend", matchTemplate);
            }
        })
        .catch(error => {
            console.log(error);
        });
});