// Stats for malikpeace.com and its tools (Malik 2026-10-29), in Memento's PostHog (US cloud), next to the app.
// Counts page views, time on page and where people came from, plus a few taps: email sign-ups, links out, PDF downloads
// and each tool's start button. No recordings, no autocapture, no names or emails. Previews and localhost send nothing.
(function () {
  if (!/(^|\.)malikpeace\.com$/i.test(location.hostname)) return;
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_D5DMmpVTrHCi7PeXk3hKFKLD2zfMDuGXUwX62ALYTdeU', { api_host: 'https://us.i.posthog.com', defaults: '2026-08-30', person_profiles: 'identified_only',
    autocapture: false, capture_pageview: true, capture_pageleave: true, disable_session_recording: true, disable_surveys: true });
  var path = location.pathname, page = (path.match(/^\/(focus|audit|freedom|25|about)\//) || [0, 'home'])[1];
  posthog.register({ site: 'malikpeace.com', page_name: page });
  addEventListener('message', function (e) {   // the Beehiiv box says it was sent
    if (e.origin === 'https://subscribe-forms.beehiiv.com' && e.data && e.data.type === 'beehiiv:submitted') posthog.capture('email_signup');
  });
  var TAPS = { focus: { '#start': 'focus_start' },
               freedom: { '#btn-start': 'freedom_start', '#btn-copy, #btn-png': 'freedom_share' },
               audit: { '#startBtn': 'audit_start', '#saveCardBtn, #copyLinkBtn': 'audit_share' } }[page] || {};
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a, button'); if (!t) return;
    for (var sel in TAPS) if (t.matches(sel)) return posthog.capture(TAPS[sel]);
    if (t.tagName !== 'A' || !t.href) return;
    var u = new URL(t.href, location.href);
    if (/\.pdf$/i.test(u.pathname)) posthog.capture('pdf_download', { file: u.pathname });
    else if (/^https?:$/.test(u.protocol) && u.hostname !== location.hostname) posthog.capture('link_out', { url: u.origin + u.pathname });
  }, true);
})();
