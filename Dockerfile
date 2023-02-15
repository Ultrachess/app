# syntax=docker.io/docker/dockerfile:1.4
FROM toolchain-python

# Enter directory for building dapp
WORKDIR /opt/cartesi/dapp

# Create crossenv
RUN <<EOF
mkdir -p server
cd server
python3 -m crossenv $(which python3) .venv
EOF

# Update Python dependencies
RUN <<EOF
cd server
. .venv/bin/activate
build-pip install --upgrade pip setuptools
cross-pip install --upgrade pip setuptools
EOF

# Install Python dependencies
COPY server/requirements.txt server
RUN <<EOF
cd server
. .venv/bin/activate
pip install -r requirements.txt
EOF

# Copy files
COPY dapp.json .
COPY entrypoint.sh .
COPY server server
