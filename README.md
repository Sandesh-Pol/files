# AnimaType — Images Folder

Place anime character images here. Filenames must match the character slug format.

## Naming Convention
Use lowercase with underscores:
- `naruto.png` → Naruto Uzumaki
- `light.png` → Light Yagami
- `levi.png` → Levi Ackerman
- `rem.png` → Rem (Re:Zero)
- `gojo.png` → Gojo Satoru
- `mikasa.png` → Mikasa Ackerman

## How slugs are generated from AI result
The app converts the character name returned by Groq to a filename:
- Strip special characters
- Lowercase
- Replace spaces with underscores

Examples:
- "Naruto Uzumaki" → `naruto_uzumaki.png`
- "Light Yagami" → `light_yagami.png`
- "L Lawliet" → `l_lawliet.png`
- "Monkey D. Luffy" → `monkey_d_luffy.png`

## Recommended image size
- 200x200 px or larger
- Square crop, face visible
- PNG format preferred

## If no image found
The app shows a fallback emoji (🌸) — no errors are thrown.

## Suggested characters to add (common MBTI matches)
naruto.png, light.png, levi.png, rem.png, gojo.png, mikasa.png,
kakashi.png, l_lawliet.png, senku.png, violet_evergarden.png,
tanjiro.png, nezuko.png, itachi.png, erwin.png, armin.png,
historia.png, hisoka.png, killua.png, gon.png, lelouch.png,
edward_elric.png, alphonse_elric.png, roy_mustang.png, winry.png,
spike_spiegel.png, faye_valentine.png, saitama.png, genos.png,
shinji_ikari.png, rei_ayanami.png, asuka.png, zero_two.png
