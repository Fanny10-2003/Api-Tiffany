// Ruta relativa al API
const apiUrl = 'Api.php';

// Paginación cliente
let alumnosData = [];
let currentPage = 1;
const pageSize = 5; // mostrar 5 registros por página

function renderPage() {
  const tbody = document.getElementById("lista");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (!Array.isArray(alumnosData) || alumnosData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10">No hay alumnos registrados</td></tr>';
    updatePaginationControls();
    return;
  }

  const totalPages = Math.max(1, Math.ceil(alumnosData.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const pageItems = alumnosData.slice(start, start + pageSize);

  pageItems.forEach(alumno => {
    const fila = document.createElement("tr");
    const botonesHTML = `
      <button onclick="editarAlumno(${alumno.id})" class="btn-editar">Editar</button>
      <button onclick="eliminarAlumno(${alumno.id})" class="btn-eliminar">Eliminar</button>
    `;

    fila.innerHTML = `
      <td>${alumno.id}</td>
      <td>${alumno.Matricula}</td>
      <td>${alumno.Nombre}</td>
      <td>${alumno.Apaterno}</td>
      <td>${alumno.Amaterno}</td>
      <td>${alumno.Email}</td>
      <td>${alumno.Celular}</td>
      <td>${alumno.CP}</td>
      <td>${alumno.Sexo}</td>
      <td class="acciones">${botonesHTML}</td>
    `;
    tbody.appendChild(fila);
  });

  // Actualizar controles de paginación
  const paginaActualEl = document.getElementById('paginaActual');
  if (paginaActualEl) paginaActualEl.textContent = `${currentPage} / ${totalPages} (Total: ${alumnosData.length})`;
  updatePaginationControls();
}

function updatePaginationControls() {
  const totalPages = Math.max(1, Math.ceil(alumnosData.length / pageSize));
  const anteriorBtn = document.getElementById('anterior');
  const siguienteBtn = document.getElementById('siguiente');
  if (anteriorBtn) anteriorBtn.disabled = currentPage <= 1;
  if (siguienteBtn) siguienteBtn.disabled = currentPage >= totalPages;
  // Actualizar los botones numerados
  renderPageNumbers();
}

function paginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
}

function paginaSiguiente() {
  const totalPages = Math.max(1, Math.ceil(alumnosData.length / pageSize));
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
}

// Renderiza botones numerados para páginas y los añade a #pageNumbers
function renderPageNumbers() {
  const container = document.getElementById('pageNumbers');
  if (!container) return;

  container.innerHTML = '';
  const totalPages = Math.max(1, Math.ceil(alumnosData.length / pageSize));

  // Limitar número de botones visibles
  const maxButtons = 7;
  let start = 1;
  let end = totalPages;
  if (totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    start = Math.max(1, currentPage - half);
    end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
  }

  // Si hay salto al inicio
  if (start > 1) {
    const first = document.createElement('button');
    first.textContent = '1';
    first.className = 'page-btn';
    first.addEventListener('click', () => { currentPage = 1; renderPage(); });
    container.appendChild(first);
    const dots = document.createElement('span'); dots.textContent = '…'; dots.className = 'page-dots';
    container.appendChild(dots);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'page-btn';
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => { currentPage = i; renderPage(); });
    container.appendChild(btn);
  }

  // Si hay salto al final
  if (end < totalPages) {
    const dots = document.createElement('span'); dots.textContent = '…'; dots.className = 'page-dots';
    container.appendChild(dots);
    const last = document.createElement('button');
    last.textContent = totalPages;
    last.className = 'page-btn';
    last.addEventListener('click', () => { currentPage = totalPages; renderPage(); });
    container.appendChild(last);
  }
}

// Función para mostrar mensajes en consola y UI
function debug(mensaje, tipo = 'info') {
    console.log(mensaje);
    const msgElement = document.getElementById('mensaje');
    if (msgElement) {
        msgElement.textContent = mensaje;
        msgElement.style.display = 'block';
        msgElement.style.background = tipo === 'error' ? '#e74c3c' : '#27ae60';
        setTimeout(() => msgElement.style.display = 'none', 3000);
    }
}

