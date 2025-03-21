FROM python:3.12-slim

WORKDIR /mediawolf

COPY docker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

WORKDIR /mediawolf/backend

CMD ["python", "main.py"]
