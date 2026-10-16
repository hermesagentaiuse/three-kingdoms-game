#!/usr/bin/env python3
"""Fix exp being inside stats -> should be top-level."""
import re

path = "/opt/data/three-kingdoms-game/src/lib/data/events.ts"
with open(path, "r") as f:
    content = f.read()

# Pattern: stats: { ... exp: N ... } -> stats: { ... } exp: N
# We need to find "stats: { X, exp: N, Y }" and move exp: N outside
def fix_stats_exp(match):
    prefix = match.group(1)
    stats_content = match.group(2)
    suffix = match.group(3)
    
    # Check if exp is in the stats content
    exp_match = re.search(r'exp:\s*(\d+)', stats_content)
    if not exp_match:
        return match.group(0)
    
    exp_val = exp_match.group(1)
    # Remove exp from stats content
    new_stats = re.sub(r'\s*,?\s*exp:\s*\d+', '', stats_content)
    # Remove trailing comma from new_stats if present
    new_stats = new_stats.rstrip(',').rstrip()
    # Clean up any double commas
    new_stats = re.sub(r',\s*,', ',', new_stats)
    
    return f"{prefix}stats: {{{new_stats}}}{suffix}exp: {exp_val}"

# Match patterns like:
# effects: {\n          stats: { str: 3, exp: 40 },\n
# -> effects: {\n          stats: { str: 3 },\n          exp: 40,
# But simpler: find "stats: { X, exp: Y, Z }" -> "stats: { X, Z }, exp: Y"

# Better approach: find all "stats: { ... }" blocks and fix them
def fix_block(text):
    # Pattern: "stats: { ...exp: N... }" where the closing } is followed by , or }
    pattern = r'(stats:\s*\{[^}]*)exp:\s*(\d+)([^}]*\})'
    
    def repl(m):
        before = m.group(1).rstrip(', \n')
        exp_val = m.group(2)
        after = m.group(3).lstrip(', \n')
        
        # Reconstruct stats block without exp
        stats_block = before + ("," if after else "") + after
        stats_block = stats_block.rstrip(',').rstrip()
        
        # Return: stats: { ... } \n          exp: N
        return f'stats: {{{stats_block}}}  \n          exp: {exp_val}'
    
    # Keep replacing until no more exp found
    prev = None
    while prev != text:
        prev = text
        text = re.sub(pattern, repl, text)
    
    return text

content = fix_block(content)

with open(path, "w") as f:
    f.write(content)

print("Fixed exp in stats blocks")
