/* Crowd voting — shared core for vote.html, showcase.html and index.html.
   The site has no backend, so votes travel over ntfy.sh, the same public
   message bus the launch wall already uses. No account, no database.

   One vote per browser (a random id kept in localStorage). A later vote
   from the same voter replaces the earlier one, so people can change their
   mind, and sending 0 withdraws the vote. The tally is rebuilt from the
   topic's cached messages on every poll, so every screen agrees. */
(function () {
  "use strict";

  var TOPIC = "kumasi-gsc26-mtn78dup53-votes";
  var API = "https://ntfy.sh/" + TOPIC + "/json?poll=1&since=all";
  var POST = "https://ntfy.sh/" + TOPIC;
  var N = 6, VKEY = "marslab_voter", CKEY = "marslab_vote";
  var counts = new Array(N + 1).fill(0), total = 0;
  var listeners = [], started = false, busy = false;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function voter() {
    var v = get(VKEY);
    if (!v || !/^[a-z0-9]{6,12}$/.test(v)) {
      v = Math.random().toString(36).slice(2, 10);
      set(VKEY, v);
    }
    return v;
  }

  function mine() {
    var n = parseInt(get(CKEY), 10);
    return n >= 1 && n <= N ? n : 0;
  }

  function remember(n) {
    if (n >= 1 && n <= N) set(CKEY, String(n)); else del(CKEY);
  }

  function ok(m) {
    return m && typeof m.v === "string" && m.v.length >= 4 && m.v.length <= 16 &&
      typeof m.n === "number" && m.n >= 0 && m.n <= N && m.n === Math.floor(m.n);
  }

  function emit() {
    var snap = { counts: counts.slice(), total: total, mine: mine() };
    listeners.forEach(function (fn) { try { fn(snap); } catch (e) {} });
  }

  function poll() {
    if (busy) return;
    busy = true;
    fetch(API, { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (txt) {
      var by = Object.create(null);
      txt.split("\n").forEach(function (line) {
        if (!line) return;
        var env, m;
        try { env = JSON.parse(line); } catch (e) { return; }
        if (!env || env.event !== "message") return;
        try { m = JSON.parse(env.message); } catch (e) { return; }
        if (ok(m)) by[m.v] = m.n; // messages arrive in order: last choice wins
      });

      counts = new Array(N + 1).fill(0);
      total = 0;
      Object.keys(by).forEach(function (k) {
        if (by[k] >= 1) { counts[by[k]]++; total++; }
      });

      var me = voter();
      remember(by[me] || 0); // keep this device's choice in sync across tabs
      emit();
      busy = false;
    }).catch(function () { busy = false; }); // offline: keep the last known tally
  }

  function cast(n) {
    if (!(n >= 0 && n <= N && n === Math.floor(n))) return Promise.resolve(false);
    remember(n);
    emit(); // optimistic UI; the next poll confirms it
    return fetch(POST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v: voter(), n: n, t: Date.now() })
    }).then(function (r) { poll(); return r.ok; })
      .catch(function () { return false; });
  }

  window.CrowdVote = {
    N: N,
    topic: TOPIC,
    mine: mine,
    cast: cast,
    refresh: poll,
    on: function (fn) { listeners.push(fn); if (started) emit(); },
    start: function () {
      if (started) return;
      started = true;
      poll();
      setInterval(poll, 4000);
      window.addEventListener("focus", poll);
    }
  };
})();
