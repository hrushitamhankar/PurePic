import os
import csv
import shutil
import sys

# -------------------------------------------------
# ENSURE PROJECT ROOT IMPORTS WORK
# -------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from src.quality.final_quality import final_evaluation


# -------------------------------------------------
# OUTPUT STRUCTURE (RESTORED)
# -------------------------------------------------
OUTPUT_ROOT = os.path.join(PROJECT_ROOT, "outputs")

FOLDERS = {
    "good": os.path.join(OUTPUT_ROOT, "good"),
    "ok": os.path.join(OUTPUT_ROOT, "ok"),
    "reject": os.path.join(OUTPUT_ROOT, "reject"),
    "artistic_keep": os.path.join(OUTPUT_ROOT, "artistic_keep"),
}

CSV_REPORT = os.path.join(OUTPUT_ROOT, "report.csv")

VALID_EXT = [".jpg", ".jpeg", ".png", ".cr2", ".nef", ".arw", ".dng"]


# -------------------------------------------------
# CREATE OUTPUT FOLDERS
# -------------------------------------------------
os.makedirs(OUTPUT_ROOT, exist_ok=True)
for f in FOLDERS.values():
    os.makedirs(f, exist_ok=True)


# -------------------------------------------------
# CLEAN PATH INPUT
# -------------------------------------------------
def clean_path(path_str):
    return path_str.strip().strip('"').strip("'")


# -------------------------------------------------
# CHOOSE DESTINATION
# -------------------------------------------------
def choose_output_folder(label):
    return FOLDERS.get(label, FOLDERS["reject"])


# -------------------------------------------------
# MAIN SCAN
# -------------------------------------------------
def scan_folder(folder_path):

    folder_path = clean_path(folder_path)
    folder_path = os.path.abspath(folder_path)

    print("\n📸 PUREPIC SCANNING STARTED...\n")

    if not os.path.isdir(folder_path):
        print("❌ Folder not found.")
        return

    with open(CSV_REPORT, "w", newline="", encoding="utf-8") as csv_file:

        writer = csv.writer(csv_file)
        writer.writerow([
            "filename",
            "label",
            "final_score",
            "technical",
            "aesthetic",
            "sharpness",
            "blur",
            "noise",
            "exposure"
        ])

        for file in os.listdir(folder_path):

            img_path = os.path.join(folder_path, file)

            if not os.path.isfile(img_path):
                continue

            ext = os.path.splitext(file)[1].lower()
            if ext not in VALID_EXT:
                continue

            print(f"Processing: {file} ...")

            try:
                result = final_evaluation(img_path)

                dest_folder = choose_output_folder(
                    result["final_label"]
                )

                shutil.copy2(img_path,
                             os.path.join(dest_folder, file))

                writer.writerow([
                    file,
                    result["final_label"],
                    result["final_score"],
                    result["technical_score"],
                    result["aesthetic_score"],
                    result["sharpness"],
                    result["blur"],
                    result["noise"],
                    result["exposure"]
                ])

            except Exception as e:
                print(f"❌ Error processing {file}: {e}")

    print("\n🎉 PUREPIC COMPLETE!")
    print("📄 CSV:", CSV_REPORT)
    print("📁 Output:", OUTPUT_ROOT)


# -------------------------------------------------
# RUNNER
# -------------------------------------------------
if __name__ == "__main__":

    input_folder = input("Enter folder path to scan: ").strip()

    output_folder = input(
        "Enter OUTPUT folder path (Press Enter for ./outputs): "
    ).strip()

    if output_folder:
        OUTPUT_ROOT = os.path.abspath(
            output_folder.strip('"').strip("'")
        )

        # rebuild folder paths dynamically
        FOLDERS["good"] = os.path.join(OUTPUT_ROOT, "good")
        FOLDERS["ok"] = os.path.join(OUTPUT_ROOT, "ok")
        FOLDERS["reject"] = os.path.join(OUTPUT_ROOT, "reject")
        FOLDERS["artistic_keep"] = os.path.join(
            OUTPUT_ROOT, "artistic_keep"
        )

        os.makedirs(OUTPUT_ROOT, exist_ok=True)
        for f in FOLDERS.values():
            os.makedirs(f, exist_ok=True)

    scan_folder(input_folder)

