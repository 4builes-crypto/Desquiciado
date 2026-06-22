from PIL import Image
img = Image.open("logo/logo_blanco_cut.png")
data = img.getdata()
opaque_colors = set()
for item in data:
    if item[3] > 0: # not fully transparent
        opaque_colors.add(item)
        if len(opaque_colors) > 10:
            break
print("Opaque colors in blanco:", opaque_colors)
