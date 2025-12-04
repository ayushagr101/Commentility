(function () {
  async function postJson(url, body, token) {
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(url, opts);
    return res.json();
  }

  function out(msg) {
    const el = document.getElementById('out');
    if (typeof msg === 'object') el.innerText = JSON.stringify(msg, null, 2);
    else el.innerText = String(msg);
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const body = { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') };
      const res = await postJson('/api/auth/register', body);
      out(res);
      if (res.token) localStorage.setItem('token', res.token);
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const body = { email: fd.get('email'), password: fd.get('password') };
      const res = await postJson('/api/auth/login', body);
      out(res);
      if (res.token) localStorage.setItem('token', res.token);
    });
  }

  // quick helper to call /me
  window.getMe = async function () {
    const token = localStorage.getItem('token');
    if (!token) return out('No token stored');
    const res = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    out(await res.json());
  };
})();
