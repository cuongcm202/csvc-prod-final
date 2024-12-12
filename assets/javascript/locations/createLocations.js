var checkValidateName = false;

// Function to check if all fields are valid
function checkFormValidity() {
    var form = document.getElementById('locationForm');
    var inputs = form.querySelectorAll('input');
    var isValid = true;

    inputs.forEach(function(input) {
        if (!input.checkValidity()) {
            isValid = false;
            form.classList.remove("validate-success");
        }
    });

    if (isValid) {
        // console.log("Validation success!");
        if (checkValidateName == true) {
            form.classList.add("validate-success");
        }
    }
}

// Add event listener to each input field to check for validity
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('locationForm');
    var inputs = form.querySelectorAll('input');

    inputs.forEach(function(input) {
        input.addEventListener('input', checkFormValidity);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Validate name location
    const checkBtn = document.getElementById("checkBtn");
    const nameInput = document.getElementById("name");
    const nameCheck = document.getElementById("nameCheck");
    const associatedFields = document.getElementById("associatedFields");

    checkBtn.addEventListener("click", function () {
        const inputName = nameInput.value.trim();

        if (!inputName) {
            nameCheck.textContent = "Vui lòng nhập nhà cung cấp.";
            nameCheck.classList.remove("text-success");
            nameCheck.classList.add("text-danger");
        } else {
            const found = locations.includes(inputName);
            if (found) {
                nameCheck.textContent = "Vị trí đã tồn tại.";
                nameCheck.classList.remove("text-success");
                nameCheck.classList.add("text-danger");

                // Display associated location names
                const associatedHTML = locations
                    .filter((location) => location.includes(inputName))
                    .map(
                        (location) =>
                            `<p class="text-danger">Đã tìm thấy ${location} trong kho!</p>`
                    )
                    .join("");
                associatedFields.innerHTML = associatedHTML;
            } else {
                nameCheck.textContent =
                    "Bạn có thể sử dụng tên vị trí này.";
                nameCheck.classList.remove("text-danger");
                nameCheck.classList.add("text-success");

                // Clear associated location names
                associatedFields.innerHTML = "";

                checkValidateName = true;

                checkFormValidity();
            }
        }
    });
});

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function submitLocationForm() {
    var formData = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        address: document.getElementById("address").value
    };
    
    axios.post('/locations/add', formData)
        .then(function (response) {
            // Handle success
            if (response.data.success) {
                alert('Thêm mới vị trí thành công!')
                window.location.assign(window.location.origin  + '/locations/detail');
            } else {
                alert('Thêm mới không thành công!')
                window.location.assign(window.location.origin  + '/locations/create');
            }
        })
        .catch(function (error) {
            console.error('Error submitting form:', error);
        });
}

// Attach the submitForm function to the form submit event
document
    .getElementById("locationForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        var form = document.getElementById('locationForm');
        if (checkValidateName == false) {
            alert('Vui lòng kiểm tra tên nhà cung cấp')
        } else {
            if (form.classList.contains('validate-success') && checkValidateName) {
                submitLocationForm()
            } else {
                alert('Vui lòng kiểm tra lại các trường trước khi gửi!')
            }
        }
    });