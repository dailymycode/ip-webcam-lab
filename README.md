# IP Webcam Lab

Educational lab that mimics an **IP Webcam** web UI protected with **HTTP Basic Auth**. Practice authentication analysis and brute-force techniques safely on your own machine.

> **For educational purposes only.** Do not use these techniques against systems you do not own or lack explicit permission to test. Unauthorized access is illegal.

## Features

- Browser UI styled like a classic IP Webcam control panel
- Live camera feed via `getUserMedia` (falls back to a fake lab feed if camera access is denied)
- HTTP Basic Auth on every request
- Two run modes:
  - **`ipwebcam.py`** — stdlib only (no pip deps; handy on Kali)
  - **`server.py`** — Flask version with templates/static assets

## Default credentials

| Field    | Value         |
|----------|---------------|
| Username | `admin`       |
| Password | `dailymycode` |
| Port     | `8080`        |
| Realm    | `IP Webcam`   |

Change them in `ipwebcam.py` or `server.py` before sharing a public instance.

## Quick start

### Option A — single file (recommended for labs)

```bash
python3 ipwebcam.py
```

Open `http://<your-ip>:8080` and sign in with the credentials above.

### Option B — Flask app

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python3 server.py
```

## Practice ideas

Use this lab only against `localhost` or a VM you control.

Example with Hydra (HTTP Basic Auth):

```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
  127.0.0.1 http-get / -s 8080
```

Tips:

- Start with a small custom wordlist that includes `dailymycode`
- Watch server logs while you attack to confirm requests are hitting auth
- After a successful login, explore the UI controls (zoom, night mode, photo capture)

## Project layout

```
.
├── ipwebcam.py          # Standalone stdlib HTTP server + embedded UI
├── server.py            # Flask app with Basic Auth
├── requirements.txt     # Flask dependency
├── templates/
│   └── index.html       # Webcam UI
└── static/
    ├── app.js
    ├── style.css
    └── favicon.ico
```

## Disclaimer

This repository is an **educational cybersecurity lab**. You are solely responsible for how you use it. The author assumes no liability for misuse or illegal activity.

Want to try it yourself? Clone the repo and run it locally — never point attack tools at production or third-party services.
