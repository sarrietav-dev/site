---
pubDatetime: 2025-07-16
title: "Laravel 12 + Inertia en Railway: Guía de Despliegue Paso a Paso"
slug: laravel-inertia-railway-guia
featured: true
draft: false
ogImage: ../../../public/laravel-railway.png
tags:
  - laravel
description: Aprende cómo desplegar exitosamente una aplicación Laravel 12 + Inertia.js en Railway, incluyendo configuración de PostgreSQL, cron jobs, queue workers y HTTPS. Esta guía corrige los problemas comunes que no cubren los documentos oficiales, con scripts funcionales y consejos profesionales.
lang: es
---

Hoy tuve que desplegar una aplicación básica de Laravel 12 + Inertia en [Railway](https://railway.app/), pero si sigues la guía oficial de Railway al pie de la letra, es probable que te encuentres con errores (al menos, yo lo hice). Así que voy a mostrarte **cómo lo hice funcionar realmente**.

---

## Requisitos Previos

- Un proyecto Laravel alojado en GitHub.

---

## Despliegue Paso a Paso

### 1. Crear un Proyecto en Railway

Haz clic en el botón **New** y elige **Empty Project**.

---

### 2. Agregar una Base de Datos PostgreSQL

Haz clic en **Create**, elige **Database** y selecciona **PostgreSQL**.

---

### 3. Agregar el Servicio de Laravel

Haz clic en **Create > Empty Service**. Una vez que esté creado:

- Haz clic en el nuevo servicio para abrir su configuración.
- Renómbralo a algo como **Laravel App** (consejo: haz clic en el ícono para cambiarlo también).

---

### 4. Configurar las Variables de Entorno

Ve a la pestaña **Variables**, luego abre el **Raw Editor**. Pega el contenido de tu archivo `.env`, pero antes de guardarlo, asegúrate de:

- Generar un nuevo `APP_KEY` con:

  ```bash
  php artisan key:generate --show
  ```

- Establecer `APP_ENV=production`
- Establecer `APP_DEBUG=false`
- Actualizar la configuración de conexión de base de datos para usar la instancia PostgreSQL de Railway:

  ```dotenv
  DB_CONNECTION=pgsql
  DB_URL=${{Postgres.DATABASE_URL}}
  ```

> ⚠️ **Importante:** El `DATABASE_URL` apunta a la dirección privada interna de tu instancia PostgreSQL de Railway. Esto es bueno (sin cargos de datos de ingreso), pero **no está disponible durante la fase de compilación**. Así que **no** ejecutes migraciones de base de datos durante la compilación — obtendrás un error como:

```
SQLSTATE[08006] [7] could not translate host name "postgres.railway.internal" to address
```

---

### 5. Conectar tu Repositorio de GitHub

En **Settings > Source**, conecta tu repositorio de GitHub.

> 💡 Alternativamente, si estás usando el [Railway CLI](https://docs.railway.app/develop/cli), puedes ejecutar:
>
> ```bash
> railway up
> ```

---

### 6. Cambiar a Railpack

En la sección **Build**, cambia el constructor de **Nixpacks** a **Railpack** (beta). Este constructor usa **FrankenPHP** en lugar de PHP-FPM y ejecuta automáticamente:

- `php artisan optimize`
- `php artisan migrate --force`

---

## Agregar Servicios de Worker y Cron

Necesitarás dos servicios adicionales: uno para ejecutar **cron jobs** y otro para **queue workers**.

### 1. Crear Scripts de Inicio

Agrega lo siguiente a la raíz de tu proyecto:

```bash file="run-cron.sh"
#!/bin/bash
# Asegúrate de que este archivo sea ejecutable: chmod +x run-cron.sh

while [ true ]; do
    echo "Running the scheduler..."
    php artisan schedule:run --verbose --no-interaction &
    sleep 60
done
```

```bash file="run-worker.sh"
#!/bin/bash
# Asegúrate de que este archivo sea ejecutable: chmod +x run-worker.sh

php artisan queue:work
```

---

### 2. Crear Servicios de Cron y Worker

En Railway:

- Haz clic derecho en tu servicio de Laravel y **Duplicate** dos veces.
- Nombra uno **Cron** y el otro **Worker**.

En cada servicio duplicado:

- Ve a **Settings > Deploy > Custom Start Command** y agrega:

**Para Cron:**

```bash
chmod +x ./run-cron.sh && sh ./run-cron.sh
```

**Para Worker:**

```bash
chmod +x ./run-worker.sh && sh ./run-worker.sh
```

---

### 3. Forzar HTTPS en Producción

En `AppServiceProvider.php`, agrega:

```php {3-5} file="AppServiceProvider.php"
public function boot(): void
{
    if (app()->environment('production')) {
        URL::forceScheme('https');
    }
}
```

Asegúrate de importar:

```php
use Illuminate\Support\Facades\URL;
```

Esto evita problemas como:

> **Mixed Content:** The page at ... was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint ...

---

## Pasos Finales

1. Haz clic en **Deploy** en tu servicio de Laravel.
2. Una vez desplegado, ve a **Settings > Networking** y genera un **dominio público**. Tu aplicación será accesible en el puerto `8080`.
3. Actualiza los secretos de tu servicio para incluir el nuevo dominio:

```dotenv
APP_URL=https://your-new-url.railway.app
ASSET_URL=https://your-new-url.railway.app
```

---

## ¡Listo!

¡Y eso es todo! Has desplegado exitosamente tu aplicación Laravel 12 + Inertia en Railway con cron jobs funcionales, queue workers, soporte HTTPS y un dominio en vivo. Aquí está la plantilla de la configuración si quieres copiarla:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/aUl2lW?referralCode=oWmpD1)
