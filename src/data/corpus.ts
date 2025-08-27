// corpus.ts
export type Doc = {
  id: string;
  lang: "ko" | "en";
  title: string;
  text: string; // we keep the "passage:" / "faq:" / "instruction:" prefixes to bias retrieval
  meta?: {
    kind?: "passage" | "faq" | "style" | "timeline" | "glossary";
    date?: string;       // "YYYY" or "YYYY-MM" if known
    tags?: string[];     // ["project","latest","multimodal",...]
    weight?: number;     // 1~5 (rerank time: score *= 1 + 0.1*(weight-1))
    aliases?: string[];  // synonyms for names/terms
  };
};

// =====================
// BASE: your original corpus (kept)
// =====================
export const corpus: Doc[] = [
  // --- Projects (original) ---
  { id: "ssg-multimodal:ko", lang: "ko", title: "ecommerce 멀티모달 검색", text: "passage: 이미지–텍스트 의미 정렬 기반 가구 검색/추천 시스템. LLM 프롬프트로 50만+ 이미지–텍스트 쌍 생성. FAISS/Milvus 벡터 검색. Gradio 데모. 검색 매출 451% 증가.", meta: { kind: "passage", tags: ["project","multimodal","ecommerce"], weight: 4 } },
  { id: "ssg-multimodal:en", lang: "en", title: "Multi-modal Search for E-commerce", text: "passage: Built image–text semantic alignment for furniture search/reco. Generated 500K+ image–text pairs via LLM prompts. FAISS/Milvus vector search. Gradio demos. +451% search revenue.", meta: { kind: "passage", tags: ["project","multimodal","ecommerce"], weight: 4 } },

  { id: "ssg-lens:ko", lang: "ko", title: "이미지 검색 시스템 SSG Lens", text: "passage: 특징추출/속성/색상 통합 하이브리드 모델(CNN+Transformer). 지식증류/준지도. TensorRT로 3배 추론속도, 임베딩 75% 축소. 대규모 카탈로그 검색.", meta: { kind: "passage", tags: ["project","vision","retrieval"], weight: 3 } },
  { id: "ssg-lens:en", lang: "en", title: "Image Search System 'SSG Lens'", text: "passage: Unified features/attributes/color in one model (CNN+Transformer). Distillation & semi-supervised. TensorRT 3x speedup, 75% smaller embeddings. Scalable catalog search.", meta: { kind: "passage", tags: ["project","vision","retrieval"], weight: 3 } },

  { id: "kvx-palmprint:ko", lang: "ko", title: "손바닥 생체 인증", text: "passage: PyTorch 모델로 손바닥 인증. FastAPI 서빙. MySQL 템플릿 보안 저장/매칭. 고정확도·실시간 추론. 보안 인프라 통합.", meta: { kind: "passage", tags: ["project","biometric"], weight: 2 } },
  { id: "kvx-palmprint:en", lang: "en", title: "Palmprint Biometric Authentication", text: "passage: PyTorch palmprint verification. FastAPI serving. MySQL secure template storage/matching. High precision/recall with realtime inference. Production integration.", meta: { kind: "passage", tags: ["project","biometric"], weight: 2 } },

  { id: "kvx-gesture:ko", lang: "ko", title: "홈 피트니스 제스처 인식", text: "passage: TensorFlow CNN 기반 손동작 인식. TFLite 최적화로 모바일 30fps. 제스처→명령 매핑, 시계열 스무딩. 다양한 환경 견고성 검증.", meta: { kind: "passage", tags: ["project","mobile","vision"], weight: 2 } },
  { id: "kvx-gesture:en", lang: "en", title: "Hands-free Gesture Recognition", text: "passage: TensorFlow CNN gestures. TFLite for 30fps on-device. Gesture-to-command mapping, temporal smoothing. Robust across lighting/distance.", meta: { kind: "passage", tags: ["project","mobile","vision"], weight: 2 } },

  { id: "kvx-gan-weather:ko", lang: "ko", title: "GAN 기반 날씨 시뮬레이션", text: "passage: 실시간 비/조도 변화 생성. 가상 골프 렌더링 파이프라인 통합. 몰입감 향상. 실시간 제너레이티브 효과.", meta: { kind: "passage", tags: ["project","gan","graphics"], weight: 1 } },
  { id: "kvx-gan-weather:en", lang: "en", title: "GAN-based Weather Simulation", text: "passage: Real-time rain/sunlight variations. Integrated with virtual golf rendering. Adaptive AI-generated weather for immersion.", meta: { kind: "passage", tags: ["project","gan","graphics"], weight: 1 } },

  { id: "kvx-sentiment:ko", lang: "ko", title: "리뷰 감성 분류", text: "passage: BERT 기반 감성 분류 파이프라인. 대규모 리뷰 자동 처리. 대시보드로 인사이트 제공. 수작업 분석 자동화.", meta: { kind: "passage", tags: ["project","nlp"], weight: 1 } },
  { id: "kvx-sentiment:en", lang: "en", title: "Review Sentiment Classification", text: "passage: BERT-based sentiment pipeline. Large-scale automated processing. Dashboards for insights. Replaced manual analysis.", meta: { kind: "passage", tags: ["project","nlp"], weight: 1 } },

  { id: "xi-chatbot:ko", lang: "ko", title: "모듈형 챗봇 빌더", text: "passage: Intent/Entity 인식 모듈형 엔진. 로그/분석 설계(MongoDB). 대학·선거 챗봇 배포. 비개발자 설정 지원.", meta: { kind: "passage", tags: ["project","nlp","chatbot"], weight: 2 } },
  { id: "xi-chatbot:en", lang: "en", title: "Modular Chatbot Builder", text: "passage: Modular intent/entity engine. Logging/analytics via MongoDB. Deployed to university/election chatbots. Non-dev configurable.", meta: { kind: "passage", tags: ["project","nlp","chatbot"], weight: 2 } },

  { id: "xi-bankruptcy:ko", lang: "ko", title: "뉴스 기반 부도 예측", text: "passage: 금융 뉴스 신호로 조기경보. 로지스틱/ SVM/ XGBoost 비교. 시각화 리포트 제공. 수출입은행 신용 모니터링 지원.", meta: { kind: "passage", tags: ["project","ml","finance"], weight: 2 } },
  { id: "xi-bankruptcy:en", lang: "en", title: "Bankruptcy Prediction with News", text: "passage: Early-warning from financial news signals. Compared Logistic/SVM/XGBoost. Visualization reports. Supported Eximbank monitoring.", meta: { kind: "passage", tags: ["project","ml","finance"], weight: 2 } },

  // --- Publications (original) ---
  { id: "pub:jaxflax:ko", lang: "ko", title: "출판 – JAX/Flax로 딥러닝 레벨업", text: "passage: 2024년 Jpub 출간. JAX와 Flax를 활용한 고급 딥러닝 모델링과 병렬 가속에 대한 종합 안내서.", meta: { kind: "passage", tags: ["book","jax","flax"], date: "2024", weight: 3 } },
  { id: "pub:jaxflax:en", lang: "en", title: "Publication – Level Up Deep Learning with JAX/Flax", text: "passage: Published in 2024 by Jpub. Comprehensive guide on leveraging JAX and Flax for advanced deep learning modeling and parallel acceleration.", meta: { kind: "passage", tags: ["book","jax","flax"], date: "2024", weight: 3 } },

  // --- Talks (original) ---
  { id: "talk:sora:ko", lang: "ko", title: "강연 – OpenAI Sora", text: "passage: 2024년 LangChainKR Meetup에서 OpenAI Sora와 멀티모달 생성 모델에 대한 발표를 했다.", meta: { kind: "passage", tags: ["talk","multimodal"], date: "2024", weight: 2 } },
  { id: "talk:sora:en", lang: "en", title: "Talk – OpenAI Sora", text: "passage: Spoke at LangChainKR Meetup in 2024 about multimodal generative models and OpenAI's Sora release.", meta: { kind: "passage", tags: ["talk","multimodal"], date: "2024", weight: 2 } },

  { id: "talk:nerf-gdg:ko", lang: "ko", title: "강연 – 3D Reconstruction and NeRF", text: "passage: 2023 GDG DevFest Songdo에서 NeRF 기반 3D 재구성 기법에 대해 발표했다.", meta: { kind: "passage", tags: ["talk","nerf"], date: "2023", weight: 2 } },
  { id: "talk:nerf-gdg:en", lang: "en", title: "Talk – 3D Reconstruction and NeRF", text: "passage: Presented 3D reconstruction and NeRF techniques at GDG DevFest Songdo 2023.", meta: { kind: "passage", tags: ["talk","nerf"], date: "2023", weight: 2 } },

  { id: "talk:keras:ko", lang: "ko", title: "행사 – Keras Community Day 2023", text: "passage: 2023년 Keras Community Day에서 행사 주최 및 발표를 맡아 NeRF와 Keras 3.0 기능을 소개했다.", meta: { kind: "passage", tags: ["talk","keras"], date: "2023", weight: 1 } },
  { id: "talk:keras:en", lang: "en", title: "Event – Keras Community Day 2023", text: "passage: Organized and spoke at Keras Community Day 2023 on NeRF and Keras 3.0 workflows.", meta: { kind: "passage", tags: ["talk","keras"], date: "2023", weight: 1 } },

  { id: "talk:hacktoberfest:ko", lang: "ko", title: "기여 – Hacktoberfest Seoul 2023", text: "passage: JAX/Flax 튜토리얼과 문서를 한국어로 번역하는 오픈소스 기여를 했다.", meta: { kind: "passage", tags: ["contrib","jax","flax"], date: "2023", weight: 1 } },
  { id: "talk:hacktoberfest:en", lang: "en", title: "Contribution – Hacktoberfest Seoul 2023", text: "passage: Contributed Korean translations of JAX/Flax tutorials and documentation.", meta: { kind: "passage", tags: ["contrib","jax","flax"], date: "2023", weight: 1 } },

  { id: "talk:pycon2023:ko", lang: "ko", title: "튜토리얼 – PyCon 2023", text: "passage: '이미지 검색 시스템 개발' 튜토리얼을 진행. SIFT부터 CLIP까지 다뤘다.", meta: { kind: "passage", tags: ["talk","retrieval"], date: "2023", weight: 1 } },
  { id: "talk:pycon2023:en", lang: "en", title: "Tutorial – PyCon 2023", text: "passage: Conducted a tutorial on image retrieval, from SIFT to CLIP, at PyCon 2023.", meta: { kind: "passage", tags: ["talk","retrieval"], date: "2023", weight: 1 } },

  { id: "talk:modulabs:ko", lang: "ko", title: "강연 – Modu Labs JAX/Flax 101", text: "passage: 2023년 Modu Labs에서 JAX/Flax 초급 강의를 진행했다.", meta: { kind: "passage", tags: ["talk","jax","flax"], date: "2023", weight: 1 } },
  { id: "talk:modulabs:en", lang: "en", title: "Talk – Modu Labs JAX/Flax 101", text: "passage: Gave an introductory talk on JAX/Flax at Modu Labs in 2023.", meta: { kind: "passage", tags: ["talk","jax","flax"], date: "2023", weight: 1 } },

  { id: "talk:nerf-youtube:ko", lang: "ko", title: "스터디 – NeRF 논문 리뷰", text: "passage: 2022–2023 유튜브에서 NeRF 논문 리뷰 스터디를 진행했다.", meta: { kind: "passage", tags: ["study","nerf"], date: "2022-2023", weight: 1 } },
  { id: "talk:nerf-youtube:en", lang: "en", title: "Study – NeRF Paper Review (YouTube)", text: "passage: Hosted a YouTube study reviewing NeRF papers from 2022 to 2023.", meta: { kind: "passage", tags: ["study","nerf"], date: "2022-2023", weight: 1 } },

  // --- Personal (original; keep but low-weight so it doesn't pollute general answers) ---
  { id: "personal:movie:ko", lang: "ko", title: "영화 취향", text: "passage: 디즈니와 픽사 애니메이션 영화를 좋아한다. 잔인한 영화는 싫어한다. 스파이더맨 영화를 좋아한다.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:movie:en", lang: "en", title: "Movie Preferences", text: "passage: Likes Disney and Pixar animated movies. Dislikes violent films. Enjoys Spider-Man movies.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:music:ko", lang: "ko", title: "음악 취향", text: "passage: 트와이스, 뉴진스, 에스파의 음악을 좋아한다. 류이치 사카모토의 곡도 자주 듣는다.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:music:en", lang: "en", title: "Music Preferences", text: "passage: Enjoys K-pop groups like Twice, NewJeans, and Aespa. Frequently listens to Ryuichi Sakamoto.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:game:ko", lang: "ko", title: "게임 취향", text: "passage: 마리오 오디세이와 젤다 시리즈를 좋아한다. 마리오에서 가장 좋아하는 캐릭터는 쿠파다.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:game:en", lang: "en", title: "Game Preferences", text: "passage: Likes Mario Odyssey and Zelda series. Favorite Mario character is Bowser.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:food:ko", lang: "ko", title: "음식 취향", text: "passage: 피자와 파스타를 좋아한다. 제일 좋아하는 피자는 페퍼로니 피자다. 과일도 좋아한다.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },
  { id: "personal:food:en", lang: "en", title: "Food Preferences", text: "passage: Enjoys pizza and pasta. Favorite pizza is pepperoni. Also likes fruit.", meta: { kind: "passage", tags: ["personal"], weight: 0.5 } },

  // =====================
  // NEW: Style Guide (forces 3rd person name)
  // =====================
  {
    id: "style:persona:ko",
    lang: "ko",
    title: "응답 스타일 가이드(ko)",
    text: "instruction: 응답은 1인칭이 아니라 3인칭으로 작성한다. 한국어에서는 '정현'이라고 지칭한다. 질문이 모호해도 '정현' 기준으로 요약·설명한다. 불필요한 사적 정보(거주지·소소한 취향)는 질문이 그걸 명시적으로 묻는 경우에만 포함한다.",
    meta: { kind: "style", aliases: ["정현","Junghyun"], weight: 5 }
  },
  {
    id: "style:persona:en",
    lang: "en",
    title: "Response Style (en)",
    text: "instruction: Answer in third-person, referring to the person as 'Junghyun' in English. Prefer concise, factual summaries. Only include personal trivia if explicitly asked.",
    meta: { kind: "style", aliases: ["Junghyun","정현"], weight: 5 }
  },

  // =====================
  // NEW: Timeline (helps with 'recent/most recent')
  // =====================
  {
    id: "timeline:highlights:ko",
    lang: "ko",
    title: "연혁 요약",
    text:
      "timeline: 2024-2025 멀티모달 ecommerce 검색(SSG) 고도화. 2023~2024 SSG Lens 이미지 검색. 2024 JAX/Flax 도서 출간. 2024 LangChainKR Sora 발표. 2023 GDG DevFest/ Keras Community Day/ PyCon 발표.",
    meta: { kind: "timeline", tags: ["recent","latest","career"], weight: 5 }
  },
  {
    id: "timeline:highlights:en",
    lang: "en",
    title: "Timeline Highlights",
    text:
      "timeline: 2024-2025 E-commerce multimodal search (SSG). 2023–2024 SSG Lens image retrieval. 2024 JAX/Flax book. 2024 LangChainKR Sora talk. 2023 GDG DevFest / Keras Community Day / PyCon talks.",
    meta: { kind: "timeline", tags: ["recent","latest","career"], weight: 5 }
  },

  // =====================
  // NEW: FAQs for “가장 최근”, “요약”, “왜/어떻게”, “차이점”, “성과”
  // =====================

  // --- Latest project ---
  {
    id: "faq:latest-project:ko",
    lang: "ko",
    title: "가장 최근 프로젝트는?",
    text:
      "faq:\nQ: 가장 최근에 한 프로젝트는? 최근 프로젝트/요즘 하는 일/last project/latest work/가장 최근 프로젝트는 무엇?\nA: 정현의 가장 최근 프로젝트는 전자상거래 멀티모달 검색(SSG)이다. 이미지–텍스트 의미 정렬과 대규모 생성 데이터(50만+ 쌍), FAISS/Milvus 벡터 검색을 결합해 검색 품질과 비즈니스 지표(검색 매출 +451%)를 개선했다.",
    meta: { kind: "faq", tags: ["latest","project","multimodal"], weight: 5 }
  },
  {
    id: "faq:latest-project:en",
    lang: "en",
    title: "What is the most recent project?",
    text:
      "faq:\nQ: What's your most recent/latest project? what are you working on now?\nA: Junghyun's most recent project is e-commerce multimodal search at SSG, combining image–text semantic alignment, 500K+ generated pairs, and FAISS/Milvus vector search, resulting in +451% search revenue.",
    meta: { kind: "faq", tags: ["latest","project","multimodal"], weight: 5 }
  },

  // --- Multimodal search: quick pitch / deeper explainer / stack ---
  {
    id: "faq:mm-quick:ko",
    lang: "ko",
    title: "멀티모달 검색 한 줄 설명",
    text:
      "faq:\nQ: 멀티모달 검색이 뭐야? 한 줄 요약?\nA: 이미지와 텍스트를 같은 의미 공간으로 매핑해 '그 사진 같은 의자, 바퀴 있는 검은색'처럼 복합 질의에도 맞는 상품을 찾아준다.",
    meta: { kind: "faq", tags: ["multimodal","summary"], weight: 4 }
  },
  {
    id: "faq:mm-explain:ko",
    lang: "ko",
    title: "멀티모달 검색 자세히",
    text:
      "faq:\nQ: 멀티모달 검색 프로젝트를 설명해줘 / 어떻게 만들었어?\nA: 정현은 카테고리별 프롬프트 엔지니어링으로 VLM이 속성(예: 의자 바퀴, 색, 소재)을 정확히 기술하게 하여 50만+ 이미지–텍스트 쌍을 생성했다. 이 임베딩을 FAISS/Milvus로 색인해 이미지/텍스트/복합 질의를 모두 지원한다.",
    meta: { kind: "faq", tags: ["multimodal","how","data"], weight: 4 }
  },
  {
    id: "faq:mm-stack:ko",
    lang: "ko",
    title: "멀티모달 검색 기술 스택",
    text:
      "faq:\nQ: 기술 스택은?\nA: 임베딩/정렬 모델(이미지·텍스트), 대규모 생성 데이터 파이프라인, FAISS/Milvus, Gradio 데모, 운영 모니터링 대시보드를 사용했다.",
    meta: { kind: "faq", tags: ["stack","multimodal"], weight: 3 }
  },
  {
    id: "faq:mm-impact:ko",
    lang: "ko",
    title: "멀티모달 검색 성과",
    text:
      "faq:\nQ: 어떤 효과가 있었어? KPI?\nA: 검색 품질 개선과 함께 검색 매출이 +451% 증가했다(내부 지표 기준).",
    meta: { kind: "faq", tags: ["impact","metrics","multimodal"], weight: 5 }
  },

  // --- 500K pairs / compression / hybrid reason (from your QAs) ---
  {
    id: "faq:data-500k:ko",
    lang: "ko",
    title: "50만+ 데이터 생성 방법",
    text:
      "faq:\nQ: 50만+ 이미지–텍스트 쌍은 어떻게 만들었어?\nA: 전자상거래의 풍부한 상품 이미지를 활용해 카테고리별 프롬프트 엔지니어링으로 VLM 설명을 생성했다. 원하는 속성(색/재질/바퀴 유무 등)이 일관되게 드러나도록 템플릿을 다듬었다.",
    meta: { kind: "faq", tags: ["data","generation","prompting"], weight: 4 }
  },
  {
    id: "faq:embed-75:ko",
    lang: "ko",
    title: "임베딩 75% 축소",
    text:
      "faq:\nQ: 임베딩을 75% 줄였는데 성능은 어떻게 유지했어?\nA: 서로 다른 데이터를 쓰던 모델을 하나로 통합하는 새 아키텍처를 연구해, 패턴을 강화하고 정보 손실을 보완했다.",
    meta: { kind: "faq", tags: ["embedding","compression"], weight: 3 }
  },
  {
    id: "faq:hybrid-why:ko",
    lang: "ko",
    title: "왜 CNN+Transformer?",
    text:
      "faq:\nQ: CNN+Transformer 하이브리드를 쓴 이유?\nA: 딥러닝 기반 리트리벌에서 강한 성능을 보인 사례들이 있었고, 전통적 특징과 문맥 정보를 함께 담기 위해 하이브리드를 선택했다.",
    meta: { kind: "faq", tags: ["architecture","reasoning"], weight: 3 }
  },

  // --- SSG Lens vs Multimodal search (disambiguation) ---
  {
    id: "faq:ssg-lens-vs-mm:ko",
    lang: "ko",
    title: "SSG Lens와 멀티모달 검색 차이",
    text:
      "faq:\nQ: SSG Lens랑 멀티모달 검색은 뭐가 달라?\nA: Lens는 이미지 기반 카탈로그 검색 최적화(속성/색상 통합, TensorRT 3배 가속, 임베딩 75% 축소)에 초점. 멀티모달 검색은 이미지+텍스트를 같은 의미 공간에서 정렬해 복합 질의를 지원한다.",
    meta: { kind: "faq", tags: ["compare","retrieval"], weight: 4 }
  },

  // --- Top projects / quick bio ---
  {
    id: "faq:top3:ko",
    lang: "ko",
    title: "대표 프로젝트 Top 3",
    text:
      "faq:\nQ: 대표 프로젝트 세 가지만 꼽아줘.\nA: (1) 전자상거래 멀티모달 검색(SSG), (2) SSG Lens 이미지 검색, (3) Palmprint 생체 인증.",
    meta: { kind: "faq", tags: ["highlights"], weight: 3 }
  },
  {
    id: "faq:bio-short:ko",
    lang: "ko",
    title: "짧은 소개",
    text:
      "faq:\nQ: 간단 소개/자기소개/프로필 요약?\nA: 정현은 검색·추천과 컴퓨터비전을 다루는 머신러닝 엔지니어로, 멀티모달 검색과 이미지 검색(SSG Lens), 생체 인증 등을 구축했다. JAX/Flax 도서(2024) 저자이며 Keras Korea 운영진으로 활동한다.",
    meta: { kind: "faq", tags: ["bio","summary"], weight: 4 }
  },

  // --- Skills / interests ---
  {
    id: "faq:skills:ko",
    lang: "ko",
    title: "기술 스택·관심사",
    text:
      "faq:\nQ: 기술 스택은? 관심 분야는?\nA: 벡터 검색(FAISS/Milvus), 멀티모달 임베딩/정렬, 컴퓨터비전·리트리벌, 파이프라인/데모(Gradio), 모델 최적화(TensorRT/TFLite). 최근은 멀티모달 생성과 Gaussian Splatting 기반 VFX 파이프라인에 관심이 많다.",
    meta: { kind: "faq", tags: ["skills","interests"], weight: 3 }
  },

  // =====================
  // NEW: Glossary / Synonym helpers (boost recall)
  // =====================
  {
    id: "glossary:mm-syn:ko",
    lang: "ko",
    title: "멀티모달 동의어",
    text:
      "glossary: 멀티모달 검색 ≈ 이미지-텍스트 검색, 크로스모달 리트리벌, cross-modal retrieval, cross-modal search, 이미지+텍스트 결합 검색.",
    meta: { kind: "glossary", tags: ["synonym","multimodal"], weight: 2 }
  },
  {
    id: "glossary:names:both",
    lang: "ko",
    title: "이름/호칭",
    text:
      "glossary: 한국어 호칭은 '정현', 영어 호칭은 'Junghyun'을 사용. 1인칭 금지, 3인칭 유지.",
    meta: { kind: "glossary", aliases: ["정현","Junghyun"], weight: 5 }
  },
];
