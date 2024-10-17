let car1, car2;  // Objetos de los autos
let carImg1, carImg2;  // Imágenes de los autos
let simulationStarted = false;  // Controlar si la simulación ha iniciado
let simulationStopped = false;  // Controlar si la simulación se ha detenido

let velocidadCar1 = 1;  // Valor inicial para el deslizador de velocidad de car1
let velocidadCar2 = 1;  // Valor inicial para el deslizador de velocidad de car2
let masaCar1 = 1;  // Valor inicial para el deslizador de masa de car1
let masaCar2 = 1;  // Valor inicial para el deslizador de masa de car2

let velocidadInicialCar1, velocidadInicialCar2;  // Guardar las velocidades iniciales
let velocidadFinalCar1, velocidadFinalCar2;  // Guardar las velocidades finales

function preload() {
  // Cargar las dos imágenes de los autos
  carImg1 = loadImage('imagenes/auto copy.webp');  // Imagen del auto de la izquierda
  carImg2 = loadImage('imagenes/auto.webp');       // Imagen del auto de la derecha
}

function setup() {
  // Crear el canvas dentro del contenedor con el id 'canvasContainer'
  let canvas = createCanvas(800, 400);
  canvas.parent('canvasContainer'); // Asociar el canvas de p5.js al contenedor HTML con id="canvasContainer"

  // Inicializar los autos con velocidad 0 (estáticos)
  car1 = new Car(62, height / 2 + 10, 0, masaCar1, carImg1); // Auto de la izquierda sobre la línea
  car2 = new Car(635, height / 2 + 10, 0, masaCar2, carImg2); // Auto de la derecha sobre la línea

  // Escuchar el cambio en los deslizadores y actualizar valores
  document.getElementById('auto1').addEventListener('input', function() {
    velocidadCar1 = parseFloat(this.value);
    document.getElementById('auto1Value').textContent = this.value;
  });

  document.getElementById('v2').addEventListener('input', function() {
    velocidadCar2 = parseFloat(this.value);
    document.getElementById('v2Value').textContent = this.value;
  });

  document.getElementById('masa1').addEventListener('input', function() {
    masaCar1 = parseFloat(this.value);
    document.getElementById('masa1Value').textContent = this.value;
  });

  document.getElementById('masa2').addEventListener('input', function() {
    masaCar2 = parseFloat(this.value);
    document.getElementById('masa2Value').textContent = this.value;
  });

  // Escuchar el clic en el botón "iniciar" para comenzar la simulación
  document.getElementById('iniciar').addEventListener('click', iniciarSimulacion);
  

  // Escuchar el clic en el botón "pantallaCompleta" para activar el modo pantalla completa
  document.getElementById('pantallaCompleta').addEventListener('click', function() {
    toggleFullScreen(); // Alternar modo pantalla completa
  });

  // Manejo del checkbox3 para el choque parcialmente inelástico
  checkbox3.addEventListener('change', function() {
    if (checkbox3.checked) {
      inputValue.style.display = "inline-block"; // Mostrar el input si está marcado
    } else {
      inputValue.style.display = "none"; // Ocultar el input si está desmarcado
    }
  });
}

