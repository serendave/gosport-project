$(() => {
    $.getScript("./src/js/validation.js", () => {
        validate(() => {
            console.log("valid");
        }, () => {
            console.log("invalid");
        })
    });
});