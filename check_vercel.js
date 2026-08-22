async function check() {
  const r = await fetch('https://bokspot-bus-fe.vercel.app/workspace/my-services');
  const t = await r.text();
  const chunks = t.match(/_next\/static\/chunks\/.*\.js/g) || [];
  
  let found = false;
  for (let c of chunks) {
    const jsUrl = 'https://bokspot-bus-fe.vercel.app/' + c;
    const jRes = await fetch(jsUrl);
    const jTxt = await jRes.text();
    if (jTxt.includes('Failed to save to database')) {
      console.log('FOUND FIX IN CHUNK:', c);
      found = true;
    }
  }
  if (!found) console.log('FIX NOT DEPLOYED ON VERCEL');
}
check();
