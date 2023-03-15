# syntax=docker.io/docker/dockerfile:1.4
FROM cartesi/toolchain:0.13.0 as go-build

# Install Go build dependencies
RUN <<EOF
apt-get update
DEBIAN_FRONTEND="noninteractive" apt-get install -y \
  gccgo \
  git \
  golang-go \
  make \
  wget
rm -rf /var/lib/apt/lists/*
EOF

# Download Kubo source
ENV KUBO_VERSION=0.18.1
WORKDIR /tmp/build
RUN <<EOF
wget https://github.com/ipfs/kubo/archive/refs/tags/v${KUBO_VERSION}.tar.gz
tar xzf v${KUBO_VERSION}.tar.gz
mv kubo-${KUBO_VERSION} kubo
EOF

# Build Kubo
# tcp package was patched for RISC-V support
ENV TCP_VERSION=f510bf496e14dabbd6a04b61defcf98210ce08a7
WORKDIR /tmp/build/kubo
RUN <<EOF
export GOOS=linux
export GOARCH=riscv64
export CC_FOR_TARGET=riscv64-cartesi-linux-gnu-gcc
export CXX_FOR_TARGET=riscv64-cartesi-linux-gnu-g++
export GOPATH=/tmp/build/go
go mod edit -replace github.com/marten-seemann/tcp=github.com/juztamau5/tcp@${TCP_VERSION}
go mod tidy
make install
EOF

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

# Import Go binaries
COPY --from=go-build /tmp/build/go/bin/linux_riscv64 bin

# Copy files
COPY dapp.json .
COPY entrypoint.sh .
COPY server server
