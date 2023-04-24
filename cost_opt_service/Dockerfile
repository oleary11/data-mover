FROM python:3.9

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --upgrade pip

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

EXPOSE 8080

EXPOSE 6666

ENTRYPOINT ["python3"]

CMD ["-u","cost_service.py"]