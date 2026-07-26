from flask_cors import CORS
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

def create_database():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        age INTEGER,
        sex INTEGER,
        prediction TEXT,
        confidence REAL,
        date TEXT
    )
    """)

    conn.commit()
    conn.close()


create_database()

model = joblib.load("model/heart_disease_model.pkl")


@app.route("/")
def home():
    return "Heart Disease Prediction API is Running!"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([
        data["age"],
        data["sex"],
        data["cp"],
        data["trestbps"],
        data["chol"],
        data["fbs"],
        data["restecg"],
        data["thalach"],
        data["exang"],
        data["oldpeak"],
        data["slope"],
        data["ca"],
        data["thal"]
    ]).reshape(1, -1)

    prediction = model.predict(features)

    probability = model.predict_proba(features)

    confidence = round(max(probability[0]) * 100, 2)

    if prediction[0] == 1:
        result = "Heart Disease Risk Detected"
    else:
        result = "No Heart Disease Risk Detected"


    confidence = round(max(probability[0]) * 100, 2)


    # Save prediction to database
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO predictions 
    (age, sex, prediction, confidence, date)
    VALUES (?, ?, ?, ?, ?)
    """,
    (
        data["age"],
        data["sex"],
        result,
        confidence,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()


    return jsonify({
        "prediction": result,
        "confidence": confidence
    })

@app.route("/history", methods=["GET"])
def history():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM predictions
    """)

    records = cursor.fetchall()

    conn.close()

    history_data = []

    for row in records:
        history_data.append({
            "id": row[0],
            "age": row[1],
            "sex": row[2],
            "prediction": row[3],
            "confidence": row[4],
            "date": row[5]
        })

    return jsonify(history_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)