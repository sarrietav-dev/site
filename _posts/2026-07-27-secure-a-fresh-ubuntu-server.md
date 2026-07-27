---
title: Secure a Fresh Ubuntu Server in 10 Minutes
date: 2026-07-27
description: A practical checklist for hardening a new Ubuntu server with SSH keys, a firewall, Fail2Ban, automatic updates, monitoring, and swap.
lang: en
translation_key: secure-fresh-ubuntu-server
---

You just provisioned a fresh Ubuntu server. Before installing your application or exposing services to the internet, spend a few minutes securing it.

Bots begin scanning public IP addresses for open ports and weak credentials almost as soon as a server comes online. This guide covers a practical baseline for a small Ubuntu server.

> [!warning] Keep your current root session open
> Do not close your existing root session until you have confirmed that SSH access works for the new user. Otherwise, a mistake in the SSH configuration could lock you out of the server.

## 1. Update the system

Start by updating the package index, installing available upgrades, and adding the tools used throughout this guide.

```bash
apt update && apt upgrade -y
apt install -y build-essential curl wget git ufw fail2ban
reboot
```

After the reboot, reconnect as `root` and continue.

## 2. Create a non-root user

Working as `root` increases the consequences of every command. Create a regular user and grant it permission to run administrative commands through `sudo`.

```bash
adduser claw
usermod -aG sudo claw
```

Replace `claw` with the username you want to use.

### Copy your SSH key

Run the following command from your **local machine**, not from the server:

```bash
ssh-copy-id claw@server_ip
```

Replace `server_ip` with the server's IP address.

Open a second terminal and test the new account:

```bash
ssh claw@server_ip
```

Once connected, confirm that `sudo` works:

```bash
sudo whoami
```

The command should print:

```text
root
```

Do not continue until the new login works.

## 3. Disable root login and password authentication

After confirming that the new user can connect using an SSH key, harden the SSH configuration.

```bash
sudo nano /etc/ssh/sshd_config
```

Find or add the following settings:

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Before restarting SSH, validate the configuration:

```bash
sudo sshd -t
```

If the command produces no output, the configuration is valid. Restart SSH:

```bash
sudo systemctl restart ssh
```

Keep the current session open and test a new SSH connection again:

```bash
ssh claw@server_ip
```

From this point forward, direct root login and password-based SSH authentication are disabled. Access requires the private key associated with the public key installed for your user.

## 4. Set up the firewall

Ubuntu includes UFW, a simple interface for managing firewall rules. Allow SSH before enabling it so you do not lock yourself out.

```bash
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status verbose
```

For a web server, also allow HTTP and HTTPS:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

If you are not serving web traffic yet, leave those ports closed and add the rules when needed.

## 5. Configure Fail2Ban

Fail2Ban watches logs and temporarily bans IP addresses that repeatedly fail authentication.

Enable and start the service:

```bash
sudo systemctl enable --now fail2ban
```

Check its status:

```bash
sudo systemctl status fail2ban
sudo fail2ban-client status
```

The package defaults are a reasonable starting point. To customize thresholds without editing the packaged configuration, create a local file:

```bash
sudo nano /etc/fail2ban/jail.local
```

A minimal SSH jail could look like this:

```ini
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h
```

Restart Fail2Ban after making changes:

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

## 6. Set the timezone and enable time synchronization

Correct timestamps are important for logs, scheduled jobs, certificates, and incident investigation.

List available timezones:

```bash
timedatectl list-timezones
```

Set the server timezone and enable network time synchronization:

```bash
sudo timedatectl set-timezone America/Bogota
sudo timedatectl set-ntp true
timedatectl status
```

Replace `America/Bogota` with your own timezone when appropriate.

## 7. Enable automatic security updates

Install unattended upgrades so the server can apply security patches automatically.

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

You can verify the configuration with a dry run:

```bash
sudo unattended-upgrade --dry-run --debug
```

Automatic upgrades reduce exposure to known vulnerabilities, but they do not replace monitoring or periodic maintenance.

## 8. Install basic monitoring tools

Install `htop` for interactive resource monitoring and `logwatch` for summarized log reports.

```bash
sudo apt install -y htop logwatch
```

Open the process monitor with:

```bash
htop
```

Check high-priority errors from the current boot:

```bash
sudo journalctl -p 3 -xb
```

Inspect failed systemd services:

```bash
systemctl --failed
```

These tools are useful for manual inspection. A production server should eventually report metrics and alerts to an external monitoring system so failures remain visible even when the server itself becomes unavailable.

## 9. Add swap on low-memory servers

Small servers can run out of memory during package installation, builds, deployments, or sudden traffic spikes. If the server has less than 4 GB of RAM and no existing swap, a swap file can reduce the chance of an abrupt out-of-memory crash.

First, check whether swap already exists:

```bash
sudo swapon --show
free -h
```

Create a 2 GB swap file:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Make it persistent across reboots:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verify it:

```bash
sudo swapon --show
free -h
```

Swap is a safety buffer, not a substitute for enough RAM. If the server regularly relies on it, increase the server's memory or reduce the workload.

## Final checklist

The server now has a reasonable security baseline:

- The operating system and packages are updated.
- Administrative work uses a non-root account.
- SSH accepts keys instead of passwords.
- Direct root login is disabled.
- UFW allows only required inbound traffic.
- Fail2Ban blocks repeated SSH authentication failures.
- The clock, timezone, and NTP are configured.
- Security updates can be installed automatically.
- Basic monitoring and log inspection tools are available.
- Low-memory servers have persistent swap when needed.

This is a baseline, not complete production security. Before deploying an application, also consider backups, off-server monitoring, least-privilege application users, secret management, database access restrictions, TLS configuration, and a tested recovery procedure.