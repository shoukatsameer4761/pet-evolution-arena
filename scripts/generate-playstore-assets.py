"""
Generate 4 Play Store assets for Pet Evolution Arena.
1. Feature Graphic (1024 x 500)
2. Screenshot 1 - Home / Pet Evolution (1080 x 1920)
3. Screenshot 2 - Battle Arena (1080 x 1920)
4. Screenshot 3 - Shop & VIP (1080 x 1920)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'playstore')
os.makedirs(OUT_DIR, exist_ok=True)

# Theme colors
BG = '#1A1A2E'
SURFACE = '#16213E'
SURFACE_LIGHT = '#0F3460'
PRIMARY = '#FF6B6B'
SECONDARY = '#4ECDC4'
ACCENT = '#FFE66D'
TEXT = '#FFFFFF'
TEXT_MUTED = '#A0A0A0'
SUCCESS = '#52C41A'
DANGER = '#FF4D4F'
VIP_GOLD = '#FFD700'

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def hex_to_rgba(h, a=255):
    return hex_to_rgb(h) + (a,)

def get_font(size, bold=False):
    """Try to get a good system font, fall back gracefully."""
    font_paths = [
        '/System/Library/Fonts/SFProDisplay-Bold.otf' if bold else '/System/Library/Fonts/SFProDisplay-Regular.otf',
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    r = radius
    # Main body
    draw.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
    draw.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
    # Corners
    draw.pieslice([x0, y0, x0 + 2*r, y0 + 2*r], 180, 270, fill=fill)
    draw.pieslice([x1 - 2*r, y0, x1, y0 + 2*r], 270, 360, fill=fill)
    draw.pieslice([x0, y1 - 2*r, x0 + 2*r, y1], 90, 180, fill=fill)
    draw.pieslice([x1 - 2*r, y1 - 2*r, x1, y1], 0, 90, fill=fill)
    if outline:
        # Top & bottom edges
        draw.arc([x0, y0, x0 + 2*r, y0 + 2*r], 180, 270, fill=outline, width=width)
        draw.arc([x1 - 2*r, y0, x1, y0 + 2*r], 270, 360, fill=outline, width=width)
        draw.arc([x0, y1 - 2*r, x0 + 2*r, y1], 90, 180, fill=outline, width=width)
        draw.arc([x1 - 2*r, y1 - 2*r, x1, y1], 0, 90, fill=outline, width=width)
        draw.line([x0 + r, y0, x1 - r, y0], fill=outline, width=width)
        draw.line([x0 + r, y1, x1 - r, y1], fill=outline, width=width)
        draw.line([x0, y0 + r, x0, y1 - r], fill=outline, width=width)
        draw.line([x1, y0 + r, x1, y1 - r], fill=outline, width=width)

def draw_gradient_bg(img, colors_hex):
    """Draw a vertical gradient background."""
    draw = ImageDraw.Draw(img)
    w, h = img.size
    c1 = hex_to_rgb(colors_hex[0])
    c2 = hex_to_rgb(colors_hex[1])
    for y in range(h):
        ratio = y / h
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

def draw_glow(img, cx, cy, radius, color_hex, alpha=80):
    """Draw a soft glow effect."""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    c = hex_to_rgb(color_hex)
    for i in range(radius, 0, -2):
        a = int(alpha * (i / radius))
        od.ellipse([cx - i, cy - i, cx + i, cy + i], fill=c + (a,))
    img.paste(Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB'), (0, 0))

def draw_star(draw, cx, cy, outer_r, inner_r, points, fill, rotation=-90):
    """Draw a star shape."""
    coords = []
    for i in range(points * 2):
        angle = math.radians(rotation + i * 180 / points)
        r = outer_r if i % 2 == 0 else inner_r
        coords.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(coords, fill=fill)

def draw_pet_icon(draw, cx, cy, size, pet_type, color):
    """Draw a stylized pet icon."""
    c = hex_to_rgb(color)
    r = size // 2
    # Body circle
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    # Eyes
    eye_r = size // 8
    draw.ellipse([cx - r//2 - eye_r, cy - r//4 - eye_r, cx - r//2 + eye_r, cy - r//4 + eye_r], fill=(255, 255, 255))
    draw.ellipse([cx + r//2 - eye_r, cy - r//4 - eye_r, cx + r//2 + eye_r, cy - r//4 + eye_r], fill=(255, 255, 255))
    # Pupils
    pr = eye_r // 2
    draw.ellipse([cx - r//2 - pr, cy - r//4 - pr, cx - r//2 + pr, cy - r//4 + pr], fill=(30, 30, 50))
    draw.ellipse([cx + r//2 - pr, cy - r//4 - pr, cx + r//2 + pr, cy - r//4 + pr], fill=(30, 30, 50))

    if pet_type == 'dragon':
        # Horns
        draw.polygon([(cx - r//2, cy - r), (cx - r//3, cy - r - size//3), (cx - r//6, cy - r)], fill=c)
        draw.polygon([(cx + r//6, cy - r), (cx + r//3, cy - r - size//3), (cx + r//2, cy - r)], fill=c)
        # Fire mouth
        draw.polygon([(cx - r//4, cy + r//4), (cx, cy + r + size//6), (cx + r//4, cy + r//4)], fill='#FF8E53')
    elif pet_type == 'tiger':
        # Ears
        draw.polygon([(cx - r, cy - r//2), (cx - r - size//6, cy - r - size//4), (cx - r//2, cy - r)], fill=c)
        draw.polygon([(cx + r, cy - r//2), (cx + r + size//6, cy - r - size//4), (cx + r//2, cy - r)], fill=c)
        # Stripes
        draw.line([(cx - r//3, cy - r//2), (cx - r//3 - 8, cy - r + 6)], fill=(30, 30, 50), width=3)
        draw.line([(cx + r//3, cy - r//2), (cx + r//3 + 8, cy - r + 6)], fill=(30, 30, 50), width=3)
    elif pet_type == 'alien':
        # Antennae
        draw.line([(cx - r//3, cy - r), (cx - r//2, cy - r - size//3)], fill=c, width=3)
        draw.ellipse([cx - r//2 - 6, cy - r - size//3 - 6, cx - r//2 + 6, cy - r - size//3 + 6], fill=SECONDARY)
        draw.line([(cx + r//3, cy - r), (cx + r//2, cy - r - size//3)], fill=c, width=3)
        draw.ellipse([cx + r//2 - 6, cy - r - size//3 - 6, cx + r//2 + 6, cy - r - size//3 + 6], fill=SECONDARY)
    elif pet_type == 'dog':
        # Floppy ears
        draw.ellipse([cx - r - size//6, cy - r//2, cx - r//2, cy + r//4], fill=c)
        draw.ellipse([cx + r//2, cy - r//2, cx + r + size//6, cy + r//4], fill=c)
        # Tongue
        draw.ellipse([cx - size//10, cy + r//3, cx + size//10, cy + r + size//8], fill=PRIMARY)

def draw_diamond(draw, cx, cy, w, h, fill):
    draw.polygon([(cx, cy - h//2), (cx + w//2, cy), (cx, cy + h//2), (cx - w//2, cy)], fill=fill)

def draw_phone_frame(img, x, y, pw, ph, screen_img):
    """Draw a phone mockup frame and paste screen content."""
    draw = ImageDraw.Draw(img)
    bezel = 12
    radius = 30
    # Outer frame (dark)
    draw_rounded_rect(draw, (x, y, x + pw, y + ph), radius, fill=hex_to_rgb('#0A0A1A'), outline=hex_to_rgb('#333355'), width=2)
    # Screen area
    sx, sy = x + bezel, y + bezel + 30
    sw, sh = pw - 2 * bezel, ph - 2 * bezel - 60
    resized = screen_img.resize((sw, sh), Image.LANCZOS)
    img.paste(resized, (sx, sy))
    # Top notch
    nw, nh = 80, 20
    draw_rounded_rect(draw, (x + pw//2 - nw//2, y + 6, x + pw//2 + nw//2, y + 6 + nh), 10, fill=hex_to_rgb('#0A0A1A'))
    # Bottom bar
    bw = 60
    draw_rounded_rect(draw, (x + pw//2 - bw//2, y + ph - 22, x + pw//2 + bw//2, y + ph - 14), 4, fill=hex_to_rgb('#333355'))


# ========== 1. FEATURE GRAPHIC (1024 x 500) ==========
def generate_feature_graphic():
    W, H = 1024, 500
    img = Image.new('RGB', (W, H))
    draw_gradient_bg(img, [BG, '#0D0D1A'])
    draw = ImageDraw.Draw(img)

    # Decorative glows
    draw_glow(img, 200, 250, 200, PRIMARY, 40)
    draw_glow(img, 820, 250, 180, SECONDARY, 35)
    draw_glow(img, 512, 400, 250, ACCENT, 20)
    draw = ImageDraw.Draw(img)

    # Decorative stars
    for sx, sy, sr in [(80, 80, 12), (950, 120, 10), (700, 60, 8), (150, 420, 9), (880, 400, 11)]:
        draw_star(draw, sx, sy, sr, sr//2, 4, hex_to_rgb(ACCENT))

    # Small floating particles
    for px, py, pr, pc in [(300, 100, 4, PRIMARY), (750, 380, 5, SECONDARY), (500, 80, 3, ACCENT),
                           (120, 300, 4, SECONDARY), (900, 250, 3, PRIMARY)]:
        draw.ellipse([px-pr, py-pr, px+pr, py+pr], fill=hex_to_rgb(pc))

    # Pet icons across the middle
    pets = [('dragon', PRIMARY, 160, 260), ('tiger', ACCENT, 340, 280),
            ('alien', SECONDARY, 690, 280), ('dog', '#FF8E53', 870, 260)]
    for ptype, color, px, py in pets:
        draw_pet_icon(draw, px, py, 60, ptype, color)

    # Central title area
    # Title background glow
    draw_glow(img, 512, 180, 300, SURFACE_LIGHT, 50)
    draw = ImageDraw.Draw(img)

    # Title text
    font_title = get_font(56, bold=True)
    font_sub = get_font(24, bold=False)
    font_tag = get_font(18, bold=True)

    title = "PET EVOLUTION"
    draw.text((512, 140), title, fill=hex_to_rgb(TEXT), font=font_title, anchor='mm')
    # "ARENA" in accent
    font_arena = get_font(62, bold=True)
    draw.text((512, 205), "ARENA", fill=hex_to_rgb(ACCENT), font=font_arena, anchor='mm')

    # Tagline
    draw.text((512, 260), "Evolve  •  Battle  •  Conquer", fill=hex_to_rgb(TEXT_MUTED), font=font_sub, anchor='mm')

    # Bottom badges
    badges = [
        ("🐾 4 Unique Pets", PRIMARY),
        ("⚔️ Arena Battles", SECONDARY),
        ("👑 VIP Rewards", VIP_GOLD),
        ("✨ Evolve to Legendary", ACCENT),
    ]
    badge_font = get_font(15, bold=True)
    total_w = len(badges) * 200 + (len(badges) - 1) * 16
    start_x = (W - total_w) // 2
    for i, (text, color) in enumerate(badges):
        bx = start_x + i * 216
        by = 340
        draw_rounded_rect(draw, (bx, by, bx + 200, by + 44), 22, fill=hex_to_rgba(color, 40)[:3], outline=hex_to_rgb(color), width=2)
        draw.text((bx + 100, by + 22), text, fill=hex_to_rgb(color), font=badge_font, anchor='mm')

    # Bottom line decoration
    draw.line([(200, 420), (824, 420)], fill=hex_to_rgba(SURFACE_LIGHT)[:3], width=1)

    # "Free to Play" + store badges area
    small_font = get_font(14, bold=False)
    draw.text((512, 450), "Free to Play  •  Available on Google Play", fill=hex_to_rgb(TEXT_MUTED), font=small_font, anchor='mm')

    # Border glow lines at top and bottom
    for i in range(3):
        alpha_color = tuple(max(0, min(255, c)) for c in hex_to_rgb(PRIMARY)[:3])
        draw.line([(0, i), (W, i)], fill=alpha_color, width=1)
        draw.line([(0, H - 1 - i), (W, H - 1 - i)], fill=alpha_color, width=1)

    img.save(os.path.join(OUT_DIR, 'feature-graphic.png'), 'PNG', quality=95)
    print("✅ Feature Graphic (1024x500) generated")


# ========== 2. SCREENSHOT 1 - Pet Evolution (1080 x 1920) ==========
def generate_screenshot_evolution():
    W, H = 1080, 1920
    img = Image.new('RGB', (W, H))
    draw_gradient_bg(img, [BG, '#0D0D1A'])
    draw = ImageDraw.Draw(img)

    # Top banner
    draw_rounded_rect(draw, (0, 0, W, 160), 0, fill=hex_to_rgb(SURFACE))
    font_header = get_font(36, bold=True)
    draw.text((W//2, 100), "EVOLVE YOUR PET", fill=hex_to_rgb(ACCENT), font=font_header, anchor='mm')

    # Subtitle
    font_sub = get_font(22, bold=False)
    draw.text((W//2, 200), "From Egg to Legendary — 5 Evolution Stages", fill=hex_to_rgb(TEXT_MUTED), font=font_sub, anchor='mm')

    # Evolution chain visualization
    stages = [
        ("Egg", '#888888', 60),
        ("Baby", SECONDARY, 70),
        ("Teen", PRIMARY, 80),
        ("Adult", ACCENT, 95),
        ("Legendary", VIP_GOLD, 110),
    ]
    chain_y = 380
    stage_spacing = W // (len(stages) + 1)
    font_stage = get_font(18, bold=True)

    for i, (name, color, size) in enumerate(stages):
        cx = stage_spacing * (i + 1)
        # Glow
        draw_glow(img, cx, chain_y, size + 20, color, 30)
        draw = ImageDraw.Draw(img)
        # Circle
        draw.ellipse([cx - size//2, chain_y - size//2, cx + size//2, cy:= chain_y + size//2], fill=hex_to_rgb(color))
        # Inner detail
        inner = size // 3
        draw.ellipse([cx - inner, chain_y - inner, cx + inner, chain_y + inner], fill=hex_to_rgba(TEXT, 60)[:3])
        # Stage name
        draw.text((cx, chain_y + size//2 + 25), name, fill=hex_to_rgb(color), font=font_stage, anchor='mm')
        # Arrow to next
        if i < len(stages) - 1:
            nx = stage_spacing * (i + 2)
            arrow_y = chain_y
            draw.line([(cx + size//2 + 8, arrow_y), (nx - stages[i+1][2]//2 - 8, arrow_y)], fill=hex_to_rgb(TEXT_MUTED), width=2)
            # Arrowhead
            ax = nx - stages[i+1][2]//2 - 8
            draw.polygon([(ax, arrow_y - 6), (ax + 10, arrow_y), (ax, arrow_y + 6)], fill=hex_to_rgb(TEXT_MUTED))

    # Pet showcase cards
    font_card_title = get_font(26, bold=True)
    font_card_desc = get_font(18, bold=False)
    font_stat = get_font(16, bold=True)

    pet_data = [
        ("Dragon", 'dragon', PRIMARY, "🔥 Fire Breath", {"HP": 120, "ATK": 20, "SPD": 8, "DEF": 15}),
        ("Tiger", 'tiger', ACCENT, "🐅 Claw Swipe", {"HP": 110, "ATK": 22, "SPD": 14, "DEF": 12}),
        ("Alien", 'alien', SECONDARY, "👽 Mind Blast", {"HP": 90, "ATK": 18, "SPD": 15, "DEF": 8}),
        ("Dog", 'dog', '#FF8E53', "🐕 Loyal Bite", {"HP": 100, "ATK": 15, "SPD": 12, "DEF": 10}),
    ]

    card_w = W - 80
    card_h = 200
    start_y = 520

    for i, (name, ptype, color, ability, stats) in enumerate(pet_data):
        cy_card = start_y + i * (card_h + 20)
        # Card bg
        draw_rounded_rect(draw, (40, cy_card, 40 + card_w, cy_card + card_h), 20, fill=hex_to_rgb(SURFACE), outline=hex_to_rgb(color), width=2)
        # Pet icon
        draw_pet_icon(draw, 130, cy_card + card_h//2, 80, ptype, color)
        # Name
        draw.text((220, cy_card + 30), name, fill=hex_to_rgb(TEXT), font=font_card_title, anchor='lm')
        # Ability
        draw.text((220, cy_card + 65), ability, fill=hex_to_rgb(color), font=font_card_desc, anchor='lm')
        # Stats bar
        stat_x = 220
        for j, (stat_name, val) in enumerate(stats.items()):
            sx = stat_x + j * 170
            sy = cy_card + 110
            draw.text((sx, sy), stat_name, fill=hex_to_rgb(TEXT_MUTED), font=font_stat, anchor='lm')
            # Bar background
            bar_x = sx
            bar_y = sy + 25
            bar_w = 120
            bar_h = 10
            draw_rounded_rect(draw, (bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), 5, fill=hex_to_rgb(SURFACE_LIGHT))
            # Bar fill
            fill_w = int(bar_w * min(val / 25, 1.0))
            if fill_w > 0:
                draw_rounded_rect(draw, (bar_x, bar_y, bar_x + fill_w, bar_y + bar_h), 5, fill=hex_to_rgb(color))
            # Value
            draw.text((sx + bar_w + 8, bar_y + 5), str(val), fill=hex_to_rgb(TEXT), font=font_stat, anchor='lm')

    # Bottom tagline
    font_bottom = get_font(28, bold=True)
    draw.text((W//2, 1780), "Choose Your Pet. Begin the Journey.", fill=hex_to_rgb(PRIMARY), font=font_bottom, anchor='mm')
    font_small = get_font(18, bold=False)
    draw.text((W//2, 1830), "Hatch, Train, Evolve, and Battle!", fill=hex_to_rgb(TEXT_MUTED), font=font_small, anchor='mm')

    img.save(os.path.join(OUT_DIR, 'screenshot-1-evolution.png'), 'PNG', quality=95)
    print("✅ Screenshot 1 - Pet Evolution (1080x1920) generated")


# ========== 3. SCREENSHOT 2 - Battle Arena (1080 x 1920) ==========
def generate_screenshot_battle():
    W, H = 1080, 1920
    img = Image.new('RGB', (W, H))
    draw_gradient_bg(img, ['#1A0A2E', '#0D0D1A'])
    draw = ImageDraw.Draw(img)

    # Top banner
    draw_rounded_rect(draw, (0, 0, W, 160), 0, fill=hex_to_rgb(SURFACE))
    font_header = get_font(36, bold=True)
    draw.text((W//2, 100), "⚔️  ARENA BATTLES", fill=hex_to_rgb(PRIMARY), font=font_header, anchor='mm')

    font_sub = get_font(22, bold=False)
    draw.text((W//2, 200), "Real-Time Combat with Epic Abilities", fill=hex_to_rgb(TEXT_MUTED), font=font_sub, anchor='mm')

    # Battle scene
    battle_y = 400
    # Left pet (player)
    draw_glow(img, 250, battle_y, 120, SECONDARY, 50)
    draw = ImageDraw.Draw(img)
    draw_pet_icon(draw, 250, battle_y, 120, 'dragon', SECONDARY)
    font_name = get_font(22, bold=True)
    draw.text((250, battle_y - 100), "Your Dragon", fill=hex_to_rgb(SECONDARY), font=font_name, anchor='mm')
    # HP bar
    draw_rounded_rect(draw, (170, battle_y - 75, 330, battle_y - 60), 7, fill=hex_to_rgb(SURFACE_LIGHT))
    draw_rounded_rect(draw, (170, battle_y - 75, 310, battle_y - 60), 7, fill=hex_to_rgb(SUCCESS))

    # VS
    font_vs = get_font(48, bold=True)
    draw.text((W//2, battle_y), "VS", fill=hex_to_rgb(ACCENT), font=font_vs, anchor='mm')

    # Lightning bolts around VS
    for dx, dy in [(-40, -30), (40, -30), (-40, 30), (40, 30)]:
        draw_star(draw, W//2 + dx, battle_y + dy, 8, 3, 4, hex_to_rgb(ACCENT))

    # Right pet (opponent)
    draw_glow(img, 830, battle_y, 120, PRIMARY, 50)
    draw = ImageDraw.Draw(img)
    draw_pet_icon(draw, 830, battle_y, 120, 'tiger', PRIMARY)
    draw.text((830, battle_y - 100), "Wild Tiger", fill=hex_to_rgb(PRIMARY), font=font_name, anchor='mm')
    # HP bar
    draw_rounded_rect(draw, (750, battle_y - 75, 910, battle_y - 60), 7, fill=hex_to_rgb(SURFACE_LIGHT))
    draw_rounded_rect(draw, (750, battle_y - 75, 850, battle_y - 60), 7, fill=hex_to_rgb(DANGER))

    # "FIRE BREATH!" attack text
    font_attack = get_font(32, bold=True)
    draw_glow(img, W//2, battle_y + 120, 80, ACCENT, 40)
    draw = ImageDraw.Draw(img)
    draw.text((W//2, battle_y + 120), "🔥 FIRE BREATH!", fill=hex_to_rgb(ACCENT), font=font_attack, anchor='mm')

    # Abilities panel
    font_section = get_font(28, bold=True)
    draw.text((W//2, 620), "Battle Abilities", fill=hex_to_rgb(TEXT), font=font_section, anchor='mm')

    abilities = [
        ("Bite", "20 DMG", PRIMARY, "Basic attack"),
        ("Fire Breath", "35 DMG", '#FF8E53', "Scorching flames"),
        ("Mind Blast", "30 DMG", SECONDARY, "Psychic energy"),
        ("Claw Swipe", "25 DMG", ACCENT, "Swift attack"),
        ("Heal", "Restore", SUCCESS, "Restores health"),
        ("Ultimate", "60 DMG", VIP_GOLD, "Devastating move"),
    ]

    font_ability = get_font(20, bold=True)
    font_ability_desc = get_font(16, bold=False)
    cols = 2
    card_w_ab = (W - 100) // cols
    card_h_ab = 130

    for i, (name, dmg, color, desc) in enumerate(abilities):
        col = i % cols
        row = i // cols
        cx = 50 + col * card_w_ab + 10
        cy = 680 + row * (card_h_ab + 12)
        draw_rounded_rect(draw, (cx, cy, cx + card_w_ab - 20, cy + card_h_ab), 16, fill=hex_to_rgb(SURFACE), outline=hex_to_rgb(color), width=2)
        draw.text((cx + (card_w_ab - 20)//2, cy + 30), name, fill=hex_to_rgb(TEXT), font=font_ability, anchor='mm')
        draw.text((cx + (card_w_ab - 20)//2, cy + 60), dmg, fill=hex_to_rgb(color), font=font_ability, anchor='mm')
        draw.text((cx + (card_w_ab - 20)//2, cy + 90), desc, fill=hex_to_rgb(TEXT_MUTED), font=font_ability_desc, anchor='mm')

    # Battle rewards section
    rewards_y = 1140
    draw.text((W//2, rewards_y), "Victory Rewards", fill=hex_to_rgb(ACCENT), font=font_section, anchor='mm')

    reward_items = [
        ("🪙  Coins", "+100-500", ACCENT),
        ("💎  Gems", "+5-20", SECONDARY),
        ("⭐  XP", "+50-200", PRIMARY),
        ("🏆  Trophies", "+10-50", VIP_GOLD),
    ]
    rw = 220
    total_rw = len(reward_items) * rw + (len(reward_items) - 1) * 12
    rx_start = (W - total_rw) // 2
    font_rew = get_font(18, bold=True)
    font_rew_val = get_font(16, bold=False)

    for i, (name, val, color) in enumerate(reward_items):
        rx = rx_start + i * (rw + 12)
        ry = rewards_y + 40
        draw_rounded_rect(draw, (rx, ry, rx + rw, ry + 90), 14, fill=hex_to_rgb(SURFACE))
        draw.text((rx + rw//2, ry + 30), name, fill=hex_to_rgb(color), font=font_rew, anchor='mm')
        draw.text((rx + rw//2, ry + 60), val, fill=hex_to_rgb(TEXT), font=font_rew_val, anchor='mm')

    # Leaderboard preview
    lb_y = 1360
    draw.text((W//2, lb_y), "🏆  Arena Leaderboard", fill=hex_to_rgb(VIP_GOLD), font=font_section, anchor='mm')

    lb_entries = [
        (1, "DragonMaster", "Dragon", "3,420", VIP_GOLD),
        (2, "AlienKing", "Alien", "3,380", '#C0C0C0'),
        (3, "TigerQueen", "Tiger", "3,350", '#CD7F32'),
        (4, "DogWhisperer", "Dog", "3,280", TEXT_MUTED),
        (5, "You", "Dragon", "1,200", SECONDARY),
    ]
    font_lb = get_font(20, bold=True)
    font_lb_sm = get_font(18, bold=False)

    for i, (rank, name, pet, trophies, color) in enumerate(lb_entries):
        ey = lb_y + 50 + i * 65
        bg_color = SURFACE if name != "You" else SURFACE_LIGHT
        draw_rounded_rect(draw, (60, ey, W - 60, ey + 55), 12, fill=hex_to_rgb(bg_color), outline=hex_to_rgb(color) if name == "You" else None, width=2 if name == "You" else 0)
        draw.text((100, ey + 28), f"#{rank}", fill=hex_to_rgb(color), font=font_lb, anchor='lm')
        draw.text((180, ey + 28), name, fill=hex_to_rgb(TEXT), font=font_lb, anchor='lm')
        draw.text((W - 100, ey + 28), f"🏆 {trophies}", fill=hex_to_rgb(ACCENT), font=font_lb_sm, anchor='rm')

    # Bottom CTA
    draw.text((W//2, 1830), "Climb the Ranks. Become #1!", fill=hex_to_rgb(PRIMARY), font=get_font(28, bold=True), anchor='mm')

    img.save(os.path.join(OUT_DIR, 'screenshot-2-battle.png'), 'PNG', quality=95)
    print("✅ Screenshot 2 - Battle Arena (1080x1920) generated")


# ========== 4. SCREENSHOT 3 - Shop & VIP (1080 x 1920) ==========
def generate_screenshot_shop():
    W, H = 1080, 1920
    img = Image.new('RGB', (W, H))
    draw_gradient_bg(img, [BG, '#0D0D1A'])
    draw = ImageDraw.Draw(img)

    # Top banner
    draw_rounded_rect(draw, (0, 0, W, 160), 0, fill=hex_to_rgb(SURFACE))
    font_header = get_font(36, bold=True)
    draw.text((W//2, 100), "👑  SHOP & VIP", fill=hex_to_rgb(VIP_GOLD), font=font_header, anchor='mm')

    font_sub = get_font(22, bold=False)
    draw.text((W//2, 200), "Gems, Items, Skins & Exclusive VIP Perks", fill=hex_to_rgb(TEXT_MUTED), font=font_sub, anchor='mm')

    # VIP card (premium highlight)
    vip_y = 260
    # VIP glow
    draw_glow(img, W//2, vip_y + 120, 200, VIP_GOLD, 25)
    draw = ImageDraw.Draw(img)
    draw_rounded_rect(draw, (50, vip_y, W - 50, vip_y + 240), 24, fill=hex_to_rgb('#1a1500'), outline=hex_to_rgb(VIP_GOLD), width=3)

    font_vip_title = get_font(32, bold=True)
    font_vip_perk = get_font(18, bold=False)
    font_vip_price = get_font(24, bold=True)

    draw.text((W//2, vip_y + 40), "👑  VIP PASS  👑", fill=hex_to_rgb(VIP_GOLD), font=font_vip_title, anchor='mm')

    vip_perks = [
        "✅  100 Gems Sign-Up Bonus",
        "✅  50 Daily Gems",
        "✅  All Skins Unlocked",
        "✅  Permanent 2x XP Boost",
    ]
    for i, perk in enumerate(vip_perks):
        draw.text((W//2, vip_y + 85 + i * 30), perk, fill=hex_to_rgb(TEXT), font=font_vip_perk, anchor='mm')

    draw_rounded_rect(draw, (W//2 - 100, vip_y + 195, W//2 + 100, vip_y + 230), 17, fill=hex_to_rgb(VIP_GOLD))
    draw.text((W//2, vip_y + 212), "$9.99/mo", fill=hex_to_rgb('#1A1A2E'), font=font_vip_price, anchor='mm')

    # Gem Packs section
    gem_y = 540
    font_section = get_font(28, bold=True)
    draw.text((W//2, gem_y), "💎  Gem Packs", fill=hex_to_rgb(SECONDARY), font=font_section, anchor='mm')

    gem_packs = [
        ("50", "$0.99", SECONDARY, ""),
        ("170", "$2.99", SECONDARY, "+20 Bonus"),
        ("600", "$7.99", PRIMARY, "+100 Bonus"),
        ("1500", "$14.99", ACCENT, "+300 Bonus"),
    ]
    font_gem = get_font(28, bold=True)
    font_gem_price = get_font(18, bold=True)
    font_gem_bonus = get_font(14, bold=True)

    gw = (W - 100) // 4
    for i, (amount, price, color, bonus) in enumerate(gem_packs):
        gx = 50 + i * gw + 6
        gy = gem_y + 40
        gh = 180
        draw_rounded_rect(draw, (gx, gy, gx + gw - 12, gy + gh), 16, fill=hex_to_rgb(SURFACE), outline=hex_to_rgb(color), width=2)
        # Diamond icon
        draw_diamond(draw, gx + (gw - 12)//2, gy + 40, 24, 32, hex_to_rgb(color))
        # Amount
        draw.text((gx + (gw - 12)//2, gy + 80), amount, fill=hex_to_rgb(TEXT), font=font_gem, anchor='mm')
        # Bonus
        if bonus:
            draw.text((gx + (gw - 12)//2, gy + 110), bonus, fill=hex_to_rgb(color), font=font_gem_bonus, anchor='mm')
        # Price button
        draw_rounded_rect(draw, (gx + 14, gy + gh - 40, gx + gw - 26, gy + gh - 10), 12, fill=hex_to_rgb(color))
        draw.text((gx + (gw - 12)//2, gy + gh - 25), price, fill=hex_to_rgb('#1A1A2E'), font=font_gem_price, anchor='mm')

    # Daily Special
    ds_y = 800
    draw.text((W//2, ds_y), "🔥  Daily Special", fill=hex_to_rgb(PRIMARY), font=font_section, anchor='mm')
    draw_rounded_rect(draw, (50, ds_y + 35, W - 50, ds_y + 155), 20, fill=hex_to_rgb(SURFACE), outline=hex_to_rgb(PRIMARY), width=2)
    font_ds = get_font(20, bold=True)
    draw.text((W//2, ds_y + 70), "500 Coins  +  50 Gems  +  100 Food", fill=hex_to_rgb(TEXT), font=font_ds, anchor='mm')
    # Old price strikethrough
    font_old = get_font(18, bold=False)
    draw.text((W//2 - 50, ds_y + 110), "$9.99", fill=hex_to_rgb(TEXT_MUTED), font=font_old, anchor='mm')
    draw.line([(W//2 - 75, ds_y + 110), (W//2 - 25, ds_y + 110)], fill=hex_to_rgb(DANGER), width=2)
    # New price
    draw_rounded_rect(draw, (W//2 + 10, ds_y + 95, W//2 + 110, ds_y + 125), 14, fill=hex_to_rgb(PRIMARY))
    draw.text((W//2 + 60, ds_y + 110), "$4.99", fill=hex_to_rgb(TEXT), font=font_ds, anchor='mm')

    # Skins section
    skin_y = 1000
    draw.text((W//2, skin_y), "🎨  Exclusive Skins", fill=hex_to_rgb(TEXT), font=font_section, anchor='mm')

    skin_data = [
        ("Golden", VIP_GOLD),
        ("Crystal", SECONDARY),
        ("Shadow", '#6C5CE7'),
        ("Rainbow", PRIMARY),
    ]
    font_skin = get_font(18, bold=True)
    sw_card = (W - 100) // 4

    for i, (name, color) in enumerate(skin_data):
        sx = 50 + i * sw_card + 8
        sy = skin_y + 40
        sh = 150
        draw_rounded_rect(draw, (sx, sy, sx + sw_card - 16, sy + sh), 16, fill=hex_to_rgb(SURFACE), outline=hex_to_rgb(color), width=2)
        # Skin circle
        cr = 30
        draw.ellipse([sx + (sw_card - 16)//2 - cr, sy + 35 - cr, sx + (sw_card - 16)//2 + cr, sy + 35 + cr], fill=hex_to_rgb(color))
        # Inner shine
        draw.ellipse([sx + (sw_card - 16)//2 - 10, sy + 25, sx + (sw_card - 16)//2 + 10, sy + 45], fill=hex_to_rgba(TEXT, 60)[:3])
        # Name
        draw.text((sx + (sw_card - 16)//2, sy + 85), name, fill=hex_to_rgb(color), font=font_skin, anchor='mm')
        # VIP badge
        draw_rounded_rect(draw, (sx + (sw_card - 16)//2 - 30, sy + 110, sx + (sw_card - 16)//2 + 30, sy + 130), 10, fill=hex_to_rgb(VIP_GOLD))
        vip_font = get_font(12, bold=True)
        draw.text((sx + (sw_card - 16)//2, sy + 120), "VIP FREE", fill=hex_to_rgb('#1A1A2E'), font=vip_font, anchor='mm')

    # Shop items section
    shop_y = 1230
    draw.text((W//2, shop_y), "🛒  Items Shop", fill=hex_to_rgb(ACCENT), font=font_section, anchor='mm')

    items = [
        ("Snack Pack", "25 Food", "100", PRIMARY),
        ("Feast Bundle", "100 Food", "350", PRIMARY),
        ("XP Boost", "2x XP 1hr", "300", SECONDARY),
        ("Mega XP", "2x XP 4hr", "1000", SECONDARY),
        ("Revive", "Continue", "200", ACCENT),
        ("Revive x5", "5 Tokens", "800", ACCENT),
    ]
    font_item = get_font(17, bold=True)
    font_item_desc = get_font(14, bold=False)
    font_price_sm = get_font(15, bold=True)

    iw = (W - 100) // 3
    ih = 140
    for i, (name, desc, price, color) in enumerate(items):
        col = i % 3
        row = i // 3
        ix = 50 + col * iw + 8
        iy = shop_y + 40 + row * (ih + 12)
        draw_rounded_rect(draw, (ix, iy, ix + iw - 16, iy + ih), 14, fill=hex_to_rgb(SURFACE))
        draw.text((ix + (iw - 16)//2, iy + 30), name, fill=hex_to_rgb(TEXT), font=font_item, anchor='mm')
        draw.text((ix + (iw - 16)//2, iy + 60), desc, fill=hex_to_rgb(TEXT_MUTED), font=font_item_desc, anchor='mm')
        # Price
        draw_rounded_rect(draw, (ix + (iw - 16)//2 - 40, iy + ih - 40, ix + (iw - 16)//2 + 40, iy + ih - 12), 12, fill=hex_to_rgb(color))
        draw.text((ix + (iw - 16)//2, iy + ih - 26), f"🪙 {price}", fill=hex_to_rgb('#1A1A2E'), font=font_price_sm, anchor='mm')

    # Bottom CTA
    draw.text((W//2, 1780), "Power Up Your Journey!", fill=hex_to_rgb(ACCENT), font=get_font(28, bold=True), anchor='mm')
    draw.text((W//2, 1830), "Exclusive VIP perks • Daily rewards • Rare skins", fill=hex_to_rgb(TEXT_MUTED), font=get_font(18, bold=False), anchor='mm')

    img.save(os.path.join(OUT_DIR, 'screenshot-3-shop-vip.png'), 'PNG', quality=95)
    print("✅ Screenshot 3 - Shop & VIP (1080x1920) generated")


# ========== GENERATE ALL ==========
if __name__ == '__main__':
    print("Generating Play Store assets...\n")
    generate_feature_graphic()
    generate_screenshot_evolution()
    generate_screenshot_battle()
    generate_screenshot_shop()
    print(f"\n🎉 All 4 assets saved to: {os.path.abspath(OUT_DIR)}")
