---
pubDatetime: 2025-07-16
title: "Laravel 12 + Inertia on Railway: Step-by-Step Deployment Guide"
slug: laravel-inertia-railway-guide
featured: true
draft: false
ogImage: ../../../public/laravel-railway.png
tags:
  - laravel
description: Learn how to successfully deploy a Laravel 12 + Inertia.js app to Railway, including PostgreSQL setup, cron jobs, queue workers, and HTTPS. This guide fixes the common issues not covered in the official docs, with working scripts and pro tips.
---

Today I had to deploy a basic Laravel 12 + Inertia app to [Railway](https://railway.app/), but if you follow the official Railway guide to the letter, you’re likely to run into errors (at least, I did). So I’m going to walk you through **how I actually got it working**.

---

## Prerequisites

- A Laravel project hosted on GitHub.

---

## Step-by-Step Deployment

### 1. Create a Railway Project

Click the **New** button and choose **Empty Project**.

---

### 2. Add a PostgreSQL Database

Click **Create**, choose **Database**, and select **PostgreSQL**.

---

### 3. Add the Laravel Service

Click **Create > Empty Service**. Once it’s created:

- Click on the new service to open its settings.
- Rename it to something like **Laravel App** (tip: click the icon to change it too).

---

### 4. Set Environment Variables

Go to the **Variables** tab, then open the **Raw Editor**. Paste the contents of your `.env` file, but before saving, make sure to:

- Generate a new `APP_KEY` with:

  ```bash
  php artisan key:generate --show
  ```

- Set `APP_ENV=production`
- Set `APP_DEBUG=false`
- Update your database connection settings to use the Railway PostgreSQL instance:

  ```dotenv
  DB_CONNECTION=pgsql
  DB_URL=${{Postgres.DATABASE_URL}}
  ```

> ⚠️ **Important:** The `DATABASE_URL` points to the internal private address of your Railway PostgreSQL instance. This is good (no ingress data charges), but it’s **not available during the build phase**. So **don’t** run database migrations during build — you’ll get an error like:

```
SQLSTATE[08006] [7] could not translate host name "postgres.railway.internal" to address
```

---

### 5. Connect Your GitHub Repository

Under **Settings > Source**, connect your GitHub repo.

> 💡 Alternatively, if you're using the [Railway CLI](https://docs.railway.app/develop/cli), you can run:
>
> ```bash
> railway up
> ```

---

### 6. Switch to Railpack

In the **Build** section, change the builder from **Nixpacks** to **Railpack** (beta). This builder uses **FrankenPHP** instead of PHP-FPM and automatically runs:

- `php artisan optimize`
- `php artisan migrate --force`

---

## Add Worker and Cron Services

You’ll need two additional services: one for running **cron jobs** and another for **queue workers**.

### 1. Create Startup Scripts

Add the following to your project root:

```bash file="run-cron.sh"
#!/bin/bash
# Make sure this file is executable: chmod +x run-cron.sh

while [ true ]; do
    echo "Running the scheduler..."
    php artisan schedule:run --verbose --no-interaction &
    sleep 60
done
```

```bash file="run-worker.sh"
#!/bin/bash
# Make sure this file is executable: chmod +x run-worker.sh

php artisan queue:work
```

---

### 2. Create Cron and Worker Services

In Railway:

- Right-click your Laravel service and **Duplicate** it twice.
- Name one **Cron**, and the other **Worker**.

In each duplicated service:

- Go to **Settings > Deploy > Custom Start Command** and add:

**For Cron:**

```bash
chmod +x ./run-cron.sh && sh ./run-cron.sh
```

**For Worker:**

```bash
chmod +x ./run-worker.sh && sh ./run-worker.sh
```

---

### 3. Force HTTPS in Production

In `AppServiceProvider.php`, add:

```php {3-5} file="AppServiceProvider.php"
public function boot(): void
{
    if (app()->environment('production')) {
        URL::forceScheme('https');
    }
}
```

Make sure to import:

```php
use Illuminate\Support\Facades\URL;
```

This avoids issues like:

> **Mixed Content:** The page at ... was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint ...

---

## Final Steps

1. Click **Deploy** on your Laravel service.
2. Once deployed, go to **Settings > Networking**, and generate a **public domain**. Your app will be accessible at port `8080`.
3. Update your service secrets to include the new domain:

```dotenv
APP_URL=https://your-new-url.railway.app
ASSET_URL=https://your-new-url.railway.app
```

---

## You're Done

And that’s it! You’ve successfully deployed your Laravel 12 + Inertia app to Railway with working cron jobs, queue workers, HTTPS support, and a live domain. Here's the template of the setup if you want to copy it:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/aUl2lW?referralCode=oWmpD1)
