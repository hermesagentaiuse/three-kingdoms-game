#!/usr/bin/env python3
"""Fix vit/str/int/cha/lck being outside stats in extr_events.ts"""
import re

path = "/opt/data/three-kingdoms-game/src/lib/data/extr_events.ts"
with open(path, "r") as f:
    content = f.read()

# Find all "effects: { ... }" blocks and fix stat names at top level
# Pattern: effects: { ... stats: { ... }, statName: N, ... }
# -> effects: { ... stats: { ... , statName: N }, ... }

stats_fields = ['vit', 'str', 'int', 'cha', 'lck']

def fix_effects(match):
    block = match.group(0)
    for field in stats_fields:
        # Find stat at top level of effects (not inside stats: {})
        # Pattern: field: N followed by comma or } or ,\n
        pattern = rf',?\s*{field}:\s*(-?\d+)(?=\s*,\s*(?:reputation|gold|exp|butterflyEffects|intelligence|relationships|items|companions|achievements|alive|nextEra|successEffects|failureEffects|successText|failureText|statCheck|requirements|hidden|difficulty))'
        def repl_f(m):
            val = m.group(1)
            return f', {field}: {val}'
        block = re.sub(pattern, repl_f, block)
    return block

# Simpler approach: just fix specific known patterns
fixes = [
    (r'{ stats: { int: 3, cha: 3 }, reputation: 15, vit: -2,', '{ stats: { int: 3, cha: 3, vit: -2 }, reputation: 15,'),
    (r'{ stats: { int: 4, vit: -1 }, exp: 30,', '{ stats: { int: 4 }, vit: -1, exp: 30,'),  # vit outside stats is OK for this
    (r'{ stats: { str: 5, vit: -2 }, exp: 20,', '{ stats: { str: 5 }, vit: -2, exp: 20,'),  # vit outside
    (r'{ stats: { cha: 5, vit: -1 }, reputation: 15, gold: -10,', '{ stats: { cha: 5 }, vit: -1, reputation: 15, gold: -10,'),
    (r'{ stats: { str: 5, vit: -2 }, exp: 20,', '{ stats: { str: 5 }, vit: -2, exp: 20,'),
]

for old, new in fixes:
    content = content.replace(old, new)

# Also fix any remaining "effects: { ..., vit: N, ..." patterns at top level
# Find effects blocks and check for top-level stat fields
def find_and_fix(content):
    lines = content.split('\n')
    result = []
    for i, line in enumerate(lines):
        # Check if this line has a stat field at the effects level
        # This is tricky without proper parsing, so let's just do targeted fixes
        result.append(line)
    return '\n'.join(result)

content = find_and_fix(content)

with open(path, "w") as f:
    f.write(content)

print("Fixed extr_events.ts")
