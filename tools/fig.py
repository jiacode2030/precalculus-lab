"""Tiny SVG toolkit for worked-example figures (viewBox 260 wide). Used by tools/units/*.py through mk.py.

A figure is built from a base drawing plus layers that appear with the worked-example steps:
    fig(base, [(step, svg, note, cls), ...], caption)
step k appears when step k is revealed (1 = first step). cls colors the note chip: f d dd tan area ink.
Colors follow the site's fixed roles: f blue, f′ green, f″ pink, tangent/secant orange, area gold."""
import math, html as H

C = {'f': 'var(--cx)', 'd': 'var(--cv)', 'dd': 'var(--ca)', 'tan': 'var(--hot)', 'area': 'var(--ce)',
     'ink': 'var(--ink)', 'mut': 'var(--muted)', 'line': 'var(--line)', 'sunk': 'var(--sunk)', 'surf': 'var(--surface)'}
col = lambda c: C.get(c, c)
n = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')

def txt(x, y, s, c='ink', size=12, anchor='middle', w=600, mono=False):
    fam = 'var(--f-mono)' if mono else 'var(--f-body)'
    return f'<text x="{n(x)}" y="{n(y)}" text-anchor="{anchor}" style="fill:{col(c)};font:{w} {size}px {fam}">{s}</text>'

def ln(x1, y1, x2, y2, c='ink', w=2, dash=''):
    return f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}" style="stroke:{col(c)};stroke-width:{w};stroke-linecap:round' + (f';stroke-dasharray:{dash}' if dash else '') + '"/>'

def arr(x1, y1, x2, y2, c='tan', lab='', w=2.4, off=(0, 0), size=12):
    L = math.hypot(x2 - x1, y2 - y1) or 1; ux, uy = (x2 - x1) / L, (y2 - y1) / L; h = 8
    s = ln(x1, y1, x2 - ux * h * .7, y2 - uy * h * .7, c, w)
    s += f'<polygon points="{n(x2)},{n(y2)} {n(x2 - ux * h - uy * h * .55)},{n(y2 - uy * h + ux * h * .55)} {n(x2 - ux * h + uy * h * .55)},{n(y2 - uy * h - ux * h * .55)}" style="fill:{col(c)}"/>'
    if lab: s += txt(x2 + ux * 13 + off[0], y2 + uy * 13 + 4 + off[1], lab, c, size)
    return s

def poly(pts, fill='area', op=.35, stroke='', w=1.5, dash=''):
    st = f'fill:{col(fill)};fill-opacity:{op}' + (f';stroke:{col(stroke)};stroke-width:{w};stroke-linejoin:round' if stroke else ';stroke:none') + (f';stroke-dasharray:{dash}' if dash else '')
    return '<polygon points="' + ' '.join(f'{n(a)},{n(b)}' for a, b in pts) + f'" style="{st}"/>'

def pline(pts, c='f', w=2.6, dash=''):
    return '<polyline points="' + ' '.join(f'{n(a)},{n(b)}' for a, b in pts) + f'" style="fill:none;stroke:{col(c)};stroke-width:{w};stroke-linejoin:round;stroke-linecap:round' + (f';stroke-dasharray:{dash}' if dash else '') + '"/>'

def rect(x, y, w, h, fill='area', op=.35, stroke='', sw=1.2, rx=0):
    return f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="{rx}" style="fill:{col(fill)};fill-opacity:{op}' + (f';stroke:{col(stroke)};stroke-width:{sw}' if stroke else '') + '"/>'

def circ(x, y, r, fill='ink', op=1, stroke='', sw=2):
    return f'<circle cx="{n(x)}" cy="{n(y)}" r="{n(r)}" style="fill:{col(fill)};fill-opacity:{op}' + (f';stroke:{col(stroke)};stroke-width:{sw}' if stroke else '') + '"/>'

def ell(x, y, rx, ry, fill='area', op=.3, stroke='', sw=1.6, dash=''):
    return f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(rx)}" ry="{n(ry)}" style="fill:{col(fill)};fill-opacity:{op}' + (f';stroke:{col(stroke)};stroke-width:{sw}' if stroke else '') + (f';stroke-dasharray:{dash}' if dash else '') + '"/>'

def dot(x, y, lab='', c='ink', dx=0, dy=-9, r=4, size=11):
    return circ(x, y, r, c) + (txt(x + dx, y + dy, lab, c, size) if lab else '')

def person(x, y, h, c='ink'):
    """Stick figure standing at (x, y) (feet), h pixels tall."""
    hd = h * .13; s = ''
    s += circ(x, y - h + hd, hd, 'surf', 1, c, 2)
    s += ln(x, y - h + 2 * hd, x, y - h * .42, c, 2.4) + ln(x, y - h * .42, x - h * .14, y, c, 2.4) + ln(x, y - h * .42, x + h * .14, y, c, 2.4)
    s += ln(x, y - h * .72, x - h * .16, y - h * .52, c, 2.2) + ln(x, y - h * .72, x + h * .16, y - h * .52, c, 2.2)
    return s

