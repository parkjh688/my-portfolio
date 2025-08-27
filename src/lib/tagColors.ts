// src/lib/tagColors.ts
export const TAG_COLORS: Record<string, string> = {
  // 🟦 Framework / Model
  "JAX/Flax": "bg-blue-100 text-blue-700", 
  "Deep Learning": "bg-blue-100 text-blue-700",
  "Parallelism": "bg-indigo-100 text-indigo-700",
  PyTorch: "bg-blue-100 text-blue-700",
  TensorFlow: "bg-blue-100 text-blue-700",
  TensorRT: "bg-blue-100 text-blue-700",
  TFLite: "bg-blue-100 text-blue-700",
  CLIP: "bg-blue-100 text-blue-700",
  "Scikit-learn": "bg-blue-100 text-blue-700",
  BERT: "bg-blue-100 text-blue-700",
  NLTK: "bg-blue-100 text-blue-700",
  HuggingFace: "bg-blue-100 text-blue-700",
  VectorDB: "bg-blue-100 text-blue-700",
  "XGBoost": "bg-blue-100 text-blue-700",
  "SVM": "bg-blue-100 text-blue-700",
  "Logistic Regression": "bg-blue-100 text-blue-700",
  "Ensemble Models": "bg-blue-100 text-blue-700",

  // 🟩 Vision / Multimodal / Retrieval
  CNN: "bg-green-100 text-green-700",
  NeRF: "bg-green-100 text-green-700",
  "Image Retrieval": "bg-green-100 text-green-700",
  "Realtime CV": "bg-green-100 text-green-700",
  "Vector Compression": "bg-green-100 text-green-700",
  Vision: "bg-green-100 text-green-700",
  Multimodal: "bg-green-100 text-green-700",
  GenAI: "bg-green-100 text-green-700",
  "Latency<100ms": "bg-green-100 text-green-700",

  // 🩷 Generative / 3D
  "Generative Video": "bg-pink-100 text-pink-700",
  Sora: "bg-pink-100 text-pink-700",
  "3D CV": "bg-pink-100 text-pink-700",
  GAN: "bg-pink-100 text-pink-700",
  Graphics: "bg-pink-100 text-pink-700",
  "Realtime Effects": "bg-pink-100 text-pink-700",

  // 🟪 Community / Events
  PyCon: "bg-purple-100 text-purple-700",
  Meetup: "bg-purple-100 text-purple-700",
  YouTube: "bg-purple-100 text-purple-700",
  Hacktoberfest: "bg-purple-100 text-purple-700",
  Keras: "bg-purple-100 text-purple-700",

  // 🟨 OSS / i18n
  "Open Source": "bg-yellow-100 text-yellow-700",
  Localization: "bg-yellow-100 text-yellow-700",

  // 🟧 Backend / API / DB
  FastAPI: "bg-amber-100 text-amber-700",
  MySQL: "bg-amber-100 text-amber-700",
  MongoDB: "bg-amber-100 text-amber-700",
  Pipelines: "bg-amber-100 text-amber-700",

  // 🩶 NLP/NLU 등 기타
  "NLP/NLU": "bg-gray-100 text-gray-700",
  "Intent/Entity": "bg-gray-100 text-gray-700",
  Biometrics: "bg-gray-100 text-gray-700",
  "Risk Scoring": "bg-gray-100 text-gray-700",
  Study: "bg-gray-100 text-gray-700",
  Visualization: "bg-indigo-100 text-indigo-700",

  // 숫자/속성 태그 (옅게 표시)
  "30fps": "bg-slate-100 text-slate-700",
  Gradio: "bg-slate-100 text-slate-700",
};

export const colorForTag = (t: string) =>
  TAG_COLORS[t] ?? "bg-gray-100 text-gray-700";