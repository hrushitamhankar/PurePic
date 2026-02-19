📸 PurePic — Ultimate Buddy of Photographers

PurePic is an AI-assisted offline photo analysis and sorting system designed for photographers who shoot thousands of images and need fast, intelligent culling.

Instead of simple sharpness checks, PurePic evaluates photos like a human editor — considering aesthetics, subject presence, intent, focus, and photographic moment.

🚨 Problem

Photographers waste hours manually sorting photos because:

Thousands of images look similar

Technical metrics alone are misleading

Good artistic shots get deleted

Soft portraits or cinematic images are wrongly rejected

No tool explains why a photo works or fails

✅ Solution

PurePic performs human-style photo evaluation locally and automatically sorts images into meaningful categories.

It analyzes:

Technical quality (sharpness, exposure, noise)

Aesthetic composition (deep learning model)

Subject importance

Moment detection (action / emotion)

Eye focus detection

Photographer intent (portrait, wildlife, candid, artistic)

Confidence scoring (editor reliability layer)

All processing runs offline — no cloud upload required.

🧠 Human-Like Scoring System

PurePic does NOT compare photos inside a folder.

Each image is judged independently using an editor-style scoring pipeline:

Final Score =
Technical Quality
+ Aesthetic Quality
+ Subject Intelligence
+ Moment Strength
+ Eye Focus
+ Photographer Intent Bonus
+ Confidence Calibration


This prevents problems like:

✅ All-good folders being downgraded
✅ All-bad folders producing false “best” images
✅ Genre bias (wildlife vs wedding vs portraits)

📂 Output Categories

After analysis, images are automatically sorted:

Folder	Meaning
artistic_keep	Strong editorial / portfolio shots
good	Deliverable photos
ok	Backup / secondary selections
reject	Technically or visually weak images
⚡ Key Features
🎯 Genre-Agnostic

Works for:

Wildlife photography

Wedding photography

Portraits

Events

Street & candid

Travel photography

🧩 RAW Support (Smart)

RAW files are processed using:

✅ Embedded JPEG preview extraction
→ Full quality perception
→ 10× faster than RAW decoding

Supports:

.CR2  .NEF  .ARW  .DNG
JPG / PNG

🚀 Parallel Processing

Multi-core batch analysis dramatically reduces sorting time.

Large folders (100–500 photos) process significantly faster.

🧠 Editor Simulation Engine

PurePic mimics real photographer behavior:

Forgives technical flaws when emotion is strong

Accepts cinematic low-light images

Prioritizes subject and storytelling

Rewards intentional composition

🛠 Installation
git clone https://github.com/FOOX-BAT/PurePic.git
cd PurePic

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

▶️ Usage

Run:

python PurePic/purepic_batch.py


You will be prompted:

Enter folder path to scan:
Enter OUTPUT folder path:


PurePic will:

✅ Analyze images
✅ Score intelligently
✅ Sort automatically
✅ Generate CSV report

📊 Debug Output (Optional)

Terminal displays editor reasoning:

technical: 47.54
aesthetic: 55.41
subject: 22.3
moment: 18.2
eye_focus: 63.5
intent_bonus: 10
confidence: 82
final_score: 61.2
label: artistic_keep


This helps photographers understand why an image was selected.

🔒 Privacy First

100% Offline

No uploads

No cloud processing

Local AI inference only

🧱 Project Status

✅ Core engine stable
✅ Multi-genre calibration complete
✅ Human-perception scoring active
🚧 Personal taste learning (planned)

🧭 Roadmap

Upcoming ideas:

Personal editor preference learning

Lightroom plugin integration

Smart burst selection

Automatic best-shot picker

Shooting feedback insights

🤝 Contribution

Pull requests and ideas are welcome.

If you are a photographer or ML enthusiast — contributions are encouraged.

⭐ Why PurePic Exists

PurePic is built to answer one question:

“Which photos would a real editor keep — and why?”
