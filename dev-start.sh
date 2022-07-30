sudo docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml -f ./docker-compose-host.yml up > rollups_logs.txt

. env/bin/activate
pip install -r requirements.txt
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 main.py

 docker compose -f ./docker-compose-testnet.yml -f ./docker-compose.override.yml -f ./docker-compose-host-testnet.yml up

sudo RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn DAPP_NAME=chessApp MNEMONIC="test test test test test test test test test test test junk" WSS_URL=wss://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn CHAIN_ID=137 docker compose -f ../docker-compose-testnet.yml -f ./docker-compose.override.yml -f ../docker-compose-host-testnet.yml up

sudo RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn DAPP_NAME=chessApp MNEMONIC="test test test test test test test test test test test junk" WSS_URL=wss://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn CHAIN_ID=137 NETWORK=polygon docker compose -f ./docker-compose-testnet.yml -f ./docker-compose.override.yml -f ./docker-compose-host-testnet.yml up


sudo RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn DAPP_NAME=chessApp MNEMONIC="test test test test test test test test test test test junk" WSS_URL=wss://polygon-mumbai.g.alchemy.com/v2/IagdbefgkcKKWI5SzhwyzzMCvlfRjJNn CHAIN_ID=137 NETWORK=polygon docker compose -f ./docker-compose-testnet.yml -f ./docker-compose.override.yml up