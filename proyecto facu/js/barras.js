
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
    

        checkbox1.addEventListener("change", function() {
          if (checkbox1.checked) 
          {
          checkbox2.checked = false;}

        });
    
        checkbox2.addEventListener("change", function() {
          if (checkbox2.checked) {
            checkbox1.checked = false; 1
          }
        })
          // Escuchar el clic en el botón "iniciar" para comenzar la simulación
  document.getElementById('iniciar').addEventListener('click', iniciarSimulacion);
  
  // Escuchar el clic en el botón "reiniciar" para recargar la página
  document.getElementById('reiniciar').addEventListener('click', function() {
    location.reload(); // Reinicia la página
  });

  // Escuchar el clic en el botón "pantallaCompleta" para activar el modo pantalla completa
  document.getElementById('pantallaCompleta').addEventListener('click', function() {
    toggleFullScreen(); // Alternar modo pantalla completa
  });

