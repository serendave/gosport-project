const createPopup = (text, element = document.querySelector("body"), extraLink, linkText) => {

    if (element === "") element = document.querySelector("body");

    const modal = document.createElement("div");
    modal.className = "page__modal animate__animated animate__fadeIn";
    modal.style.animationDuration = "0.2s";
    modal.style.zIndex = "2000";
    const content = document.createElement("div");
    content.className = "page__modal-content";
    const closeTag = document.createElement("div");
    closeTag.className = "page__modal-content--close";
    closeTag.textContent = "+";
    const contentText = document.createElement("div");
    contentText.textContent = text;
    contentText.style.marginBottom = "2rem";

    content.appendChild(closeTag);
    content.appendChild(contentText);
    
    if (extraLink) {
        const linkButton = document.createElement("a");
        linkButton.className = "btn";
        linkButton.setAttribute("href", extraLink);
        linkButton.style.display = "block";
        if (linkText) linkButton.textContent = linkText;
        content.appendChild(linkButton);
    }
    
    modal.appendChild(content);
    element.appendChild(modal);

    closeTag.addEventListener("click", e => {
        element.removeChild(modal);
    });
};

export default createPopup;