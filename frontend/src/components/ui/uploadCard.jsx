"use client";

import { useState } from "react";
import imageApi from "@/lib/imageApi";
import { getIndianDish } from "@/lib/indianFoodMap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadCard({ userMood, onResult }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", userMood);

    try {
      const res = await imageApi.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Backend response:", res.data);

      const mapPred = (arr = []) =>
        arr.map((p) => {
          const m = getIndianDish(p.label);
          return {
            original: p.label,
            indian: m?.name ?? p.label,
            calories: m?.calories ?? p.calories,
            confidence: p.confidence,
          };
        });

      const results = {
        top: mapPred(res.data.top_predictions),
        mood: mapPred(res.data.mood_suggestions),
      };

      onResult(results);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-6">
      <CardHeader>
        <CardTitle>Upload Food Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input type="file" onChange={handleImageChange} />
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Predicting…" : "Predict"}
        </Button>
      </CardContent>
    </Card>
  );
}
