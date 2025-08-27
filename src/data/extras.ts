// src/data/extras.ts
export type Publication = {
  title: string;
  venue?: string;
  year?: string;
  tags?: string[];
  href?: string;
  note?: string;
};

export type Talk = {
  title: string;
  event: string;
  year?: string; // "2024-01"처럼 써도 OK
  role?: "Speaker" | "Panel" | "Host" | "Workshop" | "Organizer" | "Contributor";
  href?: string;
  tags?: string[];
  note?: string;
};

export const publications: Publication[] = [
  {
    title: "JAX/Flax로 딥러닝 레벨업",
    venue: "Jpub",
    year: "2024",
    href: "https://product.kyobobook.co.kr/detail/S000214172972",
    tags: ["JAX/Flax", "Parallelism", "Deep Learning"],
    note: "Comprehensive guide on leveraging JAX and Flax for advanced DL modeling and parallel acceleration",
  },
];

export const talks: Talk[] = [
  {
    title: "OpenAI Sora",
    event: "LangChainKR Meetup",
    year: "2024-01",
    role: "Speaker",
    href: "https://aifactory.space/task/2719/discussion/839",
    tags: ["Generative Video", "Sora", "Multimodal"],
    note: "Shared insights on multimodal generative models and OpenAI's Sora release.",
  },
  {
    title: "3D Reconstruction and NeRF",
    event: "GDG DevFest Songdo 2023",
    year: "2023-12",
    role: "Speaker",
    tags: ["3D CV", "NeRF"],
    note: "Presented techniques for 3D reconstruction and neural radiance fields (NeRF).",
  },
  {
    title: "3D Reconstruction and NeRF",
    event: "Keras Community Day 2023",
    year: "2023-09",
    role: "Organizer",
    tags: ["Keras", "3D CV", "NeRF"],
    note: "Organized the event and gave a talk on NeRF and 3D computer vision, highlighting Keras 3.0 features and workflows.",
  },
  {
    title: "Translate JAX/Flax tutorials & docs to Korean",
    event: "Hacktoberfest Seoul 2023",
    year: "2023-09",
    role: "Contributor",
    tags: ["JAX/Flax", "Localization", "Open Source"],
    note: "Contributed translations of JAX/Flax tutorials and documentation to Korean.",
  },
  {
    title: "Develop Image Retrieval System",
    event: "PyCon 2023 (Tutorial)",
    year: "2023-06",
    role: "Speaker",
    href: "https://2023.pycon.kr/tutorials",
    tags: ["Image Retrieval", "CLIP"],
    note: "Hands-on tutorial: from classical image retrieval to modern CLIP-powered search.",
  },
  {
    title: "JAX/Flax 101",
    event: "Modu Labs",
    year: "2023-02",
    role: "Speaker",
    tags: ["JAX/Flax"],
    note: "Introduced deep learning with JAX/Flax for beginners, covering key frameworks and use cases.",
  },
  {
    title: "NeRF Paper Review Study (YouTube)",
    event: "Personal",
    year: "2022–2023",
    role: "Host",
    tags: ["NeRF", "Study", "YouTube"],
    href: "https://www.youtube.com/playlist?list=PLUkOTcwoTmkFDWeMO1zYrD3V_YfZzyi9t",
    note: "Hosted an online study reviewing key NeRF papers, published on YouTube.",
  },
];