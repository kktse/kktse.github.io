/*
 * Sizes the isolated contact-patch widget iframe from the height reported by
 * the same-origin frame document.
 *
 * Messages are accepted only when both the origin matches this page and the
 * source window is the registered iframe, so an unrelated window cannot resize
 * the frame. The inline fallback height on the iframe keeps the block stable
 * until the first measurement arrives.
 */
(function () {
  'use strict';

  var HEIGHT_MESSAGE = 'contact-patch-widget:height';
  var REQUEST_MESSAGE = 'contact-patch-widget:request-height';
  var origin = window.location.origin;
  var frames = [];

  function findFrame(source) {
    for (var index = 0; index < frames.length; index += 1) {
      if (frames[index].contentWindow === source) return frames[index];
    }
    return null;
  }

  function requestHeight(frame) {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: REQUEST_MESSAGE }, origin);
  }

  function onMessage(event) {
    if (event.origin !== origin) return;

    var frame = findFrame(event.source);
    if (!frame) return;

    var data = event.data;
    if (!data || typeof data !== 'object' || data.type !== HEIGHT_MESSAGE) {
      return;
    }

    var height = Number(data.height);
    if (!isFinite(height) || height < 1 || height > 10000) return;

    frame.style.height = Math.ceil(height) + 'px';
  }

  function init() {
    var nodes = document.querySelectorAll('iframe[data-contact-patch-widget]');
    if (!nodes.length) return;

    Array.prototype.forEach.call(nodes, function (frame) {
      frames.push(frame);

      /*
       * The frame may finish loading before this script runs, or post its first
       * measurement before the listener below exists. Asking once on load
       * closes that race; later changes arrive through the frame's observers.
       */
      frame.addEventListener('load', function () {
        requestHeight(frame);
      });
      requestHeight(frame);
    });

    window.addEventListener('message', onMessage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
