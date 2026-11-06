b=open('build.py').read()
b=b.replace("tiktok_thangiucua/'; OUT = G + 'render/tgc/'","tiktok_bunhin/'; OUT = G + 'render/bn/'")
b=b.replace("for job in ('99_tgc_n', '99_tgc_nfix', '99_tgc_title'):","for job in ('99_bn_n', '99_bn_nfix'):")
s=b.index("    elif sp in ('MA', 'LA', 'GM'):");e=b.index("    clips.append(c)")
b=b[:s]+'''    else:
        job = {'TA': '99_bn_ts', 'GT': '99_bn_ts', 'HA': '99_bn_md', 'GH': '99_bn_md', 'CH': '99_bn_td'}[sp]
        Jx = json.load(open(G + f'jobs/{job}.json')); vd = [x for x in os.listdir(G + f'out/{job}') if not x.startswith('DONE')][0]
        cands = [G + f'out/{job}/{vd}/{k:02d}' for k, l in enumerate(Jx['lines']) if l == tx and os.path.exists(G + f'out/{job}/{vd}/{k:02d}.wav')]
        sc = [(difflib.SequenceMatcher(None, norm(clean(tx)), norm(open(f + '.txt').read() if os.path.exists(f + '.txt') else '')).ratio(), f) for f in cands]
        if sh in PICK: sc = [(1, G + f'out/{job}/{vd}/{PICK[sh]}')]
        r, f = max(sc); info.append((round(r, 2), os.path.basename(f)))
        c = P.stretch_pauses(P.trim(P.load(f + '.wav')), factor=1.2, extra=0.05)
        if sp == 'CH': c = ff(c, f'asetrate={int(SR*0.94)},aresample={SR},atempo=0.98')
        if sp == 'GT': c = ghost(ff(c, f'asetrate={int(SR*0.9)},aresample={SR},atempo=0.86'), 'ghost')
        if sp == 'GH': c = ghost(ff(c, f'asetrate={int(SR*0.96)},aresample={SR},atempo=0.85'), 'far')
'''+b[e:]
b=b.replace("(0.85 if sp in ('GM','GB') else 1.0)","(0.85 if sp in ('GT','GH') else 1.0)")
b=b.replace("SLOW_IN = {'title', 'na1', 'tu', 'night', 'call', 'boy', 'let', 'end', 'end2', 'na3', 'cta'}","SLOW_IN = {'title', 'rent', 'swap', 'call', 'night', 'turn', 'morning', 'end', 'end2', 'gh', 'cta'}")
b=b.replace("    if S[i][0] == 'na3': g = 2.2\n    if S[i][0] in ('gm', 'gb', 'bell'): g = 1.0\n    if S[i][0] == 'end2': g = 1.0","    if S[i][0] == 'gh': g = 2.2\n    if S[i][0] in ('gt', 'gt2', 'turn', 'end2'): g = 1.0")
open('build.py','w').write(b)
