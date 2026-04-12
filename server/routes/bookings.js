const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
 
function Bookings() {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [selDate, setSelDate] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
 
  const getSlotStates = (date) => {
    if (!date) return {};
    const seed = date.getDate() * 7 + date.getMonth() * 13;
    const states = {};
    SLOTS.forEach((s, i) => {
      const r = (seed * (i + 3)) % 17;
      if (r < 4) states[s] = 'booked';
      else if (r < 6) states[s] = 'few';
      else states[s] = 'avail';
    });
    return states;
  };
 
  const slotStates = getSlotStates(selDate);
 
  const changeMonth = (d) => {
    let nm = vm + d, ny = vy;
    if (nm > 11) { nm = 0; ny++; } if (nm < 0) { nm = 11; ny--; }
    setVm(nm); setVy(ny); setSelDate(null); setSelSlot(null);
  };
 
  const first = new Date(vy, vm, 1).getDay();
  const days = new Date(vy, vm + 1, 0).getDate();
 
  const confirm = () => {
    if (!selDate || !selSlot || !name || !email) return;
    setConfirmed(true);
  };
 
  if (confirmed) return (
    <div className="page">
      <h1 className="page-title">Bookings</h1>
      <div className="alert alert-ok">
        <div className="alert-title">Booking confirmed!</div>
        Your consultation on {MONTHS[selDate.getMonth()]} {selDate.getDate()} at {selSlot} is confirmed. Sent to {email}.
      </div>
      <button className="btn" onClick={() => { setConfirmed(false); setSelDate(null); setSelSlot(null); setName(''); setEmail(''); }}>
        Make another booking
      </button>
    </div>
  );
 
  return (
    <div className="page">
      <h1 className="page-title">Bookings</h1>
      <p className="page-sub">Pick a date, select a time slot, and confirm your session.</p>
 
      <div className="book-grid">
        <div>
          <div className="card">
            <div className="cal-header">
              <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
              <span className="cal-month">{MONTHS[vm]} {vy}</span>
              <button className="cal-nav-btn" onClick={() => changeMonth(1)}>›</button>
            </div>
            <div className="cal-grid">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="cal-dow">{d}</div>)}
              {Array.from({ length: first }, (_, i) => <div key={'e'+i} className="cal-day emp" />)}
              {Array.from({ length: days }, (_, i) => {
                const d = i + 1;
                const date = new Date(vy, vm, d);
                const isToday = date.toDateString() === now.toDateString();
                const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const isWknd = date.getDay() === 0 || date.getDay() === 6;
                const isSel = selDate && date.toDateString() === selDate.toDateString();
                let cls = 'cal-day';
                if (isPast || isWknd) cls += ' dis';
                else { if (isToday) cls += ' today'; if (isSel) cls += ' sel'; }
                return (
                  <div key={d} className={cls} onClick={() => { if (!isPast && !isWknd) { setSelDate(date); setSelSlot(null); } }}>
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
 
          <div className="card" style={{ marginTop: 12 }}>
            <div className="card-title">{selDate ? `${MONTHS[selDate.getMonth()]} ${selDate.getDate()} — available times` : 'Available times'}</div>
            {!selDate ? (
              <div className="empty-msg">Select a date to view times</div>
            ) : (
              <div className="slots-grid">
                {SLOTS.map(s => {
                  const st = slotStates[s];
                  let cls = 'slot';
                  if (st === 'booked') cls += ' booked';
                  else if (st === 'few') cls += ' few';
                  if (selSlot === s) cls += ' sel';
                  return (
                    <div key={s} className={cls} onClick={() => st !== 'booked' && setSelSlot(s)}>
                      {s}
                      {st === 'few' && <span className="slot-note">Few left</span>}
                      {st === 'booked' && <span className="slot-note">Booked</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
 
        <div>
          <div className="card">
            <div className="card-title">Booking summary</div>
            <div className="sum-rows">
              <div className="sum-row"><span className="lbl">Service</span><span className="val">Consultation (60 min)</span></div>
              <div className="sum-row"><span className="lbl">Date</span><span className="val">{selDate ? `${MONTHS[selDate.getMonth()]} ${selDate.getDate()}, ${vy}` : '—'}</span></div>
              <div className="sum-row"><span className="lbl">Time</span><span className="val">{selSlot || '—'}</span></div>
              <div className="sum-row"><span className="lbl">Fee</span><span className="val">P 450.00</span></div>
            </div>
          </div>
 
          <div className="card" style={{ marginTop: 12 }}>
            <div className="card-title">Your details</div>
            <div className="field"><label>Full name</label><input type="text" value={name} placeholder="Jane Doe" onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" value={email} placeholder="jane@example.com" onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Notes (optional)</label><input type="text" placeholder="Anything we should know?" /></div>
            <button className="btn btn-primary" disabled={!selDate || !selSlot || !name || !email} onClick={confirm}>
              Confirm booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}