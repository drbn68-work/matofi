# Matofi Application

Este repositorio contiene la aplicación Matofi, un sistema listo para producción construido con tecnologías web modernas. Está diseñado para ejecutarse tanto en local como en Kubernetes. La aplicación utiliza volúmenes persistentes para PostgreSQL y para el almacenamiento del archivo Excel que define el catálogo de productos.

---

## Tabla de Contenido

- [Descripción General](#descripción-general)
- [Tecnologías Usadas](#tecnologías-usadas)
- [Configuración de Entorno](#configuración-de-entorno)
  - [Entorno Local](#entorno-local)
  - [Entorno Kubernetes](#entorno-kubernetes)
- [Estructura de Archivos y Directorios Importantes](#estructura-de-archivos-y-directorios-importantes)
- [Comandos de Despliegue y Build](#comandos-de-despliegue-y-build)
- [Particularidades en Kubernetes](#particularidades-en-kubernetes)
- [Notas Adicionales](#notas-adicionales)

---

## Descripción General

Matofi es una aplicación full-stack con las siguientes características:

- **Autenticación LDAP:** Utiliza LDAP para el login de usuarios y determina acceso de administrador según el atributo `employeeNumber`. Los empleados administradores se definen mediante la variable de entorno `ADMIN_EMPLOYEES` (por ejemplo: `"133,6912,625"`).
- **Subida de Archivo Excel:** Permite actualizar el catálogo de productos subiendo un fichero llamado **catalogomatofi.xlsx**. Este fichero debe contener las columnas, en este orden:
  1. `codsap`
  2. `codas400`
  3. `descripcion`
  4. `ubicacion`
  5. `categoria`
- **Listados de Productos, Resumen de Pedidos e Historial:** Ofrece páginas para ver productos y detalles de pedidos.
- **Interfaz Profesional y Responsiva:** Construida con React, shadcn‑ui y Tailwind CSS.
- **JWT (JSON Web Token):**  
  Tras autenticar al usuario vía LDAP, se genera un token JWT firmado con la clave `JWT_SECRET`. Dicho token se almacena en una cookie HTTP-only para mantener la sesión de forma segura. En cada request posterior, el backend valida el token para identificar al usuario sin exponer credenciales.

---

## Tecnologías Usadas

- **Vite** para un desarrollo rápido y bundling.
- **TypeScript** para tipado estático.
- **React** para construir la interfaz de usuario.
- **shadcn‑ui** y **Tailwind CSS** para el estilo.
- **Node.js/Express** para la API de backend.
- **PostgreSQL** como base de datos.
- **LDAP** para autenticación de usuarios.
- **Docker** para contenedorización.
- **Kubernetes** para despliegue en producción (por ejemplo, usando Rancher).

---

## Configuración de Entorno

### Entorno Local

- **Frontend (.env file):**
  - `VITE_API_URL`: Apunta a la URL local del backend, por ejemplo `http://localhost:3000/api`.  
    *(Nota: Al hacer build para Kubernetes, se cambia a la URL pública, p.ej. `https://matofi.fundacio-puigvert.es/api`.)*

- **Backend (.env file):**  
  Contiene variables para:
  - **LDAP:** `LDAP_URL`, `LDAP_URL_FALLBACK`, `LDAP_BASE_DN`, `LDAP_BIND_DN`, `LDAP_BIND_CREDENTIALS`, `SKIP_LDAP_AUTH`
  - **SMTP:** `SMTP_HOST`, `SMTP_PORT`, `EMAIL_DESTINATARIO`
  - **JWT Secret:** `JWT_SECRET` (usado para firmar el token JWT)
  - **Admin Employees:** `ADMIN_EMPLOYEES` (ej.: `"133,6912,625"`)
  - **PostgreSQL:** `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

### Entorno Kubernetes

- **ConfigMap (`matofi-config.yaml`):**  
  Incluye configuración no sensible, por ejemplo:
  - `PORT`
  - `LDAP_URL`, `LDAP_URL_FALLBACK`, `LDAP_BASE_DN`, `LDAP_BIND_DN`, `SKIP_LDAP_AUTH`
  - `SMTP_HOST`, `SMTP_PORT`, `EMAIL_DESTINATARIO`
  - `VITE_API_URL`
  - **EXCEL_PUBLIC_FOLDER:** se configura a `/app/public` para que la app lea el Excel desde `/app/public/catalogomatofi.xlsx`.
  - (Opcional) `ADMIN_EMPLOYEES`

- **Secrets:**
  - `matofi-secrets.yaml`: Contiene credenciales sensibles como `LDAP_BIND_CREDENTIALS` y `JWT_SECRET`.
  - `matofi-postgres-secret.yaml`: Credenciales de PostgreSQL.

- **Recursos de PostgreSQL:**  
  Utiliza una PersistentVolumeClaim para la persistencia de datos en PostgreSQL.

---

## Estructura de Archivos y Directorios Importantes

- **Entorno Local:**  
  El archivo Excel se almacena en `/public/catalogomatofi.xlsx`.

- **Docker/Kubernetes:**  
  - La carpeta de trabajo en el contenedor es `/app`.  
  - El Excel se ubica en `/app/public/catalogomatofi.xlsx`.  
  - El **Dockerfile** para el backend copia el archivo desde `/public/catalogomatofi.xlsx` (en el contexto de build) a `/app/public/catalogomatofi.xlsx` en el contenedor.  
  - El backend (archivo **excelRoutes.js**) usa la variable `EXCEL_PUBLIC_FOLDER` para determinar la ruta. Si no está definida, hace fallback a `../../public`.

- **Volúmenes Persistentes:**  
  El despliegue de backend monta un PVC en `/app/public` para que los ficheros Excel subidos se conserven tras reinicios o re-deploys.

---

## Comandos de Despliegue y Build

Todos los cambios de producción se realizan según las instrucciones del archivo `Comandos.txt`. Un breve resumen:

1. **Build de Imágenes Docker:**  
   Usa los comandos Docker (por ej. `docker build` y `docker push`) para construir y subir las imágenes actualizadas de backend y frontend.

2. **Aplicar Recursos en Kubernetes:**  
   ```bash
   kubectl apply -f matofi-config.yaml
   kubectl apply -f matofi-secrets.yaml
   kubectl apply -f matofi-postgres-secret.yaml
   kubectl apply -f postgres-pvc.yaml
   kubectl apply -f postgres-deployment.yaml
   kubectl apply -f postgres-service.yaml
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f matofi-ingress.yaml

3. Reiniciar Deployments:

```bash
Copy
Edit
kubectl rollout restart deployment/matofi-backend -n matofi
kubectl rollout restart deployment/matofi-frontend -n matofi


4. Verificar Recursos:

```bash
Copy
Edit
kubectl get pods -n matofi
kubectl get services -n matofi
kubectl get ingress -n matofi
kubectl logs -l app=matofi-backend -n matofi --tail=50
kubectl logs -l app=matofi-frontend -n matofi --tail=50
Para la lista completa, consulta Comandos.txt.





Particularidades en Kubernetes
Almacenamiento Persistente:
PostgreSQL y el archivo Excel se guardan en volúmenes persistentes (PVC). El backend monta un PVC en /app/public, evitando la pérdida de datos al reiniciar pods.

Variables de Entorno:

EXCEL_PUBLIC_FOLDER se establece en /app/public dentro de Kubernetes.
Localmente, si no se define esta variable, el código usa la ruta relativa /public.
Sistema de Archivos Efímero:
Sin un volumen persistente, cualquier cambio en el sistema de archivos del contenedor (como subir un Excel nuevo) se perdería al re-deployar. Con un PVC, el archivo se mantiene hasta que se actualice de nuevo.

Notas Adicionales
Configuración del Frontend:
El frontend usa un archivo .env con VITE_API_URL. Debe apuntar al backend local en desarrollo (http://localhost:3000/api) y a la URL pública en producción (https://matofi.fundacio-puigvert.es/api).

LDAP y Acceso de Admin:
El sistema usa LDAP para autenticar. Los usuarios con employeeNumber presente en ADMIN_EMPLOYEES tienen privilegios de administrador.

Requisitos del Archivo Excel:
Debe llamarse catalogomatofi.xlsx y contener, en orden: codsap, codas400, descripcion, ubicacion, categoria.

JWT (JSON Web Token):
Tras autenticar al usuario por LDAP, se genera un JWT firmado con JWT_SECRET. Se almacena en una cookie HTTP-only para mantener la sesión. En cada request posterior, el backend valida el token para identificar al usuario de forma segura.

Flujo de Despliegue:
Cualquier modificación en la aplicación requiere:

Construir nuevas imágenes Docker.
Aplicar los cambios en Kubernetes (ver Comandos.txt).
Reiniciar los deployments si procede.
Verificar logs y estado de los pods.
Local vs. Producción:
El código busca el archivo Excel en /app/public/catalogomatofi.xlsx cuando se ejecuta en Docker/Kubernetes y en ../../public/catalogomatofi.xlsx en local. Esto se controla con la variable de entorno EXCEL_PUBLIC_FOLDER.

Este README pretende ser una guía detallada para mantener y actualizar la aplicación Matofi. Si tienes dudas en el futuro, revisa este documento para consultar la configuración, despliegue y consideraciones específicas de cada entorno.