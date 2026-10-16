// Paste your deployed Google Apps Script Web App URL between the quotes below.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPxV69eBTAzj9Z9PtDsU07DElKnRsgbGnr472bl8fRDGviEPIwlDXPqyu7IAOhS_Wp/exec";

const form = document.getElementById("interestForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/")) {
    message.textContent = "The form is not connected yet. Please contact the form administrator.";
    message.className = "message error";
    return;
  }

  const data = {
    studentName: document.getElementById("studentName").value.trim(),
    courseYear: document.getElementById("courseYear").value,
    interest: new FormData(form).get("interest")
  };

  if (!data.studentName || !data.courseYear || !data.interest) {
    message.textContent = "Please complete all required fields.";
    message.className = "message error";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  message.textContent = "";

  try {
    // Apps Script accepts this as a POST. no-cors prevents browser CORS blocking,
    // but it also means the page cannot read the server response.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    message.textContent = "Your response has been sent. Thank you! If needed, the college administrator can verify it in Google Sheets.";
    message.className = "message";
    form.reset();
  } catch (error) {
    message.textContent = "Submission could not be sent. Please check your internet connection and try again.";
    message.className = "message error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Response <span>→</span>';
  }
});
