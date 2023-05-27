// Extract Text from Image
const btn_extract = document.getElementById("btn_extract");
if (btn_extract) {
  btn_extract.onclick = async function () {
    const file = document.getElementById("file_extract").files[0];

    const file_types = ['image/png', 'image/bmp', 'image/jpeg'];
    if (!file || !file_types.includes(file['type'])) {
      alertMessage("error", "Please upload an image with (png, bmp, jpeg) format!");
      return; 
    }

    btn_extract.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_extract.disabled = true;

    try {
      const response = await window.axios.tesseract(file.path);
      document.querySelector("textarea[name='sentence-text']").value = response.text;

      const selectedImage = document.getElementById("selected-image");
      selectedImage.src = URL.createObjectURL(file);
      selectedImage.removeAttribute('hidden');
    } catch (error) {
      console.error(error);
      alertMessage("error", "An error occurred while processing the image.");
    } finally {
      btn_extract.innerHTML = 'Extract Text';
      btn_extract.disabled = false;
    }
  };
}

// Form Submit
const form_openai = document.getElementById("form_openai");
if (form_openai) {
  form_openai.onsubmit = async function (e) {
    e.preventDefault();

    const btn_submit = document.querySelector("#form_openai button[type='submit']");
    const formData = new FormData(form_openai);
    let tools_type = formData.get("tools-type");
    let sentence = formData.get("sentence-text");

    if (tools_type == null) {
      alertMessage("error", "Please choose OpenAI Tools!");
      return;
    }

    if (sentence.length <= 3) {
      alertMessage("error", "Please input text of at least 3 characters!");
      return;
    }

    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_submit.disabled = true;

    // Access OpenAI alongside the prompt
    const response = await window.axios.openAI(sentence, tools_type);

    // Show Div Result
    const div_result = document.querySelector("#div-result");
    div_result.classList.remove('d-none');
    div_result.classList.add('d-block');

    // Check Error if it exists
    if (response.error) {
      document.querySelector("#div-result textarea").innerHTML = response.error.message;
      return;
    }

    // Provide result if there are no errors
    let result = response.choices[0].text;
    document.querySelector("#div-result textarea").innerHTML = result.replace(/\n/g, "");

    // Store the prompt and result in the database
    const db_response = await window.axios.backendLaravel('post', 'prompts', {
      text: sentence,
      result: result,
      tools_type: tools_type
    });
    console.log(db_response);

    btn_submit.innerHTML = 'Process Text';
    btn_submit.disabled = false;
  };
}

// Alert Message
function alertMessage(status, sentence) {
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: status == "error" ? "#E76161" : "#539165",
      color: "white",
      padding: "5px",
      marginTop: "2px"
    }
  });
}
