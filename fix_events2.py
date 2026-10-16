import re

with open('/opt/data/three-kingdoms-game/src/lib/data/events.ts', 'r') as f:
    lines = f.readlines()

output = []
for line in lines:
    # Match lines with effects: { ... }
    match = re.match(r'(\s+)effects:\s*\{(.+)\},?\s*$', line)
    if match:
        indent = match.group(1)
        content = match.group(2)
        
        # Split by comma, respecting nested braces
        parts = []
        current = ''
        depth = 0
        for ch in content:
            if ch == '{':
                depth += 1
                current += ch
            elif ch == '}':
                depth -= 1
                current += ch
            elif ch == ',' and depth == 0:
                parts.append(current.strip())
                current = ''
            else:
                current += ch
        if current.strip():
            parts.append(current.strip())
        
        # Separate stat props from others
        stat_props = []
        other_props = []
        for part in parts:
            part = part.strip()
            if re.match(r'^(str|int|lck|cha|vit)\s*:', part):
                stat_props.append(part)
            else:
                other_props.append(part)
        
        # Rebuild
        new_parts = []
        if stat_props:
            new_parts.append('stats: {' + ', '.join(stat_props) + '}')
        new_parts.extend(other_props)
        
        output.append(indent + 'effects: {' + ', '.join(new_parts) + '},\n')
    else:
        output.append(line)

with open('/opt/data/three-kingdoms-game/src/lib/data/events.ts', 'w') as f:
    f.writelines(output)

print("Fixed!")
