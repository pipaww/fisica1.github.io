let car1, car2;  
let carImg1, carImg2; 
let simulationStarted = false;  
let simulationStopped = false;  

let velocidadCar1 = 1; 
let velocidadCar2 = 1;  
let masaCar1 = 1;  
let masaCar2 = 1;  

let velocidadInicialCar1, velocidadInicialCar2;  
let velocidadFinalCar1, velocidadFinalCar2;  

function preload() {
  
  carImg1 = loadImage('imagenes/auto copy.webp');  
  carImg2 = loadImage('imagenes/auto.webp');       
}

function setup() {

  let canvas = createCanvas(800, 400);
  canvas.parent('canvasContainer'); 


  car1 = new Car(62, height / 2 + 10, 0, masaCar1, carImg1); 
  car2 = new Car(635, height / 2 + 10, 0, masaCar2, carImg2); 

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

  document.getElementById('iniciar').addEventListener('click', iniciarSimulacion);
  
  document.getElementById('pantallaCompleta').addEventListener('click', function() {
    toggleFullScreen();
  });

  checkbox3.addEventListener('change', function() {
    if (checkbox3.checked) {
      inputValue.style.display = "inline-block"; 
    } else {
      inputValue.style.display = "none"; 
    }
  });
}

function draw() {
  background(255);

  fill(0);  
  rect(0, 0, 20, height);  
  rect(width - 20, 0, 20, height);  

  stroke(150);  
  strokeWeight(4);  
  line(20, height / 2 + 25, width - 20, height / 2 + 25);  


  fill(0); 
  rect(20, height / 2 + 25, width - 40, height - (height / 2 + 25));  

 
  if (simulationStarted && !simulationStopped) {
    car1.update();
    car2.update();

    
    if (collideWithWalls(car1) || collideWithWalls(car2)) {
      detenerSimulacion();
    }

    if (collides(car1, car2)) {
      let e = 0; 

      if (document.getElementById('checkbox1').checked) {
        e = 1; 
      }

      if (checkbox3.checked) {
        let kValue = parseFloat(inputValue.value);
        if (kValue >= 0.01 && kValue <= 0.99) {
          e = kValue; 
        }
      }

      let v1Final = ((car1.mass - e * car2.mass) / (car1.mass + car2.mass)) * car1.vx + 
                    ((1 + e) * car2.mass / (car1.mass + car2.mass)) * car2.vx;

      let v2Final = ((car2.mass - e * car1.mass) / (car1.mass + car2.mass)) * car2.vx + 
                    ((1 + e) * car1.mass / (car1.mass + car2.mass)) * car1.vx;

      car1.vx = v1Final;
      car2.vx = v2Final;

      velocidadFinalCar1 = v1Final;
      velocidadFinalCar2 = v2Final;

      car1.x = constrain(car1.x, 20, width - car1.width - 20);
      car2.x = constrain(car2.x, 20, width - car2.width - 20);
    }
  }

  car1.display();
  car2.display();

  fill(255); 
  textSize(16);
  textAlign(CENTER);
  
  text(`Velocidad: ${Math.abs(car1.vx * 10).toFixed(2)} m/s`, car1.x + car1.width / 2, car1.y + 30);
  
  text(`Velocidad: ${Math.abs(car2.vx * 10).toFixed(2)} m/s`, car2.x + car2.width / 2, car2.y + 30);
}

function iniciarSimulacion() {
  simulationStarted = true;
  simulationStopped = false;
  car1.x = 62;  
  car2.x = 635;  
  velocidadInicialCar1 = velocidadCar1 / 10;
  velocidadInicialCar2 = -velocidadCar2 / 10;
  car1.vx = velocidadInicialCar1;  
  car2.vx = velocidadInicialCar2;  
  car1.mass = masaCar1; 
  car2.mass = masaCar2;  
}

function detenerSimulacion() {
  simulationStopped = true;  
  car1.vx = 0;  
  car2.vx = 0;  
  
  alert(
    `Auto 1:\n` +
    `Masa: ${car1.mass}\n` +
    `Velocidad Inicial: ${Math.abs(velocidadInicialCar1.toFixed(2))*10} m/s\n` +
    `Velocidad Final: ${velocidadFinalCar1.toFixed(2)*10} m/s\n\n` +
    `Auto 2:\n` +
    `Masa: ${car2.mass}\n` +
    `Velocidad Inicial: ${Math.abs(velocidadInicialCar2.toFixed(2))*10} m/s\n` +
    `Velocidad Final: ${(velocidadFinalCar2.toFixed(2))*10.0} m/s`
  );
}


function collideWithWalls(car) {

  return car.x <= 20 || car.x + car.width >= width - 20;
}


class Car {
  constructor(x, y, vx, mass, img) {
    this.x = x;
    this.y = y;
    this.vx = vx;  
    this.mass = mass;  
    this.width = 100;  
    this.height = 50; 
    this.img = img; 
  }

  update() {
    this.x += this.vx;
  }

  display() {
    image(this.img, this.x, this.y - this.height / 2, this.width, this.height);
  }
}

function collides(car1, car2) {
  return car1.x + car1.width >= car2.x && car1.x <= car2.x + car2.width;
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}