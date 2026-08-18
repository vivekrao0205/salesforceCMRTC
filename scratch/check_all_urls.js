async function checkUrls() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbye0m6rCaO37FVklFcnHlwHb79TlKN4wCORYVAvSwRRS_BXHburu52UVHuSC7brP5IQ/exec';
  const res = await fetch(API_URL, { redirect: 'follow' });
  const data = await res.json();
  const rawList = Array.isArray(data) ? data : (data.data || data.students || []);
  
  console.log(`Total students fetched: ${rawList.length}`);
  rawList.forEach((s, idx) => {
    const name = s.Name || s.name;
    const roll = s['Roll No'] || s.rollNo;
    const link = s['Trailhead Profile Link'] || s.trailheadProfileLink;
    console.log(`[${idx + 1}] ${name} | Roll: ${roll} | Link: ${link}`);
  });
}

checkUrls();
