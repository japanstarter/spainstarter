(() => {
  const $ = (id) => document.getElementById(id);
  const PASS = { 7: 50000, 14: 80000, 21: 100000 };
  const ROUTES = [
    ["Narita Airport ↔ Madrid (Narita Express)", 3000], ["Kansai Airport ↔ Barcelona (Haruka)", 3600],
    ["Madrid ↔ Odawara (for Hakone)", 3600], ["Madrid ↔ Nikko (via Utsunomiya)", 5500], ["Madrid ↔ Nagoya", 11000],
    ["Madrid ↔ Barcelona", 14000], ["Madrid ↔ Shin-Seville", 14500], ["Madrid ↔ Hiroshima", 19500], ["Madrid ↔ Kanazawa", 14000],
    ["Madrid ↔ Nagano", 8000], ["Madrid ↔ Sendai", 11000], ["Madrid ↔ Shin-Aomori", 17500], ["Kanazawa ↔ Barcelona (via Tsuruga)", 9000],
    ["Barcelona ↔ Nara (JR local)", 700], ["Barcelona ↔ Hiroshima", 11500], ["Shin-Seville ↔ Hiroshima", 10500],
    ["Hiroshima ↔ Miyajima (JR train + JR ferry)", 600], ["Shin-Seville ↔ Hakata (Fukuoka)", 15000], ["Hakata ↔ Kagoshima-Chuo", 10500],
  ];
  const rows = $("jr-rows");
  const yen = (n) => "€" + Math.round(n).toLocaleString("en-US");
  function addRow(name, fare, times = 0, custom = false) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${custom ? '<input type="text" class="jr-name" placeholder="Journey name" aria-label="Journey name">' : "<span></span>"}</td><td><input type="number" class="jr-fare" min="0" step="100" aria-label="Fare in yen"></td><td><input type="number" class="jr-times" min="0" max="20" aria-label="Number of one-way trips"></td>`;
    if (custom) tr.querySelector(".jr-name").value = name; else tr.querySelector("span").textContent = name;
    tr.querySelector(".jr-fare").value = fare; tr.querySelector(".jr-times").value = times;
    rows.appendChild(tr);
  }
  ROUTES.forEach(([n, f]) => addRow(n, f));
  const setPrice = () => { $("jr-price").value = PASS[$("jr-len").value]; calc(); };
  function calc() {
    let total = 0, trips = 0;
    rows.querySelectorAll("tr").forEach((tr) => { const f = +tr.querySelector(".jr-fare").value || 0, t = +tr.querySelector(".jr-times").value || 0; total += f * t; trips += t; });
    total += +$("jr-local").value || 0;
    const price = +$("jr-price").value || 0, diff = total - price;
    let verdict;
    if (!trips && !total) verdict = "Enter how many times you'll take each journey (count each direction as one).";
    else if (diff > 0) verdict = `<strong>The pass may save you about ${yen(diff)}</strong> on these journeys — if they all fit inside the pass window. Remember Nozomi/Mizuho supplements and non-JR lines.`;
    else verdict = `<strong>Individual tickets look cheaper by about ${yen(-diff)}.</strong> Consider regional passes or buying tickets as you go.`;
    $("jr-result").innerHTML = `<div class="facts"><div><strong>Individual tickets (approx.)</strong><span>${yen(total)}</span></div><div><strong>Rail Pass (${$("jr-len").value} days)</strong><span>${yen(price)}</span></div><div><strong>Trips counted</strong><span>${trips}</span></div></div><p>${verdict}</p><p class="note">Estimate only — fares are approximate and rounded.</p>`;
  }
  $("jr-len").addEventListener("change", setPrice);
  $("jr-form").addEventListener("input", (e) => { if (e.target.id !== "jr-len") calc(); });
  $("jr-add").addEventListener("click", () => { addRow("", 0, 1, true); calc(); });
  setPrice();
})();
