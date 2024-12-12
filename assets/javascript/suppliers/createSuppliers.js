var checkValidateName = false;

// Function to check if all fields are valid
function checkFormValidity() {
    var form = document.getElementById('supplierForm');
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
    var form = document.getElementById('supplierForm');
    var inputs = form.querySelectorAll('input');

    inputs.forEach(function(input) {
        input.addEventListener('input', checkFormValidity);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Validate name supplier
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
            const found = suppliers.includes(inputName);
            if (found) {
                nameCheck.textContent = "Nhà cung cấp đã tồn tại.";
                nameCheck.classList.remove("text-success");
                nameCheck.classList.add("text-danger");

                // Display associated supplier names
                const associatedHTML = suppliers
                    .filter((supplier) => supplier.includes(inputName))
                    .map(
                        (supplier) =>
                            `<p class="text-danger">Đã tìm thấy ${supplier} trong kho!</p>`
                    )
                    .join("");
                associatedFields.innerHTML = associatedHTML;
            } else {
                nameCheck.textContent =
                    "Bạn có thể sử dụng tên nhà cung cấp này.";
                nameCheck.classList.remove("text-danger");
                nameCheck.classList.add("text-success");

                // Clear associated supplier names
                associatedFields.innerHTML = "";

                checkValidateName = true;

                checkFormValidity();
            }
        }
    });
});

// Custom validation function for phone number
function validatePhoneNumber(input) {
    var phoneNumber = input.value;
    // Regular expression to match only numeric values
    var regex = /^\d+$/;
    if (!regex.test(phoneNumber)) {
        input.setCustomValidity("Phone number must contain only numeric values.");
    } else if (phoneNumber.length !== 10) {
        input.setCustomValidity("Phone number must be 10 digits long.");
    } else {
        input.setCustomValidity("");
    }
}

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

    // Add event listener for phone number input
    var phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function () {
        validatePhoneNumber(phoneInput);
    });
})()

function submitForm() {
    // Get form data
    const formData = {
        name: document.getElementById("name").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
    };

    // Send POST request using Axios
    axios
        .post("/suppliers/add", formData)
        .then((response) => {
            // Handle success
            if (response.data.success) {
                alert('Thêm mới nhà cung cấp thành công!')
                window.location.assign(window.location.origin  + '/suppliers/detail');
            } else {
                alert('Thêm mới không thành công!')
                window.location.assign(window.location.origin  + '/suppliers/create');
            }
        })
        .catch((error) => {
            // Handle error
            console.error("Error submitting form:", error);
            // You can display an error message to the user or handle the error in any appropriate way
        });
}

// Attach the submitForm function to the form submit event
document
    .getElementById("supplierForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        var form = document.getElementById('supplierForm');
        if (checkValidateName == false) {
            alert('Vui lòng kiểm tra tên nhà cung cấp')
        } else {
            if (form.classList.contains('validate-success') && checkValidateName) {
                submitForm()
            } else {
                alert('Vui lòng kiểm tra lại các trường trước khi gửi!')
            }
        }
    });
