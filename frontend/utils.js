export function updateTopLocations(data) {
    const countMap = {};
    data.forEach(d => {
      const key = `${d.latitude.toFixed(2)},${d.longitude.toFixed(2)}`;
      countMap[key] = (countMap[key] || 0) + 1;
    });
  
    const top = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  
    const ul = document.getElementById('location-list');
    ul.innerHTML = '';
    top.forEach(([loc, count]) => {
      const li = document.createElement('li');
      li.textContent = `${loc} – ${count} packages`;
      ul.appendChild(li);
    });
  }
  