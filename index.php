<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Gestión de Alumnos</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <h2>Agregar alumno</h2>
  <div id="mensaje" 
     style="display:none; 
            padding:10px; 
            color:white; 
            margin-bottom:10px; 
            text-align:center; 
            border-radius:5px;">
</div>

  <section id="formulario">
  <input type="text" id="Matricula" placeholder="Matricula" maxlength="9" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
    <input type="text" id="Nombre" placeholder="Nombre" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
    <input type="text" id="Apaterno" placeholder="Apellido Paterno" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
    <input type="text" id="Amaterno" placeholder="Apellido Materno" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
    <input type="email" id="Email" placeholder="Email">
    <input type="text" id="Celular" placeholder="Celular" maxlength="10" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
  <input type="text" id="CP" placeholder="Código Postal" maxlength="5" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
    <select id="Sexo">
      <option value="">Sexo</option>
      <option value="M">Masculino</option>
      <option value="F">Femenino</option>
    </select>
    <button onclick="guardarAlumno()">Guardar</button>
  </section>

  <h3>Listado de alumnos</h3>
  <section id="tabla">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Matrícula</th>
          <th>Nombre</th>
          <th>Ap. Paterno</th>
          <th>Ap. Materno</th>
          <th>Email</th>
          <th>Celular</th>
          <th>CP</th>
          <th>Sexo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="lista"></tbody>
    </table>
    <div id="paginacion" style="text-align:center; margin-top:10px; display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap;">
      <button id="anterior" onclick="paginaAnterior()">Anterior</button>
      <div id="pageNumbers" style="display:flex; gap:6px; align-items:center;"></div>
      <span id="paginaActual">1</span>
      <button id="siguiente" onclick="paginaSiguiente()">Siguiente</button>
    </div>
  </section>

  <!-- Modal para editar -->
  <div class="modal" id="modalEditar">
    <div class="modal-content">
      <h3>Editar Alumno</h3>
      <input type="hidden" id="editId">
  <input type="text" id="editMatricula" placeholder="Matricula" maxlength="9" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
      <input type="text" id="editNombre" placeholder="Nombre" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
      <input type="text" id="editApaterno" placeholder="Apellido Paterno" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
      <input type="text" id="editAmaterno" placeholder="Apellido Materno" pattern="[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+" onkeypress="return /[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]/.test(event.key)">
      <input type="email" id="editEmail" placeholder="Email">
    <input type="text" id="editCelular" placeholder="Celular" maxlength="10" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
  <input type="text" id="editCP" placeholder="Código Postal" maxlength="5" pattern="[0-9]*" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
      <select id="editSexo">
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
      <button onclick="actualizarAlumno()">Guardar</button>
      <button onclick="cerrarModal()">Cerrar</button>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>



