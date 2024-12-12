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
    console.log("Cookie Data:", cookieData);
    if (cookieData.token) {
        window.location.assign(window.location.origin  + '/user');
    }
});


async function handleLogin(event) {
    await axios.post('/user/login', {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
    }).then(result => {
        console.log(result)
        if (result.data.success) {
            alert('Đăng nhập thành công!')
            if (result.data.notReturn == true) {
                localStorage.setItem("notReturn", "false");
            } 
            window.location.assign(window.location.origin + '/');
        }

    }).catch(err => {
        console.log(err)
        if (!err.response.data.success) {
            alert('Đăng nhập thất bại, vui lòng kiểm tra lại tên người dùng hoặc mật khẩu')
        }
    })
}