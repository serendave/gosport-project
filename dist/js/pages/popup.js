const createPopup = (text, element, extraLink, linkText) => {

    const modal = document.createElement("div");
    modal.className = "page__modal";
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