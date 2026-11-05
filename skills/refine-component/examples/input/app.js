const form = document.querySelector("#email-form");
const input = document.querySelector("#email");
const error = document.querySelector("#email-error");
const status = document.querySelector("#status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  if (!input.validity.valid) {
    input.setAttribute("aria-invalid", "true");
    input.classList.remove("shake");
    void input.offsetWidth;
    input.classList.add("shake");
    error.textContent = input.value.trim()
      ? "Enter an email address in the format name@example.com."
      : "Enter an email address to continue.";
    input.focus();
    return;
  }

  input.removeAttribute("aria-invalid");
  error.textContent = "";
  status.textContent = "That address looks valid. Nothing was sent or stored.";
});

input.addEventListener("input", () => {
  input.classList.remove("shake");
  if (input.validity.valid) {
    input.removeAttribute("aria-invalid");
    error.textContent = "";
  }
});
