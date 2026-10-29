import re, json, os, urllib.request, html
UA={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read()
J=json.load(open('sfxlib/job.json'))
try: out=json.load(open('sfxlib/index.json'))
except Exception: out={}
for cat in J['mixkit']:
    for page in range(1,J.get('pages',3)+1):
        u=f'https://mixkit.co/free-sound-effects/{cat}/'+(f'?page={page}' if page>1 else '')
        try: h=get(u).decode('utf8','ignore')
        except Exception as e: print('ERR',u,e); continue
        os.makedirs('sfxlib/html',exist_ok=True);open(f'sfxlib/html/{cat}_{page}.html','w').write(h)
        items=re.findall(r'<div[^>]+class="[^"]*item-grid-sfx-preview[^"]*"(.*?)</div>\s*</div>\s*</div>',h,re.S)
        urls=re.findall(r'https://assets\.mixkit\.co/active_storage/sfx/\d+/\d+-preview\.mp3',h)
        titles=re.findall(r'<h2[^>]*class="[^"]*item-grid-sfx-preview__title[^"]*"[^>]*>\s*(.*?)\s*</h2>',h,re.S)
        print(cat,page,len(urls),len(titles))
        for i,url in enumerate(dict.fromkeys(urls)):
            t=html.unescape(titles[i]).strip() if i<len(titles) else ''
            out[url]={'cat':cat,'title':t}
os.makedirs('sfxlib/mixkit',exist_ok=True)
for url,meta in out.items():
    if 'file' in meta and os.path.exists(meta['file']): continue
    f='sfxlib/mixkit/'+url.split('/')[-1]
    if not os.path.exists(f):
        try: open(f,'wb').write(get(url))
        except Exception as e: print('DLERR',url,e)
    meta['file']=f
json.dump(out,open('sfxlib/index.json','w'),ensure_ascii=False,indent=1);print('total',len(out))
