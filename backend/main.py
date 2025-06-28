from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from PyPDF2 import PdfReader
from collections import Counter
import httpx
import shutil
import json
import re
from dotenv import load_dotenv
from sarvamai import SarvamAI


load_dotenv()

SARVAM_API_URL = os.environ.get("SARVAM_API_URL")
SARVAM_API_KEY = os.environ.get("SARVAM_API_KEY")
MOCK_SARVAM = os.environ.get("MOCK_SARVAM", "false").lower() == "true"

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-document-insight-tool.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "storage/uploaded_pdfs"
INSIGHT_STORE = "storage/insight_store.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)
if not os.path.exists(INSIGHT_STORE):
    with open(INSIGHT_STORE, "w") as f:
        json.dump({}, f)


def extract_text_from_pdf(file_path):
    text = ""
    reader = PdfReader(file_path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()


def basic_fallback_summary(text):
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())  
    freq = Counter(words)
    top_words = [word for word, _ in freq.most_common(50)]
    return top_words


async def get_sarvam_summary(text):
    if MOCK_SARVAM:
        print("[MOCK] Returning fake summary.")
        return f"[Mock Summary] {len(text.split())} words"

    if not SARVAM_API_URL or not SARVAM_API_KEY:
        print("[ERROR] SARVAM_API_URL or API_KEY not set.")
        return None

    try:
        headers = {
            "Authorization": f"Bearer {SARVAM_API_KEY}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                SARVAM_API_URL,
                json={"text": text},
                headers=headers
            )

            print("[DEBUG] Status Code:", response.status_code)
            print("[DEBUG] Response Text:", response.text)

            if response.status_code == 200:
                return response.json().get("summary")

            return None
    except Exception as e:
        print(f"[ERROR] Exception calling Sarvam API: {e}")
        return None


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text_from_pdf(file_path)
    summary = await get_sarvam_summary(text)

    with open(INSIGHT_STORE, "r") as f:
        insights = json.load(f)

    if summary:
        insights[file_id] = {"summary": summary}
    else:
        insights[file_id] = {"topWords": basic_fallback_summary(text)}

    with open(INSIGHT_STORE, "w") as f:
        json.dump(insights, f)

    return {"id": file_id}

@app.get("/insights")
async def get_insight(id: str):
    with open(INSIGHT_STORE, "r") as f:
        insights = json.load(f)
    if id not in insights:
        raise HTTPException(status_code=404, detail="Insight not found")
    return insights[id]


@app.get("/insights/all")
async def get_all_insights():
    with open(INSIGHT_STORE, "r") as f:
        return json.load(f)

@app.delete("/insights/{id}")
async def delete_insight(id: str):
    with open(INSIGHT_STORE, "r") as f:
        insights = json.load(f)

    if id not in insights:
        raise HTTPException(status_code=404, detail="Insight not found")

    del insights[id]

    with open(INSIGHT_STORE, "w") as f:
        json.dump(insights, f)

    return {"message": f"Insight {id} deleted."}
