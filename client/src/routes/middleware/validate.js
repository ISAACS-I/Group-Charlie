function Validation() {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', pwd: '', phone: '', country: '', bio: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
 
  const rules = {
    fname: { req: true, min: 2, label: 'First name' },
    lname: { req: true, min: 2, label: 'Last name' },
    email: { req: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' },
    pwd: { req: true, min: 8, label: 'Password' },
    phone: { req: false, pattern: /^[+\d\s\-().]{7,20}$/, label: 'Phone' },
    country: { req: true, label: 'Country' },
  };
 
  const getErr = (k) => {
    const r = rules[k]; if (!r) return '';
    const v = form[k].trim();
    if (r.req && !v) return `${r.label} is required`;
    if (v && r.min && v.length < r.min) return `${r.label} must be at least ${r.min} characters`;
    if (v && r.pattern && !r.pattern.test(v)) return `${r.label} format is invalid`;
    return '';
  };
 
  const allErrors = Object.keys(rules).map(k => getErr(k)).filter(Boolean);
  const showErr = (k) => (touched[k] || submitted) && getErr(k);
 
  const pwdScore = () => {
    const v = form.pwd;
    let s = 0;
    if (v.length >= 8) s++; if (v.length >= 12) s++;
    if (/[A-Z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  };
  const score = pwdScore();
  const strengthInfo = [
    { label: '—', color: 'var(--border2)' },
    { label: 'Weak', color: 'var(--red)' },
    { label: 'Fair', color: 'var(--amber)' },
    { label: 'Good', color: 'var(--amber)' },
    { label: 'Strong', color: 'var(--green)' },
    { label: 'Very strong', color: 'var(--green)' },
  ][score];
 
  const handleSubmit = () => {
    setSubmitted(true);
    if (allErrors.length === 0) {
      setTimeout(() => setSuccess(true), 300);
    }
  };
 
  if (success) return (
    <div className="page">
      <h1 className="page-title">Validation & error handling</h1>
      <div className="alert alert-ok" style={{ marginTop: 16 }}>
        <div className="alert-title">Account created successfully!</div>
        Welcome aboard. A confirmation email has been sent.
      </div>
      <button className="btn" onClick={() => { setSuccess(false); setSubmitted(false); setTouched({}); setForm({ fname:'',lname:'',email:'',pwd:'',phone:'',country:'',bio:'' }); }}>
        Start over
      </button>
    </div>
  );
 
  return (
    <div className="page">
      <h1 className="page-title">Validation & error handling</h1>
      <p className="page-sub">Live inline validation, password strength meter, error summaries, and contextual feedback.</p>
 
      {submitted && allErrors.length > 0 && (
        <div className="alert alert-err">
          <div className="alert-title">Please fix the following errors</div>
          <ul>{allErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
 
      <div className="card">
        <div className="field-row">
          {['fname','lname'].map(k => (
            <div className="field" key={k}>
              <label>{k === 'fname' ? 'First name' : 'Last name'}<span className="req">*</span></label>
              <input
                type="text"
                className={showErr(k) ? 'err' : form[k] && !getErr(k) ? 'ok' : ''}
                value={form[k]}
                placeholder={k === 'fname' ? 'Jane' : 'Doe'}
                onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                onBlur={() => setTouched(p => ({ ...p, [k]: true }))}
              />
              {showErr(k) && <div className="field-err"><Icon name="alert" size={13} />{showErr(k)}</div>}
            </div>
          ))}
        </div>
 
        <div className="field">
          <label>Email address<span className="req">*</span></label>
          <input
            type="email"
            className={showErr('email') ? 'err' : form.email && !getErr('email') ? 'ok' : ''}
            value={form.email}
            placeholder="jane@example.com"
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            onBlur={() => setTouched(p => ({ ...p, email: true }))}
          />
          {showErr('email') && <div className="field-err"><Icon name="alert" size={13} />{showErr('email')}</div>}
          {form.email && !getErr('email') && <div className="field-ok">Valid email address</div>}
        </div>
 
        <div className="field">
          <label>Password<span className="req">*</span></label>
          <input
            type="password"
            className={showErr('pwd') ? 'err' : ''}
            value={form.pwd}
            placeholder="Minimum 8 characters"
            onChange={e => setForm(p => ({ ...p, pwd: e.target.value }))}
            onBlur={() => setTouched(p => ({ ...p, pwd: true }))}
          />
          {form.pwd && (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 3, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(score/5)*100}%`, background: strengthInfo.color, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
              </div>
              <div style={{ fontSize: 11, color: strengthInfo.color, marginTop: 4 }}>Strength: {strengthInfo.label}</div>
            </div>
          )}
          {showErr('pwd') && <div className="field-err"><Icon name="alert" size={13} />{showErr('pwd')}</div>}
        </div>
 
        <div className="field-row">
          <div className="field">
            <label>Phone</label>
            <input type="tel" className={showErr('phone') ? 'err' : ''} value={form.phone} placeholder="+267 71 234 567"
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              onBlur={() => setTouched(p => ({ ...p, phone: true }))} />
            {showErr('phone') && <div className="field-err"><Icon name="alert" size={13} />{showErr('phone')}</div>}
            {!showErr('phone') && <div className="field-hint">Optional</div>}
          </div>
          <div className="field">
            <label>Country<span className="req">*</span></label>
            <select className={showErr('country') ? 'err' : form.country ? 'ok' : ''} value={form.country}
              onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
              onBlur={() => setTouched(p => ({ ...p, country: true }))}>
              <option value="">Select...</option>
              {['Botswana','South Africa','Kenya','Nigeria','United States','United Kingdom','Other'].map(c => <option key={c}>{c}</option>)}
            </select>
            {showErr('country') && <div className="field-err"><Icon name="alert" size={13} />{showErr('country')}</div>}
          </div>
        </div>
 
        <div className="field">
          <label>Bio</label>
          <textarea rows={3} maxLength={200} value={form.bio} placeholder="Tell us a little about yourself..."
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
          <div style={{ fontSize: 11, textAlign: 'right', marginTop: 3, color: form.bio.length > 180 ? 'var(--amber)' : 'var(--text3)' }}>
            {form.bio.length} / 200
          </div>
        </div>
 
        <button className="btn btn-primary" onClick={handleSubmit}>Create account</button>
      </div>
    </div>
  );
}