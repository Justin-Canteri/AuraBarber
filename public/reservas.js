const reservedDates = [];
const horariosDisponibles = ['8:00','9:00','10:00','11:00','12:00',]

    function generarCalendario(mes, año) {
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

      const hoy = new Date();
      for (let dia = 1; dia <= ultimoDia; dia++) {
        const fecha = new Date(año, mes, dia);
        const formato = fecha.toISOString().split("T")[0];
        const esHoy = fecha.toDateString() === hoy.toDateString();

        let clase = reservedDates.includes(formato) ? "reserved" : "available";
        if (esHoy) clase += " today";

        html += `<td class="${clase}" data-date="${formato}">${dia}</td>`;
        if ((dia + primerDia) % 7 === 0) html += "</tr><tr>";
      }

      html += "</tr></tbody></table>";
      calendar.innerHTML = html;


      document.querySelectorAll("td[data-date]").forEach(td => {  // Click on date, here need open div with aviable hours
        td.addEventListener("click", () => {
          let hora 
          horariosDisponibles.forEach((element) => hora += `${element}<br>` );
          document.getElementById("Horarios").innerHTML = hora; // aqui debo poner la lista con los horarios disponibles
        });
      });
    }

    const hoy = new Date();
    generarCalendario(hoy.getMonth(), hoy.getFullYear());

