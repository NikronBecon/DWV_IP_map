FROM python:3.12-slim

WORKDIR /app
COPY sender.py ip_addresses.csv requirements.txt ./
RUN pip install -r requirements.txt

CMD ["python", "sender.py"]
