FROM mongo:latest

COPY init_schedular_db.js /docker-entrypoint-initdb.d/

EXPOSE 27017

CMD ["mongod"]