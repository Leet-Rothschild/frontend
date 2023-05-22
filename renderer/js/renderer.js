// function summarizeText() {
//     const inputText = document.getElementById('inputText').value;
    
//     // Make a request to the tl;dr API using the inputText
    
//     // Process the response and extract the summary
    
//     const summaryText = 'This is the summarized text'; // Replace with the actual summarized text
    
//     document.getElementById('summaryText').value = summaryText;
//   }

const form = document.getElementById("inputText");
if (form) {
  form.onsubmit = function (e) {
    
    e.preventDefault();
    const formData = new FormData(form);

    for (const [key, value] of formData) {
        console.log(`${key}: ${value}\n`); 
    }
  }
}  