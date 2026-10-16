#!/usr/bin/env python3
"""Analyze all events for age/logic consistency."""
import re

with open("src/lib/data/events.ts") as f:
    content = f.read()

events = []
for match in re.finditer(r"\{[^{}]*id:\s*'([^']+)'.*?era:\s*'([^']+)'[^\}]*?(?:minAge:\s*(\d+)[^\}]*)?[^\}]*?(?:maxAge:\s*(\d+)[^\}]*)?[^\}]*?type:\s*'([^']+)'", content, re.DOTALL):
    events.append({
        "id": match.group(1),
        "era": match.group(2),
        "minAge": int(match.group(3)) if match.group(3) else None,
        "maxAge": int(match.group(4)) if match.group(4) else None,
        "type": match.group(5),
    })

print(f"Total events found: {len(events)}")
print()

print("=== 問題事件：嬰兒/幼童參與武裝/戰鬥 ===")
print()
for e in events:
    min_a = e["minAge"] if e["minAge"] else 0
    max_a = e["maxAge"] if e["maxAge"] else 120
    if e["type"] in ("combat", "historical") and max_a <= 5:
        print(f"  [WARNING] {e['id']} (era:{e['era']}, type:{e['type']}) -- maxAge={max_a} (too young)")
    if e["minAge"] is None and e["type"] in ("combat",):
        print(f"  [WARNING] {e['id']} (era:{e['era']}, type:{e['type']}) -- no minAge")

print()
print("=== 所有事件年齡分佈 ===")
for e in sorted(events, key=lambda x: (x.get("minAge") or 0, x["id"])):
    mn = e["minAge"] if e["minAge"] else "unlim"
    mx = e["maxAge"] if e["maxAge"] else "unlim"
    print(f"  {str(mn):>8} - {str(mx):>8}  {e['id']:30}  [{e['type']:12}]")

# Count by life stage
print()
print("=== 各年齡段事件數量 ===")
stage_counts = {}
for e in events:
    min_a = e["minAge"] if e["minAge"] else 0
    max_a = e["maxAge"] if e["maxAge"] else 120
    if max_a <= 3:
        stage = "infant (0-3)"
    elif max_a <= 7:
        stage = "child (4-7)"
    elif max_a <= 12:
        stage = "preteen (8-12)"
    else:
        stage = "teen+ (13+)"
    stage_counts[stage] = stage_counts.get(stage, 0) + 1
for stage, count in sorted(stage_counts.items()):
    print(f"  {stage}: {count}")
