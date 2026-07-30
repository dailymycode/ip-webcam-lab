# IP Webcam Lab

Educational fake **IP Webcam** with HTTP Basic Auth. Practice Nmap + Hydra on your own machine only.

> Educational use only. Do not attack systems you do not own.

**Default login:** `admin` / `dailymycode` · **Port:** `8080`

---

## 1. Find your IP

```bash
ifconfig
```

Look for your LAN address under `wlan0` / `eth0` (often `192.168.x.x`). That is the target IP for Nmap and Hydra.

On some systems: `ip a`

---

## 2. Start the lab

```bash
python3 ipwebcam.py
```

No dependencies. Listens on `0.0.0.0:8080`.

*(Optional Flask: `pip install -r requirements.txt && python3 server.py`)*

---

## 3. Change the password (optional)

Defaults live near the top of `ipwebcam.py` (same in `server.py`):

```python
USERNAME = "admin"
PASSWORD = "dailymycode"
```

Change `PASSWORD` (and username if you want), save, restart the lab. Put the **same** new password into your wordlist in step 5 — otherwise Hydra will not find it.

---

## 4. Scan with Nmap

**Nmap** finds open ports/services.

```bash
nmap -sV -p 8080 <your-ip>
```

Example: `nmap -sV -p 8080 192.168.1.20`

`-sV` = service/version · `-p 8080` = that port only → expect `8080/tcp open`

Open `http://<your-ip>:8080` — browser should ask for login (Basic Auth).

---

## 5. Wordlist + Hydra

**Hydra** tries passwords from a list against the login.

A starter wordlist is already implied for this lab — include the lab password (default `dailymycode`, or whatever you set in step 3):

```bash
printf 'admin\npassword\n123456\ndailymycode\n' > passwords.txt
```

If you changed the password in the code, replace `dailymycode` with your new one.

```bash
hydra -l admin -P passwords.txt <your-ip> http-get / -s 8080 -t 4
```

| Part | Meaning |
|------|---------|
| `-l admin` | username |
| `-P passwords.txt` | password list |
| `http-get /` | Basic Auth on `/` |
| `-s 8080` | port |
| `-t 4` | parallel tries |

Hydra should print the matching `login` / `password`. Use them in the browser.

---

## Layout

```
ipwebcam.py      # standalone server (use this)
server.py        # Flask alternative
templates/       # UI (Flask)
static/          # CSS/JS (Flask)
```
