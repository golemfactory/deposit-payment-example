for i in {1..10}
do
        docker compose pull
        # docker-compose config
        docker compose up -d
        sleep 10
done
