// data/projects.ts
export type Project = {
  slug: string;
  company: string;
  period?: string;
  title: string;
  tags?: string[];
  summary: string;
  details?: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
    {
    slug: "multimodal-search",
    company: "SSG.COM",
    // period: "2024–2025",
    title: "Multi-modal Search System for E-commerce",
    tags: ["Multimodal", "PyTorch", "HuggingFace", "VectorDB", "GenAI"],
    summary:
      "Developed a multimodal retrieval service for furniture products, aligning image and text semantics to enhance e-commerce search and recommendation. The system enabled use cases such as retrieving mid-century modern dressers via both product images and descriptive text, resulting in +451% uplift in search-driven revenue.",
    details: [
      "Designed and deployed a **production-scale multimodal retrieval service**: e.g., given an image of a white dresser and a query like *“mid-century modern 2-drawer dresser”*, the system retrieves visually and semantically aligned furniture products.",
      "Engineered **500K+ rich image–text pairs** by leveraging **LLM-based prompt engineering** on Google Vertex AI, producing high-quality multimodal training data across diverse categories — achieving data labeling speed **200× faster than manual annotation**.",
      "Trained and fine-tuned **embedding models** for robust image–text alignment, ensuring accurate retrieval performance across furniture categories.",
      "Built a **real-time vector search infrastructure** with FAISS/Milvus, integrated into large-scale recommendation and search pipelines.",
      "Created **interactive demos with Gradio** to gather stakeholder feedback and iterate quickly.",
      "→ Company blog post: [Using VLM/LLM for Multimodal Data Generation](https://medium.com/ssgtech/vlm-llm%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EB%A9%80%ED%8B%B0%EB%AA%A8%EB%8B%AC-%ED%95%99%EC%8A%B5-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A0%9C%EC%9E%91%ED%95%98%EA%B8%B0-7fe86b78325c)",
      "![Example Retrieval Flow](/projects/multimodal-search.png)",
    ],
  },
  {
    slug: "ssg-lens-visual-search",
    company: "SSG.COM",
    // period: "2021–2025",
    title: 'Image Search System ("SSG Lens")',
    tags: ["TensorFlow", "Vector Compression", "VectorDB", "Latency<100ms"],
    summary:
      "Unified multiple vision tasks (feature extraction, product labeling, color classification) into a single hybrid model for large-scale image search. Enabled instant retrieval from user-uploaded images with 3× inference speedup, 75% smaller embeddings, and robust catalog coverage.",
    details: [
      "Developed a **multi-task supervised learning framework** that performs feature vector extraction, product attribute classification (e.g., sleeve length, style), and color prediction within a single model — replacing separate models for adult fashion, kids fashion, and home goods.",
      "Engineered a **hybrid architecture** combining **CNNs and Transformers** (Hybrid Vision Transformers) for robust visual representations.",
      "Researched and applied **Knowledge Distillation** and **pseudo-labeling** to handle newly added labels and unlabeled image data. Adjusted loss scaling to minimize catastrophic forgetting when new categories were introduced.",
      "Created a **benchmark dataset** for fashion and lifestyle products to validate cross-domain retrieval quality.",
      "Designed a **VLM-based filtering system** to automatically clean and filter new product images when novel labels appeared. Built a lightweight HTML/JavaScript UI so non-ML teammates could easily run filtering tasks.",
      "Optimized inference with **TensorFlow–TensorRT**, later experimenting with **TensorFlow JIT** for simpler deployment.",
      "Achieved **~66% memory efficiency** and **3× inference speedup**, while reducing embedding vector size by **75%**, enabling scalable catalog search.",
      "![Example Retrieval Flow](/projects/image-search.png)",
    ],
  },
  {
    slug: "palmprint-auth",
    company: "KakaoVX",
    // period: "2018–2021",
    title: "Palmprint Biometric Authentication",
    tags: ["PyTorch", "FastAPI", "MySQL", "Biometrics"],
    summary:
      "Developed a palmprint-based biometric authentication system to provide secure and user-friendly identity verification. Achieved real-time inference and robust template matching for production-level deployment.",
    details: [
      "Built **deep learning models in PyTorch** for palmprint feature extraction and verification",
      "Implemented **FastAPI-based serving layer** for seamless integration into authentication pipelines",
      "Designed **secure template storage and matching** protocols using MySQL",
      "Constructed a **testing framework in Jupyter Notebook** for model validation and performance evaluation",
      "Optimized inference for **real-time authentication** while ensuring high precision/recall rates",
      "Delivered a **production-ready system**, successfully integrated with existing security infrastructure",
      "→ Reference: [FastAPI](https://fastapi.tiangolo.com/)",
    ],
  },
  {
    slug: "fitness-gesture-recognition",
    company: "KakaoVX",
    // period: "2018–2021",
    title: "Hands-free Gesture Control for Home Fitness (30fps On-device)",
    tags: ["TensorFlow", "TFLite", "CNN", "Realtime CV", "30fps"],
    summary:
      "Prototyped an on-device gesture control system for home fitness apps where phones are placed far away for full-body capture. Enabled hands-free interaction during workouts, achieving 30fps on embedded/mobile hardware.",
    details: [
      "Developed **CNN-based hand-gesture recognizers** in TensorFlow to map gestures (e.g., swipe, tap/click) to app navigation commands",
      "Optimized on-device inference with **TensorFlow Lite (TFLite)** to sustain **30fps** on resource-constrained devices",
      "Designed **gesture-to-command mappings** (e.g., right-hand swipe → next exercise) for intuitive, eyes-free control",
      "Implemented **temporal smoothing** to filter noise and separate intentional gestures from normal workout motions",
      "Validated robustness across **lighting conditions**, **camera distances**, and **motion variability** typical of home workouts",
      "Built a **working prototype** for internal demos, showing feasibility of hands-free navigation during workouts",
      "→ Personal blog: [논문 리뷰 – Temporal Relational Reasoning in Videos](https://medium.com/@parkjh688/%EB%85%BC%EB%AC%B8-%EB%A6%AC%EB%B7%B0-%EA%B4%80%EC%B0%B0%ED%95%98%EA%B3%A0-%EC%B6%94%EB%A1%A0%ED%95%B4%EC%A3%BC%EB%8A%94-neural-nets-5bcadedf59cb) (Medium)",
      ],
    },
    {
      slug: "gan-weather-simulation",
      company: "KakaoVX",
      // period: "2018–2021",
      title: "GAN-based Weather Simulation for Virtual Environments",
      tags: ["GAN", "Realtime Effects", "Graphics"],
      summary:
        "Prototyped GAN-based weather simulation to enhance immersion in virtual sports environments (e.g., virtual golf). Focused on generating dynamic rain effects and illumination changes in real time.",
      details: [
        "Built **GAN models** in TensorFlow to synthesize realistic rain and sunlight variations for virtual environments",
        "Optimized models for **real-time generation** to maintain interactive frame rates in gameplay",
        "Integrated weather simulation with **rendering pipelines** of virtual golf systems for seamless visual effects",
        "Demonstrated feasibility of using GANs for **adaptive, AI-generated weather** to improve user immersion",
        "Inspired by generative content research in gaming, e.g. [CycleGAN for game domain adaptation](https://medium.com/deepgamingai/turning-fortnite-into-pubg-with-deep-learning-cyclegan-9dd5f9d61169)",
      ],
    },
    {
      slug: "review-sentiment",
      company: "KakaoVX",
      title: "Review Sentiment Classification",
      tags: ["BERT", "TensorFlow", "Pipelines"],
      summary:
        "Developed an NLP system to automatically classify and organize customer reviews, enabling product owners to analyze feedback more efficiently. Automated review grouping provided actionable insights for product and service planning.",
      details: [
        "Fine-tuned **BERT-based sentiment classifiers** in TensorFlow for domain-specific review analysis",
        "Built an **automated pipeline** to process and classify thousands of reviews at scale",
        "Developed **dashboards** to help product owners group and explore categorized customer feedback",
        "Replaced manual review analysis with **automated sentiment grouping**, reducing overhead and improving decision-making speed",
      ],
    },
    {
      slug: "modular-chatbot-platform",
      company: "xinapse",
      // period: "2017–2018",
      title: "Modular Chatbot Builder Platform",
      tags: ["NLP/NLU", "Intent/Entity", "MongoDB"],
      summary:
        "Developed a modular chatbot engine applied to university and election bots, supporting multi-domain setups.",
      details: [
        "Implemented **intent/entity recognition pipeline** with extensible modules",
        "Designed **logging and analytics schema** for chatbot usage",
        "Enabled **non-developer configuration** with modularized system design",
      ],
    },
    {
      slug: "bankruptcy-prediction",
      company: "xinapse",
      // period: "2017–2018",
      title: "Bankruptcy Prediction Using News Analytics",
      tags: ["Logistic Regression", "XGBoost", "SVM", "Ensemble Models", "Visualization"],
      summary:
        "Developed early-warning models for Korea Eximbank to predict corporate bankruptcy risks using financial news analytics. Combined multiple ML approaches with visualization reports to support credit monitoring and audit processes.",
      details: [
        "Collected and processed **financial news articles** to extract company-specific signals relevant to bankruptcy risk",
        "Experimented with multiple ML models — **Logistic Regression, Random Forest, Gradient Boosting, SVM, and XGBoost** — to evaluate predictive performance",
        "Compared models with respect to **precision, recall, and stability** to balance false positives vs. missed bankruptcies",
        "Created **visual reports** including word clouds, keyword trends, and company-level sentiment signals for interpretability",
        "Delivered results as **analyst reports**, providing actionable insights for Korea Eximbank’s credit monitoring and corporate audit processes",
      ],
    }
  ];