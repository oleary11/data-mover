FROM mongo:latest

COPY init_config_db.js /docker-entrypoint-initdb.d/

EXPOSE 27017

CMD ["mongod"]