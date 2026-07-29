#!/usr/bin/env python3
"""IP Webcam Lab — educational HTTP Basic Auth + camera UI on port 8080."""

from functools import wraps
from flask import Flask, Response, request, render_template, send_from_directory

app = Flask(__name__)

USERNAME = "admin"
PASSWORD = "dailymycode"
REALM = "IP Webcam"


def check_auth(username: str, password: str) -> bool:
    return username == USERNAME and password == PASSWORD


def authenticate() -> Response:
    return Response(
        "Unauthorized\n",
        401,
        {"WWW-Authenticate": f'Basic realm="{REALM}"'},
    )


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)

    return decorated


@app.route("/")
@requires_auth
def index():
    return render_template("index.html")


@app.route("/favicon.ico")
@requires_auth
def favicon():
    return send_from_directory("static", "favicon.ico")


if __name__ == "__main__":
    print("=" * 50)
    print(" IP Webcam Lab  →  http://0.0.0.0:8080")
    print(" Credentials    →  admin / dailymycode")
    print("=" * 50)
    app.run(host="0.0.0.0", port=8080, debug=False)
