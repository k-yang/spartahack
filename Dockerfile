FROM ubuntu:latest
MAINTAINER Kevin Yang "k46yang@uwaterloo.ca"
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD python app.py