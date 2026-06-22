from PIL import Image

def process_blanco(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if a == 0:
            new_data.append((255, 255, 255, 0))
            continue
        brightness = (r + g + b) / 3
        # Background is around 50. Text is 255.
        if brightness < 100:
            new_data.append((255, 255, 255, 0))
        else:
            # Map 100-255 to 0-255
            alpha = int((brightness - 100) / 155 * 255)
            new_data.append((255, 255, 255, alpha))
    img.putdata(new_data)
    # Crop to bounding box of non-transparent pixels to remove excessive padding
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(output_path, "PNG")

def process_negro(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if a == 0:
            new_data.append((0, 0, 0, 0))
            continue
        brightness = (r + g + b) / 3
        # Background is around 230. Text is ~0.
        if brightness > 150:
            new_data.append((0, 0, 0, 0))
        else:
            # Map 0-150 to 255-0
            alpha = int((150 - brightness) / 150 * 255)
            # Ensure it's not fully opaque if it's antialiasing
            new_data.append((0, 0, 0, alpha))
    img.putdata(new_data)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(output_path, "PNG")

process_blanco("logo/logo_blanco_cut.png", "public/logo_blanco_cut.png")
process_negro("logo/logo_negro_cut.png", "public/logo_negro_cut.png")
print("Done processing images")
