# Bethel Noticias Prompter System

Sistema profesional de teleprompter broadcast desarrollado para operaciones de noticias en vivo de Bethel Noticias.

## Objetivo

Eliminar la necesidad de un operador manual de prompter mediante un sistema automatizado que:

* sincroniza texto desde Google Docs
* actualiza automáticamente el contenido
* mantiene el scroll sin interrupciones
* permite control directo por la conductora mediante puntero USB RF/Bluetooth
* funciona con prompter espejo tradicional vía HDMI

---

# Arquitectura

```text
Google Docs
    ↓
Google Apps Script API
    ↓
Prompter Web (HTML/CSS/JS)
    ↓
HDMI
    ↓
Monitor espejo
    ↓
Conductora controla scroll
```

---

# Características principales

* Actualización automática cada 5 segundos
* Mirror mode
* Fullscreen broadcast
* Scroll suave
* Compatible con punteros USB RF/Bluetooth
* Preserva posición al actualizar
* Compatible con Google Docs
* Hosting gratuito mediante GitHub Pages
* Arquitectura ligera sin frameworks

---

# Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript Vanilla
* Google Apps Script
* Google Docs API
* GitHub Pages

---

# Estructura del proyecto

```text
/prompter
│
├── index.html
├── styles.css
├── app.js
├── config.js
└── README.md
```

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/prompter.git
```

---

## 2. Configurar Google Apps Script

Ir a:

```text
https://script.google.com
```

Crear un nuevo proyecto y pegar el código Apps Script.

Publicar como:

```text
Deploy
→ New deployment
→ Web App
```

Permisos:

```text
Execute as:
Me

Who has access:
Anyone
```

Copiar URL del deployment.

---

## 3. Configurar API_URL

Editar:

```javascript
config.js
```

Reemplazar:

```javascript
API_URL: 'PEGAR_APPS_SCRIPT_AQUI'
```

por la URL real del Apps Script.

---

## 4. Ejecutar localmente

Abrir:

```text
index.html
```

en Chrome o Brave.

---

# Controles

| Acción             | Tecla     |
| ------------------ | --------- |
| Aumentar velocidad | ArrowDown |
| Reducir velocidad  | ArrowUp   |
| Pausa/Reanudar     | Space     |
| Fullscreen         | F         |

---

# Hardware recomendado

## Laptop dedicada

* Windows o macOS
* HDMI

## Navegador

* Chrome
* Brave

## Control remoto

Recomendado:

* Logitech R400
* Logitech R500
* Presentador RF 2.4GHz

## Prompter

Compatible con:

* prompter espejo tradicional HDMI

---

# Flujo operativo

## Redacción

Edita el contenido en Google Docs.

## Sistema

Actualiza automáticamente el prompter.

## Conductora

Controla velocidad y scroll desde el puntero RF.

---

# Roadmap

## Fase 2

* WebSocket realtime
* Panel de administración
* Rundown integrado
* Control desde celular
* Perfiles de conductores
* Auto reconexión
* Timestamps
* Breaking news mode

---

# Objetivo final

Construir un sistema de prompter broadcast estable, moderno y gratuito adaptado al flujo de trabajo de Bethel Noticias.
