
target "dapp" {
  contexts = {
    toolchain-python = "target:toolchain-python"
  }
}

target "server" {
  tags = ["cartesi/dapp:chessApp-devel-server"]
}

target "console" {
  tags = ["cartesi/dapp:chessApp-devel-console"]
}

target "machine" {
  tags = ["cartesi/dapp:chessApp-devel-machine"]
}
