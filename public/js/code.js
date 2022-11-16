const elements = {
  main: document.querySelector("main"),
  dateInput: document.querySelector("#date-input"),
  bagsInput: document.querySelector("#bags-input"),
  weightInput: document.querySelector("#weight-input"),
  formSubmit: document.querySelector("#form-submit"),
  error: document.querySelector("#error"),
  consumptions: document.querySelector("#consumptions"),
};

elements.dateInput.valueAsDate = new Date();

elements.formSubmit.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const bags = elements.bagsInput.value;
    const weight = elements.weightInput.value;
    const date = elements.dateInput.value;

    const response = await fetch("/api/pellets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bags,
        date,
        weight,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      addError(errorMessage.message);
    } else {
      loadConsumptions();
    }
  } catch (error) {
    addError(error.message);
  }
});

async function loadConsumptions() {
  try {
    const response = await fetch("/api/pellets");
    if (!response.ok) {
      addError("Failed to get consumptions...");
    } else {
      const consumptions = await response.json();
      displayConsumptions(consumptions);
    }
  } catch (error) {
    addError(error.message);
  }
}

function addError(errorMessage) {
  elements.main.innerHTML =
    `<section id="error">${errorMessage}</section>` + elements.main.innerHTML;
}

async function deleteConsumption(id) {
  try {
    const confirmation = confirm(
      "Are you sure you want to delete this consumption?"
    );

    if (confirmation) {
      const response = await fetch(`/api/pellets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        addError(errorMessage.message);
      } else {
        loadConsumptions();
      }
    }
  } catch (error) {
    addError(error.message);
  }
}

function displayConsumptions(consumptions) {
  if (consumptions.length === 0) {
    elements.consumptions.innerHTML =
      "<div><p id='no-consumptions'>No consumtions</p></div>";
  } else {
    const html = consumptions.map((consumption) => {
      return `<div><p>${consumption.bags}</p><p>${consumption.weight}</p><p>${consumption.date}</p><p><button onclick="deleteConsumption('${consumption._id}')">delete</button></div>`;
    });

    const heading = `<div><p>N° of bags</p><p>Weight per bag</p><p>Date</p><p>Delete?</p></div>`;

    elements.consumptions.innerHTML = heading + html.join("");
  }
}

loadConsumptions();
