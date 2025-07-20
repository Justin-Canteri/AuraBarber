//constantes globales (usos generales)
/*--------------------------------------------------------------------------------------*/
const reservedDates = [];
const horariosDisponibles = ['8','9','10','11','12'] // suponemos que estas son las horas disponibles del barber
const hoy = new Date();
let tableName = document.getElementById("name")
let tablePhone = document.getElementById("number")
let tableDay = document.getElementById('day');
let tableHours = document.getElementById('hours');
let tableMonth = document.getElementById('month');

//Meses para crear calendario
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
/*--------------------------------------------------------------------------------------*/


// Funciones auxiliares
/*--------------------------------------------------------------------------------------*/
function activarReserva() {
    document.getElementById('btnReserva').disabled = false;  //se supone que es para que al completar el fomr
  }

// Pone el valor del dia seleccionado en el form para enviar a la db
async function dayOnForm(dia){  //borre el mes, despues tenfo que dvolverlo
  if (tableDay){
    tableDay.value = dia;
  } else{
    alert("no se pudo ");
  }
}

async function monthsOnForm(month){
  if (tableMonth){
    tableMonth.value = month; //acá borre los 2 puntos, es para que la base de datos lo acepte
  } else{
    alert("no se pudo ");
  }
}

// Pone el valor del la hora seleccionado en el form para enviar a la db
async function hoursOnForm(hours){
  if (tableHours){
    tableHours.value = hours; //acá borre los 2 puntos, es para que la base de datos lo acepte
  } else{
    alert("no se pudo ");
  }
}
/*--------------------------------------------------------------------------------------*/

// Calendario con funciones en cada fecha
    function generarCalendario(mes, año) {
      const hoy = new Date();
      const calendar = document.getElementById("calendar");
      calendar.innerHTML = "";

      const date = new Date(año, mes, 1);
      const primerDia = date.getDay();
      const ultimoDia = new Date(año, mes + 1, 0).getDate();

      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

      let html = `<h3>${meses[mes]} ${año}</h3>`;
      html += `<table><thead><tr>
        <th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th>
      </tr></thead><tbody><tr>`;

      for (let i = 0; i < primerDia; i++) {
        html += "<td></td>";
      }

      for (let dia = 1; dia <= ultimoDia; dia++) {
        const fecha = new Date(año, mes, dia);
        const formato = fecha.toISOString().split("T")[0];
        const esHoy = fecha.toDateString() === hoy.toDateString();

        let clase = reservedDates.includes(formato) ? "reserved" : "available";
        if (esHoy) clase += " today";

        if(dia < hoy.getDate() && mes == hoy.getMonth()){ // si el dia del for es menor al dia de hoy, lo deshabilito
          html += `<td style="pointer-events: none; opacity: 0.5;">${dia}</td>`; 
          if ((dia + primerDia) % 7 === 0) html += "</tr><tr>";
        } else{
          html += `<td class="${clase}" data-date="${formato}" onclick='HorasDisp(${dia},${mes}), dayOnForm(${dia}), monthsOnForm(${mes})'>${dia}</td>`; //acá es donde aparece el get para las horas
          if ((dia + primerDia) % 7 === 0) html += "</tr><tr>";
        }
        
      }

      html += "</tr></tbody></table>";
      calendar.innerHTML = html;

      // acá me hago las horas 
      
    }

// Saco lista de horarios disponibles luego de consultar a la db si estan reservados
async function HorasDisp(dia, mes) {
  try {
    const response = await fetch(`/reservas/${dia}/${mes}`);
    if (!response.ok) {
      throw new Error(`Error al obtener los datos (${response.status})`);
    }

    const data = await response.json(); // Ej: [11, 12]
    let hora = '';

    horariosDisponibles.forEach((element) => {
      if (data.includes(Number(element))) {
        hora += `<button disabled>${element}:00</button><br>`;
      } else {
        hora += `<button onclick="hoursOnForm(${element}); activarReserva()">${element}:00</button><br>`;
      }
    });

    document.getElementById("Horarios").innerHTML = hora;

  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

//Funcion para subir la reserva del pop-up la db
async function reserva() {

  //Tomo los valores de los input del form
  const form = document.getElementById('formdb');
  const name = tableName.value.trim();
  const phone = tablePhone.value.trim();
  const day = tableDay.value.trim();
  const month = tableMonth.value.trim();
  const hours = tableHours.value.trim();
  if(form.checkValidity()){
  if (name && phone && day && month && hours) {
    try {
      const respuesta = await fetch("/usuarios/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, phone, day, month, hours })
      });

      if (respuesta.ok) {
        alert("¡Reserva completada con éxito!");
      } else {
        const data = await respuesta.json();
        alert(data.error || "Error al guardar la reserva");
      }
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      alert("Error de conexión con el servidor");
    }
  } else {
    alert("Todos los campos son obligatorios para completar la reserva.");
  }
  } else{
    form.reportValidity();
  }
}
