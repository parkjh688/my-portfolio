# Run after build_index.ts: python3 scripts/json_to_npy.py
import json, numpy as np
emb = np.array(json.load(open("public/index/embeddings.json")), dtype=np.float32)
np.save("public/index/embeddings.npy", emb)
print("saved:", emb.shape)