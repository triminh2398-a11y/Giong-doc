import re, unicodedata
def slug(s):
    s = unicodedata.normalize('NFD', s); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').replace('đ', 'd').replace('Đ', 'D')
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_') or 'v'
