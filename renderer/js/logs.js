// Form Login
const form_login = document.getElementById("form_login");
if (form_login) {
    form_login.onsubmit = async function (e) {
        e.preventDefault();

        const btn_submit = document.querySelector("#form_login button[type='submit']");
        const formData = new FormData(form_login);

        btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
        btn_submit.disabled = true;

        const response = await window.axios.backendLaravel('post', 'login', {
            email: formData.get("email"),
            password: formData.get("password"),
        });

        // If email and password validation fails
        if (response.user == null) {
            const field_email = document.querySelector("#form_login input[name='email']");
            const field_password = document.querySelector("#form_login input[name='password']");
            const invalid_email = document.getElementById("invalid_email");
            const invalid_password = document.getElementById("invalid_password");

            if (response.errors.email == undefined) {
                invalid_email.innerHTML = '';
                field_email.classList.remove('is-invalid');
            } else {
                invalid_email.innerHTML = response.errors.email;
                field_email.classList.add('is-invalid');
            }

            if (response.errors.password == undefined) {
                invalid_password.innerHTML = '';
                field_password.classList.remove('is-invalid');
            } else {
                invalid_password.innerHTML = response.errors.password;
                field_password.classList.add('is-invalid');
            }

            btn_submit.innerHTML = 'Login';
            btn_submit.disabled = false;
            return;
        }

         // Store Token for Backend Laravel API access
    sessionStorage.setItem('token', response.token);
    alertMessage("success", "Successfully logged in account!");

    // Hide Login Form and Show Prompts Table
    const div_login = document.getElementById("div_login");
    const div_prompts = document.getElementById("div_prompts");
    div_login.classList.add('d-none');
    div_prompts.classList.remove('d-none');
    div_prompts.classList.add('d-flex');

    btn_submit.innerHTML = 'Login';
    btn_submit.disabled = false;

    // Load Table
    getPrompts(); 
    };
}

// Btn Logout
const btn_logout = document.getElementById('btn_logout');
if (btn_logout) {
    btn_logout.onclick = async function () {
        btn_logout.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
        btn_logout.disabled = true;

        // Use Token to Logout
        const token = sessionStorage.getItem('token');
        const response = await window.axios.backendLaravel('post', 'logout', null, token);
        console.log(response);

        // Hide Login Form and Show Prompts Table
        const div_login = document.getElementById("div_login");
        const div_prompts = document.getElementById("div_prompts");
        div_login.classList.remove('d-none');
        div_login.classList.add('d-flex');
        div_prompts.classList.remove('d-flex');
        div_prompts.classList.add('d-none');

        // Clear Login Form Fields
        const field_email = document.querySelector("#form_login input[name='email']");
        const field_password = document.querySelector("#form_login input[name='password']");
        const invalid_email = document.getElementById("invalid_email");
        const invalid_password = document.getElementById("invalid_password");
        invalid_email.innerHTML = '';
        field_email.value = '';
        field_email.classList.remove('is-invalid');
        invalid_password.innerHTML = '';
        field_password.value = '';
        field_password.classList.remove('is-invalid');

        btn_logout.innerHTML = 'Logout';
        btn_logout.disabled = false;
    }
}

// Read Prompts from Laravel Backend
async function getPrompts () {
    // Fetch API Response
    const response = await axios.get('/prompts');

    // Load table from API Response
    let htmlResult = '';
    response.data.forEach(item => {
        let date = new Date(item.created_at.replace(' ', 'T'));

        htmlResult += '<tr>' +
            '<th scope="row">' +  item.prompt_id + '</th>' +
            '<td>' + item.tools_type + '</td>' +
            '<td>' + item.text + '</td>' +
            '<td>' + item.result + '</td>' +
            '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
            '<td>' + 
                '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'Action' +
                    '</button>' +
                    '<ul class="dropdown-menu">' +
                        '<li><a id="btn_prompts_del" class="dropdown-item" href="#" name="' + item.prompt_id + '">Remove</a></li>' +
                    '</ul>' +
                '</div>' +
        '</tr>';
    });

    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}


// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if (e.target && e.target.id == "btn_prompts_del") {
            const id = e.target.name;

            // Use Token for Access
            const token = sessionStorage.getItem('token');

            const response = await window.axios.backendLaravel('delete', 'prompts/' + id, null, token);
            console.log(response);

            alertMessage("success", "Successfully deleted id " + id + '!');
            getPrompts();
        }
    };
}
