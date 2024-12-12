const userSectionElement = document.querySelectorAll("#userNameID")
const btnLogout = document.getElementById('btnLogout')

document.addEventListener("DOMContentLoaded", (event) => {
    // Accessing cookies using JavaScript
    var cookies = document.cookie.split(";");
    var cookieData = {};
    cookies.forEach(function (cookie) {
        var parts = cookie.split("=");
        var name = parts[0].trim();
        var value = decodeURIComponent(parts.slice(1).join("=").trim());
        cookieData[name] = value;
    });
    // Output cookie data to console (for demonstration)
    // console.log("Cookie Data:", cookieData);
    if (cookieData.sessionUserName && cookieData.token) {
        userSectionElement.forEach(userSection => {
            userSection.innerHTML = 'Welcome <strong>' + cookieData.sessionUserName + '</strong>';
        });
    } else {
        btnLogout.style.display = 'none';
    }

});

