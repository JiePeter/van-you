"""Lockstep schema+data walker: finds every data field the Sanity schema does
not declare (i.e. what Studio flags as 'Unknown field found'). Authoritative —
uses the same extracted schema.json the Studio validates against.

Run after any mockData -> seed -> `sanity dataset import` to catch schema drift:
    npx sanity schema extract --enforce-required-fields   # writes schema.json
    python sweep-unknown-fields.py                        # lists undeclared fields

Reads the live `production` dataset over the public CDN (project swlg6klq)."""
import json, urllib.parse, urllib.request

schema = json.load(open('schema.json', encoding='utf-8'))
byName = {t['name']: t for t in schema}

def resolve_named(name):
    node = byName.get(name)
    if node is None:
        return None
    if 'attributes' in node:            # document node
        return {'type': 'object', 'attributes': node['attributes']}
    return node.get('value')            # 'type' wrapper

def obj_fields(tn):
    """attrname -> value-typenode for an object typenode (merges inline + rest)."""
    if tn is None:
        return None
    t = tn.get('type')
    if t == 'inline':
        return obj_fields(resolve_named(tn['name']))
    if t in ('object', 'document'):
        fields = {k: v.get('value') for k, v in tn.get('attributes', {}).items()}
        rest = tn.get('rest')
        if rest is not None:
            rf = obj_fields(rest) or {}
            for k, v in rf.items():
                fields.setdefault(k, v)
        return fields
    return None

unknowns = []

def members_of(of):
    if isinstance(of, dict) and of.get('type') == 'union':
        return of.get('of', [])
    if isinstance(of, list):
        return of
    return [of]

def match_member(item, members):
    it = item.get('_type') if isinstance(item, dict) else None
    if it:
        for m in members:
            f = obj_fields(m)
            if f and '_type' in f and f['_type'] and f['_type'].get('value') == it:
                return m
        for m in members:                # inline-name fallback
            if m.get('type') == 'inline' and m.get('name') == it:
                return m
    return members[0] if len(members) == 1 else None

def walk(data, tn, path):
    if tn is None:
        return
    t = tn.get('type')
    if t == 'inline':
        walk(data, resolve_named(tn['name']), path); return
    if t in ('object', 'document'):
        if not isinstance(data, dict):
            return
        fields = obj_fields(tn)
        if fields is None:
            return
        for k, val in data.items():
            if k.startswith('_'):
                continue
            if k not in fields:
                unknowns.append(path + '.' + k)
            else:
                walk(val, fields[k], path + '.' + k)
        return
    if t == 'array':
        if not isinstance(data, list):
            return
        members = members_of(tn.get('of'))
        for i, item in enumerate(data):
            walk(item, match_member(item, members), '%s[%d]' % (path, i))
        return
    # string/number/boolean/union(of literals)/reference -> leaf, stop

PID = 'swlg6klq'
for did in ['siteSettings', 'navigation', 'landingPage']:
    q = urllib.parse.quote('*[_id=="%s"][0]' % did)
    url = 'https://%s.apicdn.sanity.io/v2024-01-01/data/query/production?query=%s' % (PID, q)
    doc = json.load(urllib.request.urlopen(url))['result']
    if not doc:
        print('!! %s: no document' % did); continue
    walk(doc, byName.get(doc['_type']), did)

print('=== UNKNOWN FIELDS (data present, schema does not declare) ===')
if not unknowns:
    print('(none — dataset fully matches schema)')
for u in unknowns:
    print(' ', u)
print('total:', len(unknowns))
