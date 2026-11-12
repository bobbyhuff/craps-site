// /leaderboard/ page. Public: works for guests, reads two SQL functions via the shared client.
(function () {
  var W = window.Wallet;
  if (!W || !W.enabled) return;
  var $ = function (id) { return document.getElementById(id); };

  function fill(body, rows) {
    body.textContent = '';
    if (!rows.length) {
      var tr = document.createElement('tr'), td = document.createElement('td');
      td.colSpan = 3; td.textContent = 'No one here yet.';
      tr.appendChild(td); body.appendChild(tr);
      return;
    }
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      [String(r.rank), r.username, Number(r.chips).toLocaleString('en-US')].forEach(function (t, i) {
        var td = document.createElement('td');
        td.textContent = t;               // textContent only: usernames are user-supplied
        if (i !== 1) td.className = 'num';
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function untilReset() {
    var now = new Date(), next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    var mins = Math.max(1, Math.round((next - now.getTime()) / 60000));
    return 'resets in ' + Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
  }
  $('lb-reset').textContent = untilReset();

  async function load(fn, body) {
    var r = await W.client.rpc(fn);
    if (r.error) throw r.error;
    fill(body, r.data || []);
  }
  Promise.all([load('leaderboard_holders', $('lb-holders')), load('leaderboard_daily', $('lb-daily'))])
    .catch(function () {
      var s = $('lb-status');
      s.textContent = 'Could not load the leaderboard. Try again in a minute.';
      s.className = 'form-status err';
    });
})();
