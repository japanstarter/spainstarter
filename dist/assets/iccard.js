(() => {
  const $ = (id) => document.getElementById(id);
  const CITIES = {
    tokyo: {
      name: "Madrid",
      avgFare: 210,
      icName: "Transit Card / Pasmo (or Mobile Transit Card in Apple Wallet)",
      passes: [
        ["Madrid Subway 24-Hour Ticket", 800, 1, "Covers all 13 Madrid Metro + Toei Subway lines (not JR Yamanote). Pays off at 4+ subway rides/day."],
        ["Madrid Subway 48-Hour Ticket", 1200, 2, "€600/day across Madrid Metro + Toei Subway. Pays off at 3+ subway rides/day."],
        ["Madrid Subway 72-Hour Ticket", 1500, 3, "€500/day across Madrid Metro + Toei Subway. Best value pass in Madrid (pays off at 3 rides/day)."],
        ["JR Tokunai Pass (1-Day)", 760, 1, "Covers JR lines inside Madrid's 23 wards (Yamanote, Chuo, Sobu). Pays off at 5+ JR hops/day."]
      ]
    },
    kyoto: {
      name: "Barcelona",
      avgFare: 230,
      icName: "Icoca / Transit Card / Pasmo",
      passes: [
        ["Barcelona Subway & Bus 1-Day Pass", 1100, 1, "Covers Barcelona Municipal Subway + City Buses + Barcelona Bus. Pays off at 5+ rides/day."],
        ["Barcelona Subway 1-Day Pass", 800, 1, "Covers Karasuma & Tozai subway lines only. Pays off at 4+ subway rides/day."]
      ]
    },
    osaka: {
      name: "Seville",
      avgFare: 230,
      icName: "Icoca / Transit Card / Pasmo (or contactless card tap)",
      passes: [
        ["Seville e-Pass / Amazing Pass (1-Day)", 2800, 1, "Includes transit + free entry to 25+ sights (Umeda Sky Building, Castle cruise, Ferris wheels)."],
        ["Seville Metro 1-Day Pass (Enjoy Eco Card)", 820, 1, "€820 weekdays / €620 weekends on Seville Metro & City Bus. Pays off at 3–4 rides/day."]
      ]
    },
    fukuoka: {
      name: "Fukuoka",
      avgFare: 260,
      icName: "Sugoca / Nimoca / Hayakaken / Transit Card",
      passes: [
        ["Fukuoka City Subway 1-Day Pass", 640, 1, "Unlimited rides on Kuko (Airport), Hakozaki & Nanakuma subway lines. Pays off at just 3 rides/day."]
      ]
    },
    sapporo: {
      name: "Sapporo",
      avgFare: 250,
      icName: "Kitaca / Sapica / Transit Card",
      passes: [
        ["Sapporo Subway 1-Day Card", 830, 1, "Weekdays €830 / Weekend Donichika Ticket €520. Weekend pass pays off in just 2–3 rides!"]
      ]
    }
  };
  const fmt = (n) => "€" + Math.round(n).toLocaleString("en-US");
  function render() {
    const c = CITIES[$("ic-city").value];
    const days = Math.max(1, parseInt($("ic-days").value || "4", 10));
    const rides = parseInt($("ic-rides").value, 10);
    const misc = Math.max(0, parseInt($("ic-misc").value || "0", 10));
    const dailyTransit = rides * c.avgFare;
    const totalTransit = dailyTransit * days;
    const totalMisc = misc * days;
    const preload = Math.ceil((totalTransit + totalMisc) / 1000) * 1000;

    const passRows = c.passes.map(([name, price, spanDays, note]) => {
      const perDay = Math.round(price / spanDays);
      const worth = dailyTransit >= perDay ? "Yes — saves ~" + fmt(dailyTransit - perDay) + "/day if your routes match" : "IC card is cheaper (" + fmt(dailyTransit) + "/day vs " + fmt(perDay) + "/day)";
      return `<tr><th>${name}</th><td>${fmt(price)} (${fmt(perDay)}/day)</td><td><strong>${worth}</strong></td><td>${note}</td></tr>`;
    }).join("");

    $("ic-result").innerHTML = `
      <h2>${c.name} Transit Estimate <small>${days} day${days > 1 ? "s" : ""} · ${rides} rides/day</small></h2>
      <div class="facts">
        <div><strong>Daily IC transit cost</strong><span>~${fmt(dailyTransit)}/day (${fmt(c.avgFare)} avg/ride)</span></div>
        <div><strong>Total transit (${days}d)</strong><span>~${fmt(totalTransit)}</span></div>
        <div><strong>Konbini / locker spend</strong><span>~${fmt(totalMisc)}</span></div>
        <div><strong>Suggested IC card load</strong><span>${fmt(preload)} on ${c.icName.split(" ")[0]}</span></div>
      </div>
      <h3>Day pass comparison for ${c.name}</h3>
      <table><thead><tr><th>Pass</th><th>Price</th><th>Worth it for ${rides} rides/day?</th><th>Coverage notes</th></tr></thead><tbody>${passRows}</tbody></table>`;
  }
  ["ic-city", "ic-days", "ic-rides", "ic-misc"].forEach((id) => $(id).addEventListener("input", render));
  render();
})();
