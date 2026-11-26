/* Turtlebox charts, draft v0.1. A small SVG and HTML chart kit with no dependencies.
   Colors come from CSS variables: --s1 --s2 --s3 (series), --grid, --axis, --ink, --body, --muted, --surface, --line, --hover.
   Every chart redraws when its container changes width. Labels are inserted with textContent only. */
(function (g) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (text != null) e.textContent = text;
    return e;
  }
  function se(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function niceStep(range, n) {
    var raw = range / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / mag;
    return (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag;
  }
  function ticks(min, max, n) {
    var st = niceStep((max - min) || 1, n || 4), a = Math.floor(min / st) * st, b = Math.ceil(max / st) * st, out = [];
    for (var v = a; v <= b + st / 2; v += st) out.push(Math.round(v / st) * st);
    return out;
  }
  function money(v) {
    var a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(a >= 1e7 ? 0 : 2).replace(/\.?0+$/, '') + 'M';
    return s + '$' + Math.round(a).toLocaleString('en-US');
  }
  function compact(v) {
    var a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(a % 1e3 ? 1 : 0).replace(/\.0$/, '') + 'K';
    return s + '$' + Math.round(a);
  }
  /* One style per axis: full numbers under 10,000, compact on an axis that reaches it. */
  function axisFmt(top) { return top >= 1e4 ? compact : function (v) { return '$' + Math.round(v).toLocaleString('en-US'); }; }

  function mount(root, draw) {
    root.classList.add('tb-chart');
    if (root._ro) { root._ro.disconnect(); root._ro = null; }
    var last = 0;
    function run() { var w = Math.floor(root.clientWidth); if (!w) return; last = w; draw(w); }
    run();
    if (g.ResizeObserver) {
      root._ro = new ResizeObserver(function () { if (Math.floor(root.clientWidth) !== last) run(); });
      root._ro.observe(root);
    }
    return { redraw: run };
  }

  function legend(root, series, kind, left) {
    var l = el('div', { class: 'tb-legend' });
    l.style.marginLeft = (left == null ? 46 : left) + 'px';
    series.forEach(function (s) {
      var item = el('span');
      var k = el('i', { class: kind === 'line' ? 'line' : '' });
      k.style.background = s.color;
      item.appendChild(k);
      item.appendChild(document.createTextNode(s.name));
      l.appendChild(item);
    });
    root.appendChild(l);
  }

  function tooltip(root) {
    var t = el('div', { class: 'tb-tip', role: 'status' });
    t.hidden = true;
    root.appendChild(t);
    return {
      show: function (x, y, head, rows) {
        t.textContent = '';
        t.appendChild(el('div', { class: 'tb-tip-h' }, head));
        rows.forEach(function (r) {
          var row = el('div', { class: 'tb-tip-r' });
          var k = el('i', { class: 'tb-key' });
          k.style.background = r.color;
          row.appendChild(k);
          row.appendChild(el('b', null, r.value));
          row.appendChild(el('span', null, r.name));
          t.appendChild(row);
        });
        t.hidden = false;
        var w = t.offsetWidth, h = t.offsetHeight, rw = root.clientWidth;
        var left = x + 14; if (left + w > rw) left = x - w - 14; if (left < 0) left = 0;
        var top = Math.max(0, Math.min(y - h / 2, root.clientHeight - h));
        t.style.left = left + 'px'; t.style.top = top + 'px';
      },
      hide: function () { t.hidden = true; }
    };
  }

  function frame(svg, o) {
    /* gridlines, y labels, baseline; returns nothing. o: pl, pr, pt, ih, W, tk, y, af */
    o.tk.forEach(function (t) {
      svg.appendChild(se('line', { x1: o.pl, x2: o.W - o.pr, y1: o.y(t), y2: o.y(t), style: 'stroke:var(--grid);stroke-width:1' }));
      var tx = se('text', { x: o.pl - 8, y: o.y(t) + 4, 'text-anchor': 'end', style: 'font-size:11px;fill:var(--muted)' });
      tx.textContent = o.af(t);
      svg.appendChild(tx);
    });
  }
  function xlabels(svg, cats, xs, W, H, pl, pr) {
    var maxLen = 0; cats.forEach(function (c) { if (String(c).length > maxLen) maxLen = String(c).length; });
    var band = (W - pl - pr) / Math.max(1, cats.length - 1 || 1);
    var step = Math.max(1, Math.ceil((maxLen * 6.4 + 12) / (cats.length > 1 ? xs(1) - xs(0) : band)));
    for (var i = cats.length - 1; i >= 0; i -= step) {
      var tx = se('text', { x: xs(i), y: H - 6, 'text-anchor': 'middle', style: 'font-size:11px;fill:var(--muted)' });
      tx.textContent = cats[i];
      svg.appendChild(tx);
    }
  }

  /* Grouped columns. o: cats[], series[{name,color,values}], height, label */
  function columns(root, o) {
    var H = o.height || 220;
    return mount(root, function (W) {
      root.textContent = '';
      if (o.series.length > 1) legend(root, o.series, 'rect');
      var pl = 46, pr = 8, pt = 8, pb = 22, iw = W - pl - pr, ih = H - pt - pb, max = 0;
      o.series.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
      var tk = ticks(0, max, 4), top = tk[tk.length - 1] || 1;
      var y = function (v) { return pt + ih - v / top * ih; };
      var svg = se('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': o.label || 'Chart' });
      frame(svg, { pl: pl, pr: pr, pt: pt, ih: ih, W: W, tk: tk, y: y, af: axisFmt(top) });
      var n = o.cats.length, band = iw / n, S = o.series.length;
      var hl = se('rect', { y: pt, height: ih, width: band, style: 'fill:var(--hover);opacity:.7', visibility: 'hidden' });
      svg.appendChild(hl);
      var bw = Math.min(16, (band * 0.72 - 2 * (S - 1)) / S), gw = S * bw + 2 * (S - 1);
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < S; j++) {
          var v = o.series[j].values[i], h = v / top * ih;
          if (!(h > 0)) continue;
          var x = pl + i * band + (band - gw) / 2 + j * (bw + 2), y0 = pt + ih, yy = y0 - h, r = Math.min(4, h, bw / 2);
          svg.appendChild(se('path', { d: 'M' + x + ',' + y0 + 'L' + x + ',' + (yy + r) + 'Q' + x + ',' + yy + ' ' + (x + r) + ',' + yy + 'L' + (x + bw - r) + ',' + yy + 'Q' + (x + bw) + ',' + yy + ' ' + (x + bw) + ',' + (yy + r) + 'L' + (x + bw) + ',' + y0 + 'Z', style: 'fill:' + o.series[j].color }));
        }
      }
      svg.appendChild(se('line', { x1: pl, x2: W - pr, y1: y(0), y2: y(0), style: 'stroke:var(--axis);stroke-width:1' }));
      xlabels(svg, o.cats, function (i) { return pl + i * band + band / 2; }, W, H, pl, pr);
      var tip = tooltip(root);
      var ov = se('rect', { x: pl, y: pt, width: iw, height: ih, fill: 'transparent', style: 'cursor:crosshair' });
      ov.addEventListener('pointermove', function (e) {
        var b = svg.getBoundingClientRect(), px = e.clientX - b.left, i = Math.max(0, Math.min(n - 1, Math.floor((px - pl) / band)));
        hl.setAttribute('x', pl + i * band); hl.setAttribute('visibility', 'visible');
        tip.show(pl + i * band + band / 2, e.clientY - b.top + 0, (o.heads || o.cats)[i], o.series.map(function (s) { return { name: s.name, color: s.color, value: money(s.values[i]) }; }));
      });
      ov.addEventListener('pointerleave', function () { hl.setAttribute('visibility', 'hidden'); tip.hide(); });
      svg.appendChild(ov);
      root.appendChild(svg);
    });
  }

  /* Lines with optional area wash, bands, end label and crosshair.
     o: cats[], series[{name,color,values}], height, area, bands[{lo,hi,opacity,color}], endLabel, zero, heads[], tip(i) */
  function line(root, o) {
    var H = o.height || 220;
    return mount(root, function (W) {
      root.textContent = '';
      if (o.series.length > 1) legend(root, o.series, 'line');
      var pl = 46, pr = o.endLabel ? 64 : 14, pt = 10, pb = 22, iw = W - pl - pr, ih = H - pt - pb, n = o.cats.length;
      var min = o.zero ? 0 : Infinity, max = -Infinity;
      function eat(v) { if (v < min) min = v; if (v > max) max = v; }
      o.series.forEach(function (s) { s.values.forEach(eat); });
      (o.bands || []).forEach(function (b) { b.lo.forEach(eat); b.hi.forEach(eat); });
      var tk = ticks(min, max, 4), lo = tk[0], top = tk[tk.length - 1] || 1;
      var y = function (v) { return pt + ih - (v - lo) / (top - lo) * ih; };
      var x = function (i) { return pl + (n > 1 ? i / (n - 1) : 0.5) * iw; };
      var svg = se('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': o.label || 'Chart' });
      frame(svg, { pl: pl, pr: pr, pt: pt, ih: ih, W: W, tk: tk, y: y, af: axisFmt(Math.max(Math.abs(lo), Math.abs(top))) });
      svg.appendChild(se('line', { x1: pl, x2: W - pr, y1: y(lo), y2: y(lo), style: 'stroke:var(--axis);stroke-width:1' }));
      (o.bands || []).forEach(function (b) {
        var d = 'M' + x(0) + ',' + y(b.hi[0]);
        for (var i = 1; i < n; i++) d += 'L' + x(i) + ',' + y(b.hi[i]);
        for (var k = n - 1; k >= 0; k--) d += 'L' + x(k) + ',' + y(b.lo[k]);
        svg.appendChild(se('path', { d: d + 'Z', style: 'fill:' + (b.color || 'var(--s1)') + ';opacity:' + (b.opacity || 0.1) }));
      });
      o.series.forEach(function (s, si) {
        var d = '';
        s.values.forEach(function (v, i) { d += (i ? 'L' : 'M') + x(i) + ',' + y(v); });
        if (o.area && si === 0) svg.appendChild(se('path', { d: d + 'L' + x(n - 1) + ',' + y(lo) + 'L' + x(0) + ',' + y(lo) + 'Z', style: 'fill:' + s.color + ';opacity:.1' }));
        svg.appendChild(se('path', { d: d, style: 'fill:none;stroke:' + s.color + ';stroke-width:2;stroke-linejoin:round;stroke-linecap:round' }));
        var lx = x(n - 1), ly = y(s.values[n - 1]);
        svg.appendChild(se('circle', { cx: lx, cy: ly, r: 4, style: 'fill:' + s.color + ';stroke:var(--surface);stroke-width:2' }));
        if (o.endLabel && si === 0) {
          var t = se('text', { x: lx + 10, y: ly + 4, style: 'font-size:12px;font-weight:600;fill:var(--ink)' });
          t.textContent = compact(s.values[n - 1]);
          svg.appendChild(t);
        }
      });
      xlabels(svg, o.cats, x, W, H, pl, pr);
      var cross = se('line', { y1: pt, y2: pt + ih, style: 'stroke:var(--axis);stroke-width:1', visibility: 'hidden' });
      svg.appendChild(cross);
      var dots = o.series.map(function (s) { var c = se('circle', { r: 4, visibility: 'hidden', style: 'fill:' + s.color + ';stroke:var(--surface);stroke-width:2' }); svg.appendChild(c); return c; });
      var tip = tooltip(root);
      var ov = se('rect', { x: pl, y: pt, width: iw, height: ih, fill: 'transparent', style: 'cursor:crosshair' });
      ov.addEventListener('pointermove', function (e) {
        var b = svg.getBoundingClientRect(), px = e.clientX - b.left;
        var i = Math.max(0, Math.min(n - 1, Math.round((px - pl) / iw * (n - 1))));
        cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
        dots.forEach(function (c, si) { c.setAttribute('cx', x(i)); c.setAttribute('cy', y(o.series[si].values[i])); c.setAttribute('visibility', 'visible'); });
        var t = o.tip ? o.tip(i) : { head: (o.heads || o.cats)[i], rows: o.series.map(function (s) { return { name: s.name, color: s.color, value: money(s.values[i]) }; }) };
        tip.show(x(i), e.clientY - b.top, t.head, t.rows);
      });
      ov.addEventListener('pointerleave', function () { cross.setAttribute('visibility', 'hidden'); dots.forEach(function (c) { c.setAttribute('visibility', 'hidden'); }); tip.hide(); });
      svg.appendChild(ov);
      root.appendChild(svg);
    });
  }

  /* Horizontal bars as HTML. o: items[{name,value}], total */
  function hbars(root, o) {
    root.classList.add('tb-hbars'); root.textContent = '';
    var max = 0, total = o.total || 0;
    o.items.forEach(function (it) { if (it.value > max) max = it.value; if (!o.total) total += it.value; });
    o.items.forEach(function (it) {
      var row = el('div', { class: 'tb-hrow' });
      row.appendChild(el('span', { class: 'tb-hname' }, it.name));
      var track = el('div', { class: 'tb-htrack' }), bar = el('i', { class: 'tb-hbar' });
      bar.style.width = (max ? it.value / max * 100 : 0) + '%';
      track.appendChild(bar); row.appendChild(track);
      var val = el('b', { class: 'tb-hval' }, money(it.value));
      val.appendChild(el('small', null, ' ' + Math.round(total ? it.value / total * 100 : 0) + '%'));
      row.appendChild(val);
      root.appendChild(row);
    });
  }

  /* Sparkline. values[], color */
  function spark(root, values, color) {
    root.textContent = '';
    var W = 120, H = 30, p = 6, min = Math.min.apply(null, values), max = Math.max.apply(null, values), n = values.length;
    var x = function (i) { return p + (n > 1 ? i / (n - 1) : 0.5) * (W - 2 * p); };
    var y = function (v) { return H - p - (max === min ? 0.5 : (v - min) / (max - min)) * (H - 2 * p); };
    var svg = se('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
    var d = ''; values.forEach(function (v, i) { d += (i ? 'L' : 'M') + x(i) + ',' + y(v); });
    svg.appendChild(se('path', { d: d, style: 'fill:none;stroke:' + (color || 'var(--s1)') + ';stroke-width:2;stroke-linejoin:round;stroke-linecap:round' }));
    svg.appendChild(se('circle', { cx: x(n - 1), cy: y(values[n - 1]), r: 4, style: 'fill:' + (color || 'var(--s1)') + ';stroke:var(--surface);stroke-width:2' }));
    root.appendChild(svg);
  }

  /* Overview with a draggable time window. o: values[], start, len, height, onChange(start) */
  function navigator(root, o) {
    var H = o.height || 56, api = {}, apply = function () {};
    var m = mount(root, function (W) {
      root.textContent = '';
      var pl = 46, pr = 14, pt = 6, pb = 6, iw = W - pl - pr, ih = H - pt - pb, n = o.values.length;
      var min = Math.min.apply(null, o.values), max = Math.max.apply(null, o.values);
      var x = function (i) { return pl + (n > 1 ? i / (n - 1) : 0.5) * iw; };
      var y = function (v) { return pt + ih - (v - min) / ((max - min) || 1) * ih; };
      var svg = se('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'slider', tabindex: '0', 'aria-label': 'Time window. Use the arrow keys to move it.' });
      var d = ''; o.values.forEach(function (v, i) { d += (i ? 'L' : 'M') + x(i) + ',' + y(v); });
      svg.appendChild(se('path', { d: d + 'L' + x(n - 1) + ',' + (pt + ih) + 'L' + x(0) + ',' + (pt + ih) + 'Z', style: 'fill:var(--s1);opacity:.1' }));
      svg.appendChild(se('path', { d: d, style: 'fill:none;stroke:var(--muted);stroke-width:1.5;stroke-linejoin:round' }));
      var win = se('rect', { y: 1, height: H - 2, rx: 4, style: 'fill:var(--s1);fill-opacity:.16;stroke:var(--s1);stroke-width:1.5;cursor:grab' });
      svg.appendChild(win);
      apply = function () {
        var a = x(o.start), b = x(Math.min(n - 1, o.start + o.len - 1));
        win.setAttribute('x', a); win.setAttribute('width', Math.max(6, b - a));
      };
      apply();
      function move(e) {
        var r = svg.getBoundingClientRect(), i = Math.round((e.clientX - r.left - pl) / iw * (n - 1));
        set(i - Math.floor(o.len / 2));
      }
      function set(s) {
        s = Math.max(0, Math.min(n - o.len, s));
        if (s === o.start) return;
        o.start = s; apply(); if (o.onChange) o.onChange(s);
      }
      svg.addEventListener('pointerdown', function (e) { svg.setPointerCapture(e.pointerId); move(e); svg._drag = true; });
      svg.addEventListener('pointermove', function (e) { if (svg._drag) move(e); });
      svg.addEventListener('pointerup', function () { svg._drag = false; });
      svg.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowLeft') { set(o.start - 1); ev.preventDefault(); }
        if (ev.key === 'ArrowRight') { set(o.start + 1); ev.preventDefault(); }
      });
      root.appendChild(svg);
    });
    api.set = function (start, len) { o.start = start; o.len = len; apply(); };
    api.redraw = m.redraw;
    return api;
  }

  /* Table view of the same data. o: cats[], series[{name,values}], first (column heading) */
  function table(root, o) {
    if (root._ro) { root._ro.disconnect(); root._ro = null; }
    root.classList.remove('tb-chart'); root.textContent = '';
    var t = el('table', { class: 'tb-table' });
    var head = el('tr'); head.appendChild(el('th', null, o.first || 'Period'));
    o.series.forEach(function (s) { head.appendChild(el('th', null, s.name)); });
    t.appendChild(head);
    o.cats.forEach(function (c, i) {
      var r = el('tr'); r.appendChild(el('td', null, (o.heads || o.cats)[i]));
      o.series.forEach(function (s) { r.appendChild(el('td', null, money(s.values[i]))); });
      t.appendChild(r);
    });
    var wrap = el('div', { class: 'tb-tablewrap' }); wrap.appendChild(t); root.appendChild(wrap);
  }

  g.TBChart = { columns: columns, line: line, hbars: hbars, spark: spark, navigator: navigator, table: table, money: money, compact: compact };
})(window);