// Función para permitir solo letras (incluyendo acentos y ñ) y espacios
function enforceLetters(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.addEventListener('input', () => {
    // Reemplaza todo lo que no sea letra, incluyendo acentos, ñ y espacios
    const cleaned = el.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/g, '');
    if (el.value !== cleaned) {
      el.value = cleaned;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
    debug('Iniciando aplicación...');
    cargarAlumnos();
    
    // Enforcement: limitar Matricula a 9 caracteres mientras se escribe
    enforceMaxInput('Matricula', 9);
    enforceMaxInput('editMatricula', 9);
    enforceMaxInput('CP', 5);
    enforceMaxInput('editCP', 5);
    enforceMaxInput('Celular', 10);
    enforceMaxInput('editCelular', 10);
    
    // enforce digits-only for CP and Celular fields
    enforceDigits('CP');
    enforceDigits('editCP');
    enforceDigits('Celular');
    enforceDigits('editCelular');
    
    // enforce letters-only for name fields
    enforceLetters('Nombre');
    enforceLetters('Apaterno');
    enforceLetters('Amaterno');
    enforceLetters('editNombre');
    enforceLetters('editApaterno');
    enforceLetters('editAmaterno');
  // update counters on input
  const cpEl = document.getElementById('CP');
  const editCpEl = document.getElementById('editCP');
  // no visual CP counters — only enforce maxlength and digits
});

// Evita que el usuario pueda escribir más de `max` caracteres en tiempo real
function enforceMaxInput(elementId, max) {
  const el = document.getElementById(elementId);
  if (!el) return;
  // For input events (typing, paste, drop)
  el.addEventListener('input', () => {
    if (el.value.length > max) {
      el.value = el.value.slice(0, max);
    }
  });
  // For older browsers, prevent keypress if length reached
  el.addEventListener('keypress', (e) => {
    const allowed = ['Backspace', 'Delete'];
    if (el.value.length >= max && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  });
}

// Evita que se ingresen caracteres no numéricos en un input
function enforceDigits(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.addEventListener('input', () => {
    // Reemplaza todo lo que no sea dígito
    const cleaned = el.value.replace(/\D+/g, '');
    if (el.value !== cleaned) el.value = cleaned;
  });
}


// ================== CARGAR DATOS ==================
function cargarAlumnos() {
  console.log('Intentando cargar alumnos desde:', apiUrl);
  
  fetch(apiUrl)
    .then(async res => {
      console.log('Estado de la respuesta:', res.status);
      const text = await res.text(); // Obtener respuesta como texto
      console.log('Respuesta del servidor:', text);
      
      try {
        return JSON.parse(text); // Intentar parsear como JSON
      } catch (e) {
        console.error('Error al parsear JSON:', e);
        console.log('Contenido recibido:', text);
        throw new Error('La respuesta no es JSON válido');
      }
    })
    .then(data => {
      console.log('Datos procesados:', data);
      if (!Array.isArray(data)) {
        console.warn('Los datos no son un array:', data);
        if (data.error) {
          mostrarMensaje(data.error, "#e74c3c");
        }
        return;
      }

        // Guardar datos y renderizar manteniendo la página actual cuando sea posible
        alumnosData = data;
        const totalPages = Math.max(1, Math.ceil(alumnosData.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;
        renderPage();
    })
    .catch(err => console.error("Error al cargar:", err));
}

// ================== INSERTAR ==================
function guardarAlumno() {
  try {
    console.log('Iniciando guardado de alumno...');
    
    // Lista de campos requeridos
    const campos = ["Matricula", "Nombre", "Apaterno", "Amaterno", "Email", "Celular", "CP", "Sexo"];
    const datos = {};
    
    // Validar y recolectar datos
    for (const campo of campos) {
      const elemento = document.getElementById(campo);
      if (!elemento) {
        throw new Error(`Campo requerido no encontrado: ${campo}`);
      }
      
      const valor = elemento.value.trim();
      if (!valor) {
        mostrarMensaje(`Por favor completa el campo: ${campo}`, "#e74c3c");
        elemento.focus();
        return;
      }
      
      datos[campo] = valor;
    }
    
    console.log('Datos a enviar:', datos);

    // Validar longitud de matrícula
    if (datos.Matricula.length > 9) {
      mostrarMensaje('La matrícula no puede tener más de 9 caracteres', '#e74c3c');
      return;
    }

    // Validar CP: debe ser exactamente 5 caracteres
    if (datos.CP.length !== 5) {
      mostrarMensaje('El Código Postal debe tener exactamente 5 caracteres', '#e74c3c');
      document.getElementById('CP').focus();
      return;
    }

    // Validar Celular: debe ser exactamente 10 caracteres
    if (datos.Celular.length !== 10) {
      mostrarMensaje('El número de teléfono debe tener exactamente 10 dígitos', '#e74c3c');
      document.getElementById('Celular').focus();
      return;
    }

    // Verificar unicidad consultando el API
    fetch(apiUrl)
      .then(res => res.json())
      .then(lista => {
        const existe = lista.some(a => a.Matricula.toLowerCase() === datos.Matricula.toLowerCase());
        if (existe) {
          mostrarMensaje('La matrícula ya existe', '#e74c3c');
          return;
        }

        // Insertar
        fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        })
          .then(res => res.json())
          .then(resp => {
            if (resp && resp.mensaje) mostrarMensaje(resp.mensaje);
            else if (resp && resp.error) mostrarMensaje(resp.error, '#e74c3c');
            cargarAlumnos();
            limpiarCampos();
          })
          .catch(err => {
            console.error('Error al insertar:', err);
            mostrarMensaje('Error al insertar: ' + err.message, '#e74c3c');
          });
      })
      .catch(err => {
        console.error('Error al verificar unicidad:', err);
        mostrarMensaje('Error al verificar matrícula', '#e74c3c');
      });

  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    mostrarMensaje(error.message, "#e74c3c");
  }
  
}

// ================== EDITAR ==================
function editarAlumno(id) {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const alumno = data.find(a => parseInt(a.id) === parseInt(id));
      if (alumno) {
        document.getElementById("editId").value = alumno.id;
        document.getElementById("editMatricula").value = alumno.Matricula;
        document.getElementById("editNombre").value = alumno.Nombre;
        document.getElementById("editApaterno").value = alumno.Apaterno;
        document.getElementById("editAmaterno").value = alumno.Amaterno;
        document.getElementById("editEmail").value = alumno.Email;
        document.getElementById("editCelular").value = alumno.Celular;
  document.getElementById("editCP").value = alumno.CP;
        document.getElementById("editSexo").value = alumno.Sexo;
        document.getElementById("modalEditar").style.display = "flex";
      }
    })
    .catch(err => console.error("Error al obtener alumno para editar:", err));
}

