import fs from "fs";


let IDS: string[]; let VECS: Float32Array[]; let D = 384;
let TITLES: string[]; let TEXTS: string[]; let META: any[];


export function loadIndex() {
if (IDS) return;
const ids = JSON.parse(fs.readFileSync("public/index/ids.json", "utf-8"));
const titles = JSON.parse(fs.readFileSync("public/index/titles.json", "utf-8"));
const texts = JSON.parse(fs.readFileSync("public/index/texts.json", "utf-8"));
const meta = JSON.parse(fs.readFileSync("public/index/meta.json", "utf-8"));
const mat: number[][] = JSON.parse(fs.readFileSync("public/index/embeddings.json", "utf-8"));
IDS = ids; TITLES = titles; TEXTS = texts; META = meta;
D = mat[0].length;
VECS = mat.map(row => Float32Array.from(row));
}


export function getIndex() {
loadIndex();
return { IDS, VECS, D, TITLES, TEXTS, META };
}


export function getDocById(id: string) {
loadIndex();
const idx = IDS.indexOf(id);
if (idx < 0) return null;
return { id, title: TITLES[idx], text: TEXTS[idx], meta: META[idx] };
}