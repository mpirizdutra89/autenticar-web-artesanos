# 🌟 Descripción del Proyecto Artesanos

Artesanos.com es una aplicación web 2.0 orientada a reunir a personas con intereses
comunes en el ámbito del arte y la artesanía. La plataforma está especialmente diseñada para
que artesanos, artistas y cualquier usuario interesado en compartir sus creaciones cuenten con
un espacio exclusivo donde expresarse e interactuar. 


## Funcionalidades Principales

# Gestión de Perfil y Usuario
  - Perfiles Personalizables: Los usuarios registrados pueden crear y modificar sus perfiles en cualquier momento, incluyendo información personal, intereses, antecedentes y una imagen principal.
  - Gestión de Contraseña: Posibilidad de cambiar la contraseña en cualquier momento.

# Creación y Organización de Contenido (Obras y Álbumes)
  - Álbumes Personalizados: Los usuarios pueden crear álbumes con títulos representativos para organizar y mostrar sus creaciones.
  - Gestión de Imágenes: Cada álbum puede contener entre 1 y 20 imágenes. Las imágenes deben asociarse a un álbum específico (excepto la imagen de perfil) y opcionalmente pueden incluir un título o descripción breve (caption).

# Interacción y Compartir Contenido
  - Comentarios en Imágenes: Otros usuarios pueden dejar comentarios en las imágenes.
  - Control de Visibilidad: Los usuarios pueden elegir con qué contactos desean compartir sus imágenes, manteniendo el control sobre la privacidad de su contenido.

# Red de Amistades
  - Búsqueda y Solicitudes de Amistad: Los usuarios pueden buscar a otros miembros y enviar solicitudes de amistad.
  - Aceptación/Rechazo: El destinatario puede aceptar o rechazar las solicitudes.
  - Álbumes de Amistad: Al aceptar una solicitud, el sistema crea automáticamente un nuevo álbum en el perfil del solicitante, titulado con el nombre del usuario que aceptó. Este álbum contendrá las imágenes que el usuario invitado haya decidido compartir.
  - Relación Unidireccional: Solo el contenido del usuario que acepta la solicitud es compartido con el remitente.

# Sistema de Notificaciones en Tiempo Real
  - Implementado con tecnologías en tiempo real (como WebSockets) para avisos instantáneos, incluyendo:

# Notificaciones de Solicitudes de Amistad:
  - Aviso instantáneo en la interfaz (ícono, contador o emergente) al recibir una solicitud.
  - Acceso directo desde la notificación para aceptar o rechazar la invitación.
  - Notificación al remitente sobre la aceptación o rechazo de su solicitud.
# Notificaciones de Nuevos Comentarios:
  - Notificación inmediata al autor de una imagen cuando recibe un comentario, indicando quién, en qué imagen y un extracto del comentario.
  - Acceso desde un panel de notificaciones general con enlace a la imagen comentada.

## 🚀 Tecnologías utilizadas

- [Node.js](https://nodejs.org/) – entorno de ejecución JavaScript (version 20.14.0 local, en produccion  esta la vercion 20)
- [Express](https://expressjs.com/) – framework para servidores web
- [Pug](https://pugjs.org/) – motor de plantillas para HTML
- Mysq2 para base de datos
- Redis y Soket.io para manejo de secione y notificaciones en tiempo real
- **Boostrap 5** – diseño y estilos 

## ✍️ Autor

- Desarrollado por Martin Nicolas Piriz Dutra – [@mpirizdutra89](https://github.com/mpirizdutra89/)
