let links = ["Home", "About", "Contact"];
const fields = ["user_name", "user_email", "user_message", "subject"];
const domFields = {};
const spinner = document.querySelector(".spinner_con");
fields.forEach((f) => {
  domFields[f] = document.getElementById(f);
});

links.forEach((link) => {
  let links = document.querySelectorAll(`.${link}_link`);
  links = Array.from(links);
  links.forEach( l => l.addEventListener("click", () => {
    navigate(link);
  }))
});

const textArea = document.querySelector("textarea.form-control");
textArea.style.color = "#757575";
textArea.addEventListener("click", () => {
  textArea.textContent = "";
  textArea.style.color = "#333";
});

const resultCon = document.querySelector(".result_con");
const submitBtn = document.querySelector(".form-control.btn");

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  resultCon.innerHTML = "";
  spinner.style.zIndex = 2;
  submitBtn.textContent = "Submiting...";

  const errors = validator();
  if (errors.length === 0) {
    let res = await fetch("/api/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: domFields.user_email.value,
        subject: domFields.subject.value,
        message: domFields.user_message.value,
        name: domFields.user_name.value,
      }),
    });
    res = await res.json();
    if (res.error) {
      showErrors(res.error);
    } else if (res.message.indexOf("Mail Send Successfully!") !== -1) {
      let html = `
          <div class="success">
            <span class="success_close_btn">x</span>
            Email send successfully!
          </div>
          `;
      resultCon.innerHTML = html;
      document
        .querySelector(".success_close_btn")
        .addEventListener("click", () => {
          resultCon.innerHTML = "";
        });
    }
  } else showErrors(errors);
  spinner.style.zIndex = 0;
  submitBtn.textContent = "Submit";
});

setYear();

function navigate(el) {
  links.forEach((link) =>
    document.querySelector(`.${link}_con`).classList.remove("active")
  );
  document.querySelector(`.${el}_con`).classList.add("active");
  document.title = `Niaz | ${el}`;

  const heroHeight = document.querySelector(`.${el}_con`).scrollHeight + "px";
  document.querySelector(".hero_area").style.height = heroHeight;
}

function setYear() {
  document.querySelector("#year").textContent = new Date().getFullYear();
}

function validator() {
  const errors = [];
  fields.forEach((f) => {
    if (
      (!domFields[f].value && f !== "subject") ||
      (domFields.user_message.value === "Message" && f === "user_message")
    )
      errors.push(f + " can't be empty");
  });

  if (errors.length > 0) return errors;
  if (domFields.user_name.value.length < 3)
    errors.push("Name should be at least of 3 characters.");
  if (
    domFields.user_email.value.length < 6 ||
    domFields.user_email.value.indexOf("@") === -1 ||
    domFields.user_email.value.indexOf(".") === -1
  )
    errors.push("Invalid Email");

  if (domFields.user_message.value.length < 10)
    errors.push("Message should be at least of 10 characters.");
  return errors;
}

function showErrors(errors) {
  let html = '<div class="errors"><span class="errors_close_btn">x</span>';
  errors.forEach((e) => {
    html += `${e}<br>`;
  });
  html += "</div>";
  resultCon.innerHTML = html;

  document.querySelector(".errors_close_btn").addEventListener("click", () => {
    resultCon.innerHTML = "";
  });
}
