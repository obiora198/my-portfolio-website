import os
import shutil
import urllib.request

output_dir = os.path.join('public', 'images', 'vtu-providers')
os.makedirs(output_dir, exist_ok=True)

# Map service IDs to the best URLs (trying sandbox, then production vtpass)
service_sources = {
    # Airtime
    'mtn': 'https://vtpass.com/resources/products/200X200/MTN-Airtime.jpg',
    'airtel': 'https://vtpass.com/resources/products/200X200/Airtel-Airtime.jpg',
    'glo': 'https://vtpass.com/resources/products/200X200/GLO-Airtime.jpg',
    'etisalat': 'https://vtpass.com/resources/products/200X200/9mobile-Airtime.jpg',
    'foreign-airtime': 'https://vtpass.com/resources/products/200X200/Foreign-Airtime.jpg',
    
    # Data
    'mtn-data': 'https://vtpass.com/resources/products/200X200/MTN-Data.jpg',
    'airtel-data': 'https://vtpass.com/resources/products/200X200/Airtel-Data.jpg',
    'glo-data': 'https://vtpass.com/resources/products/200X200/GLO-Data.jpg',
    'glo-sme-data': 'https://vtpass.com/resources/products/200X200/GLO-Data-(SME).jpg',
    'etisalat-data': 'https://vtpass.com/resources/products/200X200/9mobile-Data.jpg',
    'smile-direct': 'https://vtpass.com/resources/products/200X200/Smile-Payment.jpg',
    'spectranet': 'https://vtpass.com/resources/products/200X200/Spectranet.jpg',
    
    # TV
    'dstv': 'https://vtpass.com/resources/products/200X200/Pay-DSTV-Subscription.jpg',
    'gotv': 'https://vtpass.com/resources/products/200X200/Gotv-Payment.jpg',
    'startimes': 'https://vtpass.com/resources/products/200X200/Startimes-Subscription.jpg',
    'showmax': 'https://vtpass.com/resources/products/200X200/ShowMax.jpg',
    
    # Electricity
    'ikeja-electric': 'https://vtpass.com/resources/products/200X200/Ikeja-Electric-Payment-PHCN.jpg',
    'eko-electric': 'https://vtpass.com/resources/products/200X200/Eko-Electric-Payment-PHCN.jpg',
    'abuja-electric': 'https://vtpass.com/resources/products/200X200/Abuja-Electric.jpg',
    'kano-electric': 'https://vtpass.com/resources/products/200X200/Kano-Electric.jpg',
    'portharcourt-electric': 'https://vtpass.com/resources/products/200X200/Port-Harcourt-Electric.jpg',
    'jos-electric': 'https://vtpass.com/resources/products/200X200/Jos-Electric-JED.jpg',
    'kaduna-electric': 'https://vtpass.com/resources/products/200X200/Kaduna-Electric-KAEDCO.jpg',
    'enugu-electric': 'https://vtpass.com/resources/products/200X200/Enugu-Electric-EEDC.jpg',
    'ibadan-electric': 'https://sandbox.vtpass.com/resources/products/200X200/Ibadan-Electric.jpg',
    'benin-electric': 'https://vtpass.com/resources/products/200X200/Benin-Electricity-BEDC.jpg',
    'aba-electric': 'https://vtpass.com/resources/products/200X200/Aba-Electric-Payment-ABEDC.jpg',
    'yola-electric': 'https://vtpass.com/resources/products/200X200/Yola-Electric-Payment-IKEDC.jpg',
}

for sid, url in service_sources.items():
    target_file = os.path.join(output_dir, f"{sid}.jpg")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                data = resp.read()
                with open(target_file, 'wb') as f:
                    f.write(data)
                print(f"[OK] {sid}: {len(data)} bytes")
    except Exception as e:
        print(f"[FAIL] {sid} ({url}): {e}")

# Aliases and fallbacks
aliases = {
    'glo-sme-data.jpg': ['glo-data.jpg', 'glo.jpg'],
    'glo-airtime.jpg': ['glo.jpg'],
    'mtn-airtime.jpg': ['mtn.jpg'],
    'airtel-airtime.jpg': ['airtel.jpg'],
    'etisalat-airtime.jpg': ['etisalat.jpg'],
    '9mobile.jpg': ['etisalat.jpg'],
    '9mobile-data.jpg': ['etisalat-data.jpg'],
}

for target_name, fallbacks in aliases.items():
    target_path = os.path.join(output_dir, target_name)
    if not os.path.exists(target_path) or os.path.getsize(target_path) < 100:
        for fb in fallbacks:
            fb_path = os.path.join(output_dir, fb)
            if os.path.exists(fb_path):
                shutil.copyfile(fb_path, target_path)
                print(f"[ALIAS] Copied {fb} -> {target_name}")
                break

print("Finished downloading and setting up VTU provider images!")
