from PIL import Image
img1 = Image.open("logo/logo_blanco_cut.png")
print("Blanco mode:", img1.mode, "pixel(0,0):", img1.getpixel((0,0)))
img2 = Image.open("logo/logo_negro_cut.png")
print("Negro mode:", img2.mode, "pixel(0,0):", img2.getpixel((0,0)))
