# NutriMoodAI 🍽️🧠  
**Smart Food Recommender with Calorie Estimation & Mood-Based Suggestions**

NutriMoodAI is an AI-powered web application that recommends food based on the user's current mood and estimates calorie content from uploaded food images. It combines computer vision and NLP to provide health-aware, emotionally aligned food suggestions.

---

## 🌟 Features

- 🔍 **Food Recognition**: Upload a food image to identify the dish using a fine-tuned EfficientNet-B3 model (trained on UECFOOD256).
- 🔢 **Calorie Estimation**: Automatically calculate the calorie count of recognized food using a mapped JSON database.
- 😄 **Mood Detection**: Enter how you're feeling in plain text; our emotion detection model suggests food tailored to your mood.
- 🧠 **Intelligent Suggestions**: Combines your mood and calorie intake to recommend personalized meals.
- 💻 **Single Page App**: Built with Next.js and Flask for a seamless full-stack experience.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (JavaScript)**
- TailwindCSS
- Axios

### Backend
- **Flask (Python)**
- PyTorch (EfficientNet-B3 for food classification)
- Transformers (Emotion detection from text input)

### Dataset
- **UECFOOD256** for food classification
- Custom calorie mapping JSON file (`calorie_map.json`)

---

## 📦 Installation

### 1. Clone the repository
git clone https://github.com/your-username/NutriMoodAI.git
cd NutriMoodAI
2. Backend Setup (Flask + PyTorch)
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
Ensure your trained model best_model.pth and calorie_map.json are placed correctly in the backend directory.

### 3. Frontend Setup (Next.js)
bash
Copy
Edit
cd frontend  # assuming your Next.js app is here
npm install
npm run dev
🚀 Usage
Upload a food image to estimate calories.

Enter your mood (e.g., "I'm feeling sad").

Get a food recommendation that balances your mood and calorie intake.

🧠 Algorithm Overview
Food Classification
Model: EfficientNet-B3

Trained on: UECFOOD256 dataset

Output: Predicted food label → mapped to calorie value via calorie_map.json

Mood Detection
Model: Pre-trained Transformer (e.g., BERT)

Input: User's mood description (text)

Output: Emotion class → mapped to predefined food types (comfort, energetic, light, etc.)

📁 Project Structure
NutriMoodAI/
├── backend/
│   ├── app.py
│   ├── best_model.pth
│   ├── calorie_map.json
│   └── ...
├── frontend/
│   ├── src/
│   └── ...
├── README.md
└── requirements.txt
🧪 Future Improvements
Add voice-based mood detection

Enable region-specific food suggestions

Track daily calorie intake history

Improve UI/UX with animations

🙌 Acknowledgements
UECFOOD256 Dataset

Hugging Face Transformers

PyTorch & FastAI for model training
