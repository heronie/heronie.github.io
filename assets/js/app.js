/* ============================================================
   Hero 冯生 · 个人品牌站
   原生 JS，无依赖
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     ① 表单收件地址
     ----------------------------------------------------------
     不用改这里。去 index.html 找 <meta name="form-endpoint"> 那一行填。
     留空 = 预览模式：能填、能校验，但不会真的发出去。
  ---------------------------------------------------------- */
  var metaEndpoint = document.querySelector('meta[name="form-endpoint"]');
  var FORM_ENDPOINT = metaEndpoint ? (metaEndpoint.getAttribute('content') || '').trim() : '';

  /* ② 年份 */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ③ 吸顶条 */
  var bar = document.getElementById('topbar');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 460) bar.classList.add('on');
      else bar.classList.remove('on');
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ④ 滚动揭示 */
  var rvs = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rvs.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 5, 4) * 55 + 'ms';
      io.observe(el);
    });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ⑤ 表单 */
  var form = document.getElementById('leadform');
  var done = document.getElementById('f-done');
  var doneT = document.getElementById('fd-t');
  var doneP = document.getElementById('fd-p');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function fieldOf(input) { return input.closest('.field'); }

  function mark(input, bad) {
    var f = fieldOf(input);
    if (!f) return;
    if (bad) f.classList.add('err'); else f.classList.remove('err');
  }

  if (form) {
    ['f-name', 'f-type', 'f-contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function () { mark(el, false); });
      el.addEventListener('change', function () { mark(el, false); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var name = document.getElementById('f-name');
      var type = document.getElementById('f-type');
      var contact = document.getElementById('f-contact');
      var org = document.getElementById('f-org');
      var msg = document.getElementById('f-msg');

      var firstBad = null;
      [name, type, contact].forEach(function (el) {
        var empty = !String(el.value || '').trim();
        mark(el, empty);
        if (empty && !firstBad) firstBad = el;
      });
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var payload = {
        name: name.value.trim(),
        org: org.value.trim(),
        type: type.value,
        msg: msg.value.trim(),
        contact: contact.value.trim(),
        _subject: '网站留言 · ' + name.value.trim() + ' · ' + type.value,
        _template: 'table',
        _captcha: 'false'
      };

      function finish(ok, note) {
        form.hidden = true;
        done.hidden = false;
        doneT.textContent = ok ? '已收到，我会主动联系你' : '已记录';
        doneP.textContent = note;
      }

      function reset() {
        form.hidden = false;
        done.hidden = true;
        submitBtn.disabled = false;
        submitBtn.textContent = '提交';
      }

      if (!FORM_ENDPOINT) {
        // 预览模式：只做本地留存，不假装发送成功
        try {
          var box = JSON.parse(localStorage.getItem('fx_leads') || '[]');
          box.push({ v: payload, t: new Date().toISOString() });
          localStorage.setItem('fx_leads', JSON.stringify(box));
        } catch (e) {}
        finish(false, '当前是预览模式，收件通道还没接通，这条留言没有发送出去。');
        var tip = document.createElement('p');
        tip.textContent = '接通方式见 README「让表单真的能收到留言」，只需填一个地址。';
        done.appendChild(tip);
        return;
      }

      // 本地双击打开（file://）时浏览器会拦截跨域请求，重试也没用，直接说明原因
      if (FORM_ENDPOINT && window.location.protocol === 'file:') {
        finish(false, '本地预览发不出去，这是正常的。');
        var pv = document.createElement('p');
        pv.textContent = '直接双击 index.html 打开时，浏览器会拦截表单请求。用本地服务器打开，或部署上线后，就能正常收到了。';
        done.appendChild(pv);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '发送中…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          return r.text().then(function (t) {
            var j = null;
            try { j = JSON.parse(t); } catch (e) {}
            return { ok: r.ok, status: r.status, data: j };
          });
        })
        .then(function (res) {
          var d = res.data || {};
          var failed = !res.ok || String(d.success) === 'false';
          if (failed) {
            var msg = String(d.message || d.error || '');
            var err = new Error(msg || ('HTTP ' + res.status));
            err.activation = /activat|confirm/i.test(msg);
            err.localFile = /web server|HTML file/i.test(msg);
            throw err;
          }
          finish(true, '我会尽快主动联系你。');
        })
        .catch(function (err) {
          reset();
          if (err && err.activation) {
            // 收件地址尚未激活：这是站长的配置问题，不该让访客干等
            finish(false, '留言通道还没激活，暂时发不出去。');
            var p1 = document.createElement('p');
            p1.textContent = '请站长到邮箱点一下 Formsubmit 发来的激活链接，之后就能正常收件。';
            done.appendChild(p1);
          } else if (err && err.localFile) {
            // 本地双击打开时 Formsubmit 会拒绝，属于预览限制，不是故障
            finish(false, '预览模式下发不出去，这是正常现象。');
            var p2 = document.createElement('p');
            p2.textContent = '直接双击 index.html 打开时，表单服务会拒绝接收。用本地服务器打开或部署上线后就正常了。';
            done.appendChild(p2);
          } else {
            alert('发送失败了，稍后再试一次，或者直接联系介绍你来的那位朋友。');
          }
        });
    });
  }
})();

/* ---------- 年限自动跟进（避免逐年过期） ----------
   <span data-since="2005">21</span> 会被改写为「当前年份 − 2005」。
   静态文本是兜底值：JS 未执行时仍能显示一个合理数字。 */
(function () {
  var els = document.querySelectorAll('[data-since]');
  if (!els.length) return;
  var year = new Date().getFullYear();
  for (var i = 0; i < els.length; i++) {
    var since = parseInt(els[i].getAttribute('data-since'), 10);
    if (since > 0 && year >= since) {
      els[i].textContent = String(year - since);
    }
  }
})();