class Plot:
    """Maps math coordinates into the box (x, y, w, h) in SVG pixels."""
    def __init__(s, xr, yr, box=(30, 12, 220, 190)):
        s.xr, s.yr, s.box = xr, yr, box
    def X(s, x): bx, by, bw, bh = s.box; return bx + (x - s.xr[0]) / (s.xr[1] - s.xr[0]) * bw
    def Y(s, y): bx, by, bw, bh = s.box; return by + bh - (y - s.yr[0]) / (s.yr[1] - s.yr[0]) * bh
    def axes(s, xt=(), yt=(), xl='x', yl='y', grid=False):
        o = ''; x0 = min(max(0, s.xr[0]), s.xr[1]); y0 = min(max(0, s.yr[0]), s.yr[1])
        if grid:
            for t in xt: o += ln(s.X(t), s.Y(s.yr[0]), s.X(t), s.Y(s.yr[1]), 'line', 1)
            for t in yt: o += ln(s.X(s.xr[0]), s.Y(t), s.X(s.xr[1]), s.Y(t), 'line', 1)
        o += arr(s.X(s.xr[0]), s.Y(y0), s.X(s.xr[1]) + 6, s.Y(y0), 'mut', '', 1.4)
        o += arr(s.X(x0), s.Y(s.yr[0]), s.X(x0), s.Y(s.yr[1]) - 6, 'mut', '', 1.4)
        for t in xt: o += ln(s.X(t), s.Y(y0) - 3, s.X(t), s.Y(y0) + 3, 'mut', 1.2) + txt(s.X(t), s.Y(y0) + 14, ticklab(t), "mut", 10, mono=True, w=500)
        for t in yt: o += ln(s.X(x0) - 3, s.Y(t), s.X(x0) + 3, s.Y(t), 'mut', 1.2) + txt(s.X(x0) - 6, s.Y(t) + 3.5, ticklab(t), 'mut', 10, 'end', mono=True, w=500)
        if xl: o += txt(s.X(s.xr[1]) + 2, s.Y(y0) - 7, xl, 'mut', 11, 'end', 500)
        if yl: o += txt(s.X(x0) + 7, s.Y(s.yr[1]) + 4, yl, 'mut', 11, 'start', 500)
        return o
    def pts(s, f, a, b, k=80):
        return [(s.X(a + (b - a) * i / k), s.Y(f(a + (b - a) * i / k))) for i in range(k + 1)]
    def curve(s, f, a, b, c='f', w=2.6, dash='', k=80):
        return pline(s.pts(f, a, b, k), c, w, dash)
    def between(s, f, g, a, b, c='area', op=.35, k=80):
        return poly(s.pts(f, a, b, k) + s.pts(g, a, b, k)[::-1], c, op)
    def under(s, f, a, b, c='area', op=.35, k=80):
        return s.between(f, lambda x: 0, a, b, c, op, k)
    def seg(s, x1, y1, x2, y2, c='tan', w=2.2, dash=''):
        return ln(s.X(x1), s.Y(y1), s.X(x2), s.Y(y2), c, w, dash)
    def dot(s, x, y, lab_='', c='ink', dx=0, dy=-9, r=4):
        return dot(s.X(x), s.Y(y), lab_, c, dx, dy, r)
    def box_(s, x0, x1, h, c='area', op=.35):
        return rect(s.X(x0), min(s.Y(0), s.Y(h)), s.X(x1) - s.X(x0), abs(s.Y(h) - s.Y(0)), c, op, c, 1.2)
    def text(s, x, y, t, c='ink', size=12, anchor='middle', w=600):
        return txt(s.X(x), s.Y(y), t, c, size, anchor, w)

def ticklab(t):
    if abs(t - round(t)) < 1e-9: return str(int(round(t))).replace('-', '−')
    return n(t).replace('-', '−')

def fig(base, layers, cap, h=230):
    """Returns the HTML of a step-linked figure. layers: (step, svg, note, cls)."""
    g = ''.join(f'<g data-s="{k}" hidden>{frag}</g>' for k, frag, _, _ in layers if frag)
    notes = ''.join(f'<span class="{c}" data-s="{k}" hidden>{t}</span>' for k, _, t, c in layers if t)
    return (f'<figure class="fbdfig"><div class="stepfig"><svg viewBox="0 0 260 {h}" role="img" aria-label="{H.escape(cap, quote=True)}">{base}{g}</svg>'
            + (f'<div class="fbdnotes">{notes}</div>' if notes else '') + f'</div><figcaption>{cap}</figcaption></figure>')
