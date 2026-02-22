import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from utils import predictImage, bin_emotion, mood_filter

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

EMOTION_API_URL = os.getenv(
    "EMOTION_API_URL",
    "http://127.0.0.1:5001/api/emotion"
)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    try:

        image = request.files.get("image")
        text  = request.form.get("text", "")
        if image is None or image.filename == "":
            return jsonify({"error": "No image provided"}), 400
        if text.strip() == "":
            return jsonify({"error": "No mood text provided"}), 400

        filename   = secure_filename(image.filename)
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(image_path)

        emo_res = requests.post(
            EMOTION_API_URL,
            json={"text": text},
            timeout=5
        )
        emo_res.raise_for_status()
        emo_json     = emo_res.json()
        emotion_label = emo_json.get("emotion", "neutral")
        confidence    = emo_json.get("confidence", 0.0)

        mood_bin        = bin_emotion(emotion_label, confidence)
        predictions     = predictImage(image_path)
        mood_suggestions = mood_filter(predictions, mood_bin)

        return jsonify({
            "emotion": emotion_label,
            "confidence": round(confidence, 3),
            "mood_bin": mood_bin,
            "top_predictions": predictions,
            "mood_suggestions": mood_suggestions
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Emotion service error: {e}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
