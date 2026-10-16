import re

with open('/opt/data/three-kingdoms-game/src/lib/engine/eventEngine.ts', 'r') as f:
    content = f.read()

# More robust fix: process each line
lines = content.split('\n')
fixed_lines = []

for line in lines:
    if 'effects: {' in line and 'stats:' not in line:
        # Extract the effects content
        match = re.search(r'effects:\s*\{([^}]+)\}', line)
        if match:
            effects_str = match.group(1)
            
            # Split by comma, respecting nested objects
            depth = 0
            current = ''
            parts = []
            for ch in effects_str:
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
                if not part:
                    continue
                if re.match(r'^(str|int|lck|cha|vit)\s*:', part):
                    stat_props.append(part)
                else:
                    other_props.append(part)
            
            # Rebuild
            new_parts = []
            if stat_props:
                new_parts.append('stats: {' + ', '.join(stat_props) + '}')
            new_parts.extend(other_props)
            
            line = line[:line.index('effects:')] + 'effects: {' + ', '.join(new_parts) + '}'
    
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

with open('/opt/data/three-kingdoms-game/src/lib/engine/eventEngine.ts', 'w') as f:
    f.write(content)

print("Fixed!")
