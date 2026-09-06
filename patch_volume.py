with open('src/lib/audio.ts', 'r') as f:
    content = f.read()

content = content.replace("this.volume = volumePercentage * 0.25;", "this.volume = volumePercentage * 0.2125; // Lowered volume by an additional 15%")

with open('src/lib/audio.ts', 'w') as f:
    f.write(content)
