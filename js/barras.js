function updateValue(sliderId, displayId) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);

    slider.addEventListener('input', () => {
      display.textContent = slider.value;
    });
  }

  updateValue('auto1', 'auto1Value');
  updateValue('masa1', 'masa1Value');
  updateValue('v2', 'v2Value');
  updateValue('masa2', 'masa2Value');

  const checkbox1 = document.getElementById("checkbox1");
  const checkbox2 = document.getElementById("checkbox2");
  const checkbox3 = document.getElementById("checkbox3");
  const inputValue = document.getElementById("inputValue");

  checkbox1.addEventListener("change", function() {
    if (checkbox1.checked) {
      checkbox2.checked = false;
      checkbox3.checked = false;
      inputValue.style.display = "none"; // Ocultar el input si se selecciona checkbox1
    }
  });

  checkbox2.addEventListener("change", function() {
    if (checkbox2.checked) {
      checkbox1.checked = false;
      checkbox3.checked = false;
      inputValue.style.display = "none"; // Ocultar el input si se selecciona checkbox2
    }
  });

  // Evento para checkbox3
  checkbox3.addEventListener("change", function() {
    if (checkbox3.checked) {
      checkbox1.checked = false;
      checkbox2.checked = false;
      inputValue.style.display = "inline-block"; // Mostrar el input si se selecciona checkbox3
    } else {
      inputValue.style.display = "none"; // Ocultar el input si se desmarca checkbox3
    }
  });