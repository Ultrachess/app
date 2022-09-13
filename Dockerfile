# syntax=docker.io/docker/dockerfile:1.4
FROM toolchain-python

WORKDIR /opt/cartesi/dapp
COPY . .

RUN <<EOF
cd server
ls
python3 -m crossenv $(which python3) .env
ls
. .env/bin/activate
pip install -r requirements.txt
EOF