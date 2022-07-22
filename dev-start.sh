sudo docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml -f ./docker-compose-host.yml up > rollups_logs.txt

. env/bin/activate
pip install -r requirements.txt
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 main.py > server_logs.txt