function draw() {
  background(255);

  // Dibujar bordes en los costados
  fill(0);  // Color negro para los bordes
  rect(0, 0, 20, height);  // Borde izquierdo
  rect(width - 20, 0, 20, height);  // Borde derecho

  // Dibujar línea gris a lo largo del canvas
  stroke(150);  // Color gris para la línea
  strokeWeight(4);  // Grosor de la línea
  line(20, height / 2 + 25, width - 20, height / 2 + 25);  // Línea horizontal gris

  // Dibujar fondo negro debajo de los autos
  fill(0); // Color negro
  rect(20, height / 2 + 25, width - 40, height - (height / 2 + 25));  // Fondo negro

  // Solo continuar la simulación si ha comenzado y no se ha detenido
  if (simulationStarted && !simulationStopped) {
    car1.update();
    car2.update();

    // Verificar colisión con las paredes
    if (collideWithWalls(car1) || collideWithWalls(car2)) {
      detenerSimulacion();
    }

    // Verificar si los autos colisionan entre sí
    if (collides(car1, car2)) {
      let e = 0; // Coeficiente de restitución por defecto (inelástico)

      // Verificar si el checkbox de choque elástico está marcado
      if (document.getElementById('checkbox1').checked) {
        e = 1; // Choque elástico
      }

      // Verificar si el checkbox de choque parcialmente inelástico está marcado
      if (checkbox3.checked) {
        let kValue = parseFloat(inputValue.value);
        if (kValue >= 0.01 && kValue <= 0.99) {
          e = kValue; // Usar el valor de k para choque parcialmente inelástico
        }
      }

      // Calcular las velocidades finales con la ecuación del choque parcialmente inelástico
      let v1Final = ((car1.mass - e * car2.mass) / (car1.mass + car2.mass)) * car1.vx + 
                    ((1 + e) * car2.mass / (car1.mass + car2.mass)) * car2.vx;

      let v2Final = ((car2.mass - e * car1.mass) / (car1.mass + car2.mass)) * car2.vx + 
                    ((1 + e) * car1.mass / (car1.mass + car2.mass)) * car1.vx;

      // Asignar las nuevas velocidades
      car1.vx = v1Final;
      car2.vx = v2Final;

      // Guardar las velocidades finales
      velocidadFinalCar1 = v1Final;
      velocidadFinalCar2 = v2Final;

      // Asegurarse de que los autos no desaparezcan
      car1.x = constrain(car1.x, 20, width - car1.width - 20);
      car2.x = constrain(car2.x, 20, width - car2.width - 20);
    }
  }

  car1.display();
  car2.display();

  // Mostrar las velocidades directamente en el canvas
  fill(255); // Color blanco para el texto
  textSize(16);
  textAlign(CENTER);
  
  // Mostrar velocidad del auto 1 debajo del auto 1
  text(`Velocidad: ${Math.abs(car1.vx * 10).toFixed(2)} m/s`, car1.x + car1.width / 2, car1.y + 30);
  
  // Mostrar velocidad del auto 2 debajo del auto 2
  text(`Velocidad: ${Math.abs(car2.vx * 10).toFixed(2)} m/s`, car2.x + car2.width / 2, car2.y + 30);
}

// Función para iniciar la simulación
function iniciarSimulacion() {
  simulationStarted = true;
  simulationStopped = false;

  // Restablecer las posiciones iniciales de los autos
  car1.x = 62;  // Posición inicial del auto 1
  car2.x = 635;  // Posición inicial del auto 2

  // Guardar las velocidades iniciales de los autos
  velocidadInicialCar1 = velocidadCar1 / 10;
  velocidadInicialCar2 = -velocidadCar2 / 10;

  // Asignar las velocidades y masas de los autos basadas en los valores actuales de los deslizadores
  car1.vx = velocidadInicialCar1;  // El auto de la izquierda se moverá hacia la derecha
  car2.vx = velocidadInicialCar2;  // El auto de la derecha se moverá hacia la izquierda

  car1.mass = masaCar1;  // Actualizar la masa del auto 1
  car2.mass = masaCar2;  // Actualizar la masa del auto 2
}

// Función para detener la simulación
function detenerSimulacion() {
  simulationStopped = true;  // Detener la simulación
  car1.vx = 0;  // Detener el movimiento del auto 1
  car2.vx = 0;  // Detener el movimiento del auto 2

  // Mostrar un alert con las velocidades y masas
  alert(
    `Auto 1:\n` +
    `Masa: ${car1.mass}\n` +
    `Velocidad Inicial: ${Math.abs(velocidadInicialCar1.toFixed(2))} m/s\n` +
    `Velocidad Final: ${Math.abs(velocidadFinalCar1.toFixed(2))} m/s\n\n` +
    `Auto 2:\n` +
    `Masa: ${car2.mass}\n` +
    `Velocidad Inicial: ${Math.abs(velocidadInicialCar2.toFixed(2))} m/s\n` +
    `Velocidad Final: ${Math.abs(velocidadFinalCar2.toFixed(2))} m/s`
  );
}

// Función para verificar si un auto colisiona con las paredes
function collideWithWalls(car) {
  // Colisiona con el borde izquierdo o derecho
  return car.x <= 20 || car.x + car.width >= width - 20;
}

// Clase Car para representar cada auto
class Car {
  constructor(x, y, vx, mass, img) {
    this.x = x;
    this.y = y;
    this.vx = vx;  // Velocidad en el eje x
    this.mass = mass;  // Masa del auto
    this.width = 100;  // Ancho del auto
    this.height = 50;  // Alto del auto
    this.img = img;  // Imagen del auto
  }

  // Actualizar la posición del auto
  update() {
    this.x += this.vx;
  }

  // Mostrar el auto en pantalla
  display() {
    image(this.img, this.x, this.y - this.height / 2, this.width, this.height);
  }
}

// Función para verificar si los autos colisionan entre sí
function collides(car1, car2) {
  return car1.x + car1.width >= car2.x && car1.x <= car2.x + car2.width;
}

// Función para alternar pantalla completa
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
