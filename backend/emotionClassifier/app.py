from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

emotionClassifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

@app.route("/api/emotion" , methods=["POST"])
def getEmotion():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({error: "Text is empty"}), 400

    results = emotionClassifier(text)[0]
    topEmotion = max(results, key = lambda x: x["score"])
    
    return jsonify({
        "emotion": topEmotion["label"],
        "confidence": round(topEmotion["score"] * 100 ,3)
    })


if __name__ == "__main__":
    app.run(debug=True, port=5001)