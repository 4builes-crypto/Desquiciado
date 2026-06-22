from PIL import Image
from collections import Counter
img = Image.open("logo/logo_blanco_cut.png")
data = img.getdata()
counts = Counter(item for item in data if item[3] > 0)
print("Blanco common opaque colors:", counts.most_common(5))
img2 = Image.open("logo/logo_negro_cut.png")
data2 = img2.getdata()
counts2 = Counter(item for item in data2 if item[3] > 0)
print("Negro common opaque colors:", counts2.most_common(5))
