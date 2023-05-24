const form = document.getElementById("inputText");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form); 

    let sentence = formData.get("sentence");
    if(sentence.length <= 50) {
      alertMessages("Please input at least 50 characters");
    return;
  }
    const response = await window.axios.openAI(formData.get("sentence"));
    document.getElementById("outputText").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
   
    }
  }

function alertMessages(sentence) {

  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    gravity: "top", 
    position: "left", 
    stopOnFocus: true, 
    style: {
      textAlign: "center",
      background: "red",
    },
    })


}
