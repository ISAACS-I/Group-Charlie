const EVENTS = [
  { id:1, title:'Tech Innovators Summit 2026', mon:'APR', day:12, type:'conference', loc:'Gaborone ICC', time:'9:00 AM – 6:00 PM', desc:"Botswana's premier technology conference bringing together innovators, startups, and industry leaders.", price:'P 350', free:false, attendees:214, cap:300 },
  { id:2, title:'UX Design Masterclass', mon:'APR', day:18, type:'workshop', loc:'BUAN Campus, Block B', time:'10:00 AM – 3:00 PM', desc:'Hands-on full-day workshop covering user research, wireframing, prototyping, and usability testing.', price:'Free', free:true, attendees:38, cap:40 },
  { id:3, title:'Startup Pitch Night', mon:'APR', day:24, type:'networking', loc:'The Hub, Gaborone', time:'6:00 PM – 9:00 PM', desc:'Monthly meetup where founders pitch their ideas to a panel of investors and mentors.', price:'Free', free:true, attendees:72, cap:100 },
  { id:4, title:'AI & Machine Learning Webinar', mon:'MAY', day:2, type:'webinar', loc:'Online (Zoom)', time:'2:00 PM – 4:00 PM', desc:'Leading AI researchers discuss practical applications of machine learning across Southern Africa.', price:'Free', free:true, attendees:510, cap:1000 },
  { id:5, title:'Product Management Bootcamp', mon:'MAY', day:9, type:'workshop', loc:'Masa Centre, Level 3', time:'8:30 AM – 5:30 PM', desc:'Intensive bootcamp covering product strategy, roadmaps, sprint execution, and stakeholder management.', price:'P 800', free:false, attendees:22, cap:25 },
  { id:6, title:'Women in Tech Gaborone', mon:'MAY', day:15, type:'networking', loc:'Avani Gaborone Resort', time:'5:30 PM – 8:00 PM', desc:'Celebrating and connecting women building careers in technology. Keynotes, panels, and open networking.', price:'Free', free:true, attendees:130, cap:200 },
];
 
const TYPE_BADGE = {
  conference: 'badge-blue', workshop: 'badge-green', networking: 'badge-amber',
  webinar: 'badge-purple', community: 'badge-gray',
};
 
function Events() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [rsvpd, setRsvpd] = useState(new Set());
  const [counts, setCounts] = useState(Object.fromEntries(EVENTS.map(e => [e.id, e.attendees])));
 
  const filtered = EVENTS.filter(e => {
    const mf = filter === 'all' || e.type === filter;
    const mq = !q || e.title.toLowerCase().includes(q.toLowerCase()) || e.loc.toLowerCase().includes(q.toLowerCase());
    return mf && mq;
  });
 
  const toggleRsvp = (id) => {
    setRsvpd(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setCounts(c => ({ ...c, [id]: c[id] - 1 })); }
      else { next.add(id); setCounts(c => ({ ...c, [id]: c[id] + 1 })); }
      return next;
    });
  };
 
  const filters = ['all','conference','workshop','webinar','networking'];
 
  return (
    <div className="page">
      <h1 className="page-title">Events</h1>
      <p className="page-sub">Discover and register for upcoming events in your community.</p>
 
      <div className="toolbar">
        <input type="text" placeholder="Search events..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="filter-tabs">
          {filters.map(f => (
            <button key={f} className={`ftab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
 
      {filtered.length === 0 ? (
        <div className="no-events">No events match your search.</div>
      ) : (
        <div className="event-list">
          {filtered.map(e => {
            const going = rsvpd.has(e.id);
            const spots = e.cap - counts[e.id];
            const full = spots <= 0 && !going;
            return (
              <div key={e.id} className="event-card">
                <div className="event-date-col">
                  <div className="event-date-box">
                    <div className="edb-mon">{e.mon}</div>
                    <div className="edb-day">{e.day}</div>
                  </div>
                </div>
                <div className="event-body">
                  <div className="event-title">{e.title}</div>
                  <div className="event-meta">
                    <span><Icon name="clock" size={12} /> {e.time}</span>
                    <span><Icon name="pin" size={12} /> {e.loc}</span>
                  </div>
                  <div className="event-desc">{e.desc}</div>
                  <div className="event-footer">
                    <span className={`badge ${TYPE_BADGE[e.type] || 'badge-gray'}`}>{e.type.charAt(0).toUpperCase()+e.type.slice(1)}</span>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{counts[e.id]} going</span>
                    {spots <= 5 && spots > 0 && <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 500 }}>{spots} spots left</span>}
                    {full && <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 500 }}>Full</span>}
                    <span className={`badge ${e.free ? 'badge-green' : 'badge-gray'}`} style={{ marginLeft: 'auto' }}>{e.price}</span>
                    <button
                      className={`rsvp-btn ${going ? 'going' : ''}`}
                      disabled={full}
                      onClick={() => toggleRsvp(e.id)}
                    >
                      {going ? '✓ Going' : 'RSVP'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
 