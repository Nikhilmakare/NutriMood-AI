"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ResultCard({ results }) {
  if (!results) return null;
  const { top = [], mood = [] } = results;

  const List = ({ title, data, highlight }) => (
    <section className="space-y-2">
      <h4 className="font-semibold">{title}</h4>
      {data.map((item, idx) => (
        <Card key={idx} className="border-muted">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className={highlight ? "text-primary font-medium" : ""}>
                🇮🇳 {item.indian}
              </span>
              <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>
              <strong>Original:</strong> {item.original}
            </p>
            <p>
              <strong>Calories:</strong> {item.calories} kcal
            </p>
            {item.confidence !== undefined && (
              <>
                <p>
                  <strong>Confidence:</strong> {item.confidence.toFixed(1)}%
                </p>
                <Progress value={Math.round(item.confidence)} />
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );

  return (
    <div className="space-y-6">
      <List title="Top‑3 (overall)" data={top} />
      <List title="Best for your mood ✨" data={mood} highlight />
    </div>
  );
}
