---
title: Asegura un servidor Ubuntu nuevo en 10 minutos
date: 2026-07-27
description: Una lista práctica para proteger un servidor Ubuntu nuevo con llaves SSH, firewall, Fail2Ban, actualizaciones automáticas, monitoreo y swap.
lang: es
translation_key: secure-fresh-ubuntu-server
---

Acabas de aprovisionar un servidor Ubuntu nuevo. Antes de instalar tu aplicación o exponer servicios a internet, dedica unos minutos a asegurarlo.

Los bots empiezan a escanear direcciones IP públicas en busca de puertos abiertos y credenciales débiles casi desde el momento en que un servidor se conecta. Esta guía cubre una base práctica de seguridad para un servidor Ubuntu pequeño.

> [!warning] Mantén abierta tu sesión actual como root
> No cierres tu sesión actual como `root` hasta confirmar que el acceso SSH funciona con el nuevo usuario. De lo contrario, un error en la configuración de SSH podría dejarte fuera del servidor.

## 1. Actualiza el sistema

Empieza actualizando el índice de paquetes, instalando las actualizaciones disponibles y agregando las herramientas que usaremos en esta guía.

```bash
apt update && apt upgrade -y
apt install -y build-essential curl wget git ufw fail2ban
reboot
```

Después del reinicio, vuelve a conectarte como `root` y continúa.

## 2. Crea un usuario que no sea root

Trabajar como `root` aumenta las consecuencias de cada comando. Crea un usuario normal y concédele permiso para ejecutar comandos administrativos mediante `sudo`.

```bash
adduser claw
usermod -aG sudo claw
```

Reemplaza `claw` por el nombre de usuario que quieras usar.

### Copia tu llave SSH

Ejecuta el siguiente comando desde tu **máquina local**, no desde el servidor:

```bash
ssh-copy-id claw@server_ip
```

Reemplaza `server_ip` por la dirección IP del servidor.

Abre una segunda terminal y prueba la nueva cuenta:

```bash
ssh claw@server_ip
```

Una vez conectado, confirma que `sudo` funciona:

```bash
sudo whoami
```

El comando debería mostrar:

```text
root
```

No continúes hasta que el nuevo acceso funcione.

## 3. Desactiva el acceso root y la autenticación por contraseña

Después de confirmar que el nuevo usuario puede conectarse usando una llave SSH, refuerza la configuración de SSH.

```bash
sudo nano /etc/ssh/sshd_config
```

Busca o agrega las siguientes opciones:

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Antes de reiniciar SSH, valida la configuración:

```bash
sudo sshd -t
```

Si el comando no muestra ninguna salida, la configuración es válida. Reinicia SSH:

```bash
sudo systemctl restart ssh
```

Mantén abierta la sesión actual y prueba de nuevo una conexión SSH:

```bash
ssh claw@server_ip
```

A partir de este momento, el acceso directo como `root` y la autenticación SSH mediante contraseña quedan desactivados. El acceso requiere la llave privada correspondiente a la llave pública instalada para tu usuario.

## 4. Configura el firewall

Ubuntu incluye UFW, una interfaz sencilla para administrar reglas de firewall. Permite SSH antes de activarlo para evitar bloquear tu propio acceso.

```bash
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status verbose
```

Si vas a ejecutar un servidor web, permite también HTTP y HTTPS:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Si todavía no vas a servir tráfico web, deja esos puertos cerrados y agrega las reglas cuando las necesites.

## 5. Configura Fail2Ban

Fail2Ban vigila los registros y bloquea temporalmente direcciones IP que fallan repetidamente al autenticarse.

Activa e inicia el servicio:

```bash
sudo systemctl enable --now fail2ban
```

Comprueba su estado:

```bash
sudo systemctl status fail2ban
sudo fail2ban-client status
```

La configuración predeterminada del paquete es un buen punto de partida. Para personalizar los límites sin modificar la configuración incluida por el paquete, crea un archivo local:

```bash
sudo nano /etc/fail2ban/jail.local
```

Una configuración mínima para SSH podría verse así:

```ini
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h
```

Reinicia Fail2Ban después de hacer cambios:

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

## 6. Configura la zona horaria y la sincronización de tiempo

Las marcas de tiempo correctas son importantes para los registros, tareas programadas, certificados e investigaciones de incidentes.

Lista las zonas horarias disponibles:

```bash
timedatectl list-timezones
```

Configura la zona horaria del servidor y activa la sincronización de tiempo por red:

```bash
sudo timedatectl set-timezone America/Bogota
sudo timedatectl set-ntp true
timedatectl status
```

Reemplaza `America/Bogota` por tu zona horaria cuando corresponda.

## 7. Activa las actualizaciones automáticas de seguridad

Instala `unattended-upgrades` para que el servidor pueda aplicar automáticamente parches de seguridad.

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

Puedes verificar la configuración con una ejecución de prueba:

```bash
sudo unattended-upgrade --dry-run --debug
```

Las actualizaciones automáticas reducen la exposición a vulnerabilidades conocidas, pero no reemplazan el monitoreo ni el mantenimiento periódico.

## 8. Instala herramientas básicas de monitoreo

Instala `htop` para monitorear recursos de forma interactiva y `logwatch` para obtener resúmenes de los registros.

```bash
sudo apt install -y htop logwatch
```

Abre el monitor de procesos con:

```bash
htop
```

Consulta los errores de alta prioridad del arranque actual:

```bash
sudo journalctl -p 3 -xb
```

Revisa los servicios de systemd que han fallado:

```bash
systemctl --failed
```

Estas herramientas son útiles para inspecciones manuales. Un servidor de producción debería enviar métricas y alertas a un sistema de monitoreo externo para que los fallos sigan siendo visibles incluso cuando el propio servidor quede inaccesible.

## 9. Agrega swap en servidores con poca memoria

Los servidores pequeños pueden quedarse sin memoria durante la instalación de paquetes, compilaciones, despliegues o picos repentinos de tráfico. Si el servidor tiene menos de 4 GB de RAM y no cuenta con swap, un archivo de intercambio puede reducir la probabilidad de un cierre abrupto por falta de memoria.

Primero, comprueba si ya existe swap:

```bash
sudo swapon --show
free -h
```

Crea un archivo swap de 2 GB:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Haz que permanezca activo después de reiniciar:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verifica la configuración:

```bash
sudo swapon --show
free -h
```

El swap es una medida de respaldo, no un sustituto de contar con suficiente RAM. Si el servidor depende de él con frecuencia, aumenta la memoria del servidor o reduce la carga de trabajo.

## Lista final

El servidor ahora cuenta con una base razonable de seguridad:

- El sistema operativo y los paquetes están actualizados.
- Las tareas administrativas se realizan desde una cuenta que no es `root`.
- SSH acepta llaves en lugar de contraseñas.
- El acceso directo como `root` está desactivado.
- UFW permite únicamente el tráfico entrante necesario.
- Fail2Ban bloquea fallos repetidos de autenticación SSH.
- El reloj, la zona horaria y NTP están configurados.
- Las actualizaciones de seguridad pueden instalarse automáticamente.
- Hay herramientas básicas de monitoreo e inspección de registros.
- Los servidores con poca memoria cuentan con swap persistente cuando es necesario.

Esta es una base, no una configuración completa de seguridad para producción. Antes de desplegar una aplicación, considera también copias de seguridad, monitoreo externo, usuarios de aplicación con privilegios mínimos, gestión de secretos, restricciones de acceso a la base de datos, configuración TLS y un procedimiento de recuperación probado.