function cerrarModal() {
  document.getElementById("modalEditar").style.display = "none";
}

// ================== ACTUALIZAR ==================
function actualizarAlumno() {
  const datos = {
    id: document.getElementById("editId").value,
    Matricula: document.getElementById("editMatricula").value.trim(),
    Nombre: document.getElementById("editNombre").value.trim(),
    Apaterno: document.getElementById("editApaterno").value.trim(),
    Amaterno: document.getElementById("editAmaterno").value.trim(),
    Email: document.getElementById("editEmail").value.trim(),
    Celular: document.getElementById("editCelular").value.trim(),
    CP: document.getElementById("editCP").value.trim(),
    Sexo: document.getElementById("editSexo").value
  };

  // Validar longitud de matrícula
  if (datos.Matricula.length > 9) {
    mostrarMensaje('La matrícula no puede tener más de 9 caracteres', '#e74c3c');
    return;
  }

  // Validar CP en actualización: debe ser exactamente 5 caracteres
  if (datos.CP && datos.CP.length !== 5) {
    mostrarMensaje('El Código Postal debe tener exactamente 5 caracteres', '#e74c3c');
    document.getElementById('editCP').focus();
    return;
  }

  // Verificar unicidad (excluir el propio registro)
  fetch(apiUrl)
    .then(res => res.json())
    .then(lista => {
      const dup = lista.find(a => a.Matricula.toLowerCase() === datos.Matricula.toLowerCase() && parseInt(a.id) !== parseInt(datos.id));
      if (dup) {
        mostrarMensaje('La matrícula ya está en uso por otro alumno', '#e74c3c');
        return;
      }

      fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      })
        .then(res => res.json())
        .then(resp => {
          if (resp && resp.mensaje) mostrarMensaje(resp.mensaje);
          else if (resp && resp.error) mostrarMensaje(resp.error, '#e74c3c');
          cerrarModal();
          cargarAlumnos();
        })
        .catch(err => {
          console.error('Error al actualizar:', err);
          mostrarMensaje('Error al actualizar: ' + err.message, '#e74c3c');
        });
    })
    .catch(err => {
      console.error('Error al verificar unicidad antes de actualizar:', err);
      mostrarMensaje('Error al verificar matrícula', '#e74c3c');
    });
}

// ================== ELIMINAR ==================
function eliminarAlumno(id) {
  if (confirm("¿Seguro que deseas eliminar este registro?")) {
    fetch(`${apiUrl}?id=${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(resp => {
        if (resp && resp.mensaje) mostrarMensaje(resp.mensaje, "#e74c3c");
        cargarAlumnos();
      })
      .catch(err => console.error("Error al eliminar:", err));
  }
}

// ================== LIMPIAR ==================
function limpiarCampos() {
  document.querySelectorAll("#formulario input, #formulario select").forEach(i => i.value = "");
}

// ================== MENSAJE ==================
function mostrarMensaje(texto, color = "#27ae60") {
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.background = color;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 2500);
}



