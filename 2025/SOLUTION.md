
# Part 2: Form Challenge.

1. Estructura de componentes

<address-form>: Es el componente principal que une todos los campos y maneja la lógica global del formulario.
<country-selector>: Permitira al usuario seleccionar un país de una lista desplegable.
<postal-code>: Es el campo para ingresar el código postal, podra ajustar sus reglas de validación según el país seleccionado.
<city-field>: Mostrara la ciudad ingresada por el usuario, sin embargo, puede autocompletarse basado en el código postal. (relacionado con postal-code)
<address-fields>: Incluye campos adicionales como calle, número, av, etc que pueden variar según el país.
<validation-message>: Muestra mensajes de validación o errores segun sea el caso.
<loading-spinner>: Indicara operaciones en curso, como la carga de datos.


Responsabilidades de Cada Componente:
<address-form>: Siendo el principal coordinara todos los componentes, manejando el estado global y cada interaccion.
<country-selector>: Emitira un evento cuando el país seleccionado cambie.
<postal-code-field>: Validara el código postal y, si es posible, buscara la ciudad correspondiente.
<city-field>: Se actualizara automáticamente con la ciudad si se proporciona mediante autocompletado.
<address-fields>: Se modificara para mostrar campos relevantes basados en el país.
<validation-message>: Escuchara errores de validacion y los muestrara al usuario.
<loading-spinner>: Se activara durante las operaciones de carga.

Organización de los Componentes:
Cada componente estaría encapsulado dentro de <address-form>, ya que es el comp principal y coordinador de cada uno de los campos requeridos para la funcionalidad del mismo, asegurando que todos los comp interacteen de manera coherente.


2. Comunicacion entre Componentes

Los componentes compartirían información a través de eventos personalizados. Ej, <country-selector> emitiría un evento country-change que <address-form> escucharía y reaccionaría actualizando otros componentes/campos.

Cambio de País:
Cuando un usuario cambia el país en <country-selector>, este componente emite el evento country-change y <address-form> recibe este evento para act el edo global, lo que a su vez puede ajustar las reglas de validación en <postal-code> y otros campos relevantes.

Componente del código Postal y cambio de país:
<postal-code> entiende que el país ha cambiado porque <address-form> le pasaría la nueva información de configuración necesaria para ajustar sus reglas de validación.

Autocompletado del Campo de Ciudad:
<city-field> se autocompletaría escuchando un evento, ej city-data, emitido por <postal-code> después de una búsqueda exitosa de datos de ciudad basada en el código postal ingresado.

3. Resolución de Problemas

Usuarios podrian ingresar datos incorrectos.
Conexiones a Internet lentas pueden retrasar las cargas de los datos.
Cambios rápidos en los valores pueden llevar a estados inconsistentes.


Manejo de Conexiones Lentas:
Aqui entra en juego el componente <loading-spinner> durante las operaciones de carga para informar a los usuarios que el proceso está en curso.
Aca se pueden implementar timeouts y reintentos para las solicitudes de datos.

Cambios Rápidos de Valores:
Se imprementaria un debouncing en los campos de entrada para limitar la tasa a la que se procesan los eventos de entrada, evitando así la sobrecarga de solicitudes y actualizaciones. Controlando asi la frecuencia con la que se ejecuta alguna función.

Gestión de Errores de Validación:
<validation-message> mostraría mensajes claros y específicos sobre qué necesita ser corregido.
Proporcionaria un feedback inmediato después de cada entrada para minimizar los errores.

Esta estructura y estrategia de comunicación aseguran que el formulario sea reactivo, eficiente y amigable para el usuario, adaptándose dinámicamente a las necesidades específicas del país y manejando de manera efectiva las interacciones y validaciones.

