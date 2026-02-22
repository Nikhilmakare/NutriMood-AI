import torch
import json
from torchvision import transforms
from PIL import Image
from torchvision.models import efficientnet_b3, EfficientNet_B3_Weights

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

with open("model/calorie_map.json", "r") as f:
    calorie_map = json.load(f)

with open("model/food_emotion_map.json", "r") as f:
    food_emotion_map = json.load(f)

emotion_bins = {
    "happy": "joy", "excited": "joy", "surprised": "joy",
    "neutral": "neutral", "calm": "neutral",
    "sad": "sad", "angry": "sad", "stressed": "sad", "fear": "sad"
}

weights = EfficientNet_B3_Weights.DEFAULT
model = efficientnet_b3(weights=None)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 256)
model.load_state_dict(torch.load("model/best_model.pth", map_location = device))
model = model.to(device)
model.eval()


transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],[0.229, 0.224, 0.225])
])

def predictImage(img_path):
    image = Image.open(img_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        probs = torch.nn.functional.softmax(outputs, dim = 1)
        top3_probs, top3_idxs = torch.topk(probs, 3)

    results = []
    for prob, idx in zip(top3_probs[0], top3_idxs[0]):
        class_id = str(idx.item() + 1)
        label = calorie_map.get(class_id, {}).get("name", "Unknown")
        calories = calorie_map.get(class_id, {}).get("calories", "N/A")
        results.append({
            "class_id": class_id,
            "label": label,
            "confidence": round(prob.item() * 100, 2),
            "calories": calories
        })

    return results

def bin_emotion(emotion_label, confidence, threshold=0.35):
    """
    Converts model's raw emotion label to joy/neutral/sad based on confidence.
    """
    if confidence < threshold:
        return "neutral"
    return emotion_bins.get(emotion_label, "neutral")

def mood_filter(predictions, mood_bin, topk=3):
    """
    Filters predictions based on mood bin. Fallbacks to original ranking if not enough matches.
    predictions: list of dicts from predictImage
    Returns topk mood-matched items.
    """
    matched = [p for p in predictions if food_emotion_map.get(p["label"]) == mood_bin]
    if len(matched) >= topk:
        return matched[:topk]

    others = [p for p in predictions if p not in matched]
    return (matched + others)[:topk]
