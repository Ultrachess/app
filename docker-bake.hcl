
group "default" {
  targets = ["dapp", "server", "console"]
}

# crossenv toolchain for python dapps
target "toolchain-python" {
  context = "./std-rootfs"
  target  = "toolchain-python"
  tags    = ["cartesi/toolchain-python"]
}

target "fs" {
  context = "./std-rootfs"
  target  = "fs-stage"
  contexts = {
    dapp = "target:dapp"
  }
}

target "server" {
  context = "./std-rootfs"
  target  = "server-stage"
  contexts = {
    dapp = "target:dapp"
  }
}

target "console" {
  context = "./std-rootfs"
  target  = "console-stage"
  contexts = {
    dapp = "target:dapp"
  }
}

target "machine" {
  context = "./std-rootfs"
  target  = "machine-stage"
  contexts = {
    dapp = "target:dapp"
  }
}


