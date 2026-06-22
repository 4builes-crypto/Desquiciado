from PIL import Image
img1 = Image.open("logo/logo_blanco_cut.png").convert("RGB")
print("Blanco bg:", img1.getpixel((0,0)))
img2 = Image.open("logo/logo_negro_cut.png").convert("RGB")
print("Negro bg:", img2.getpixel((0,0)))
