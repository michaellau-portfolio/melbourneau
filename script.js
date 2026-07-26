// ============================================================
//  HERO — looping YouTube video with custom minimal controls
//  (pause/play, draggable timeline, sound toggle, auto-unmute
//   on first interaction, title fades out on interaction)
// ============================================================
(function () {
  var hero = document.getElementById('top');
  if (!hero) return;
  var videoId = hero.getAttribute('data-video-id');
  if (!videoId) return;

  var overlay   = document.getElementById('heroOverlay');
  var playBtn   = document.getElementById('heroPlay');
  var playIc    = document.getElementById('heroPlayIc');
  var soundBtn  = document.getElementById('heroSound');
  var soundIc   = document.getElementById('heroSoundIc');
  var track     = document.getElementById('heroTrack');
  var progress  = document.getElementById('heroProgress');
  var scrub     = document.getElementById('heroScrub');

  var player;
  var isReady = false;
  var scrubbing = false;
  var overlayHidden = false;
  var soundOn = false;

  var PLAY  = '\u25B6';   // ▶
  var PAUSE = '\u275A\u275A'; // ❚❚ two heavy bars

  // Load the YouTube IFrame API once.
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('heroEmbed', {
      videoId: videoId,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: videoId,
        modestbranding: 1, playsinline: 1, rel: 0, disablekb: 1, fs: 0
      },
      events: {
        onReady: function (e) {
          isReady = true;
          e.target.mute();
          e.target.playVideo();
          requestAnimationFrame(tick);
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) playIc.innerHTML = PAUSE;
          else if (e.data === YT.PlayerState.PAUSED) playIc.innerHTML = PLAY;
        }
      }
    });
  };

  // ---- Hide the title overlay once the visitor interacts ----
  function hideOverlay() {
    if (overlayHidden || !overlay) return;
    overlayHidden = true;
    overlay.classList.add('is-hidden');
  }

  // ---- Auto-unmute on the FIRST click/tap anywhere on the page ----
  function firstInteractionUnmute() {
    if (soundOn && player && !player.isMuted()) return;
    if (player && typeof player.unMute === 'function') {
      player.unMute();
      player.setVolume(100);
      soundOn = true;
      soundIc.innerHTML = '\uD83D\uDD0A'; // 🔊
      soundBtn.setAttribute('aria-label', 'Mute video');
    }
  }
  document.addEventListener('click', function once() {
    firstInteractionUnmute();
    document.removeEventListener('click', once);
  }, { once: true });

  // ---- Play / pause button ----
  playBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hideOverlay();
    if (!isReady) return;
    var state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      playIc.innerHTML = PLAY;
    } else {
      player.playVideo();
      playIc.innerHTML = PAUSE;
    }
  });

  // ---- Sound toggle button ----
  soundBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hideOverlay();
    if (!isReady) return;
    if (player.isMuted()) {
      player.unMute(); player.setVolume(100); soundOn = true;
      soundIc.innerHTML = '\uD83D\uDD0A';
      soundBtn.setAttribute('aria-label', 'Mute video');
    } else {
      player.mute(); soundOn = false;
      soundIc.innerHTML = '\uD83D\uDD07';
      soundBtn.setAttribute('aria-label', 'Turn sound on');
    }
  });

  // ---- Timeline: click or drag to seek ----
  function seekFromEvent(clientX) {
    if (!isReady) return;
    var rect = track.getBoundingClientRect();
    var ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    var dur = player.getDuration();
    if (dur) {
      player.seekTo(dur * ratio, true);
      setProgress(ratio);
    }
  }
  function setProgress(ratio) {
    var pct = (ratio * 100).toFixed(2) + '%';
    progress.style.width = pct;
    scrub.style.left = pct;
  }
  track.addEventListener('mousedown', function (e) {
    hideOverlay(); scrubbing = true; seekFromEvent(e.clientX);
  });
  document.addEventListener('mousemove', function (e) {
    if (scrubbing) seekFromEvent(e.clientX);
  });
  document.addEventListener('mouseup', function () { scrubbing = false; });
  // Touch
  track.addEventListener('touchstart', function (e) {
    hideOverlay(); scrubbing = true; seekFromEvent(e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchmove', function (e) {
    if (scrubbing) seekFromEvent(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchend', function () { scrubbing = false; });

  // ---- Keep the progress bar moving as the video plays ----
  function tick() {
    if (isReady && !scrubbing && player.getDuration) {
      var dur = player.getDuration();
      var cur = player.getCurrentTime();
      if (dur) setProgress(cur / dur);
    }
    requestAnimationFrame(tick);
  }
})();

// ============================================================
//  GRID — auto thumbnails + click to open video in a lightbox
//  Every tile only needs data-yt="VIDEO_ID". Thumbnail and the
//  popup player are both built from that ID here — no image files.
// ============================================================
(function () {
  var tiles = document.querySelectorAll('.tile[data-yt]');
  tiles.forEach(function (tile) {
    var id = tile.getAttribute('data-yt');
    if (!id) return;
    // Build the thumbnail image from YouTube's auto-generated cover.
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = (tile.querySelector('.tile__label') || {}).textContent || 'Video';
    img.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
    // Fallback to a lower-res thumb if maxres doesn't exist for that video.
    img.onerror = function () {
      img.onerror = null;
      img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    };
    tile.insertBefore(img, tile.firstChild);
    // Store the embed url for the lightbox.
    tile.setAttribute(
      'data-video',
      'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'
    );
  });
})();

var lightbox = document.getElementById('lightbox');
var frame = document.getElementById('lightboxFrame');
var closeBtn = document.getElementById('lightboxClose');

function openLightbox(url) {
  frame.innerHTML =
    '<iframe src="' + url + '" allow="autoplay; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '';
  document.body.style.overflow = '';
}
document.querySelectorAll('.tile').forEach(function (tile) {
  tile.addEventListener('click', function () {
    var url = tile.getAttribute('data-video');
    if (url) openLightbox(url);
  });
});
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

// ============================================================
//  NAV — solid bar after scrolling past the hero
// ============================================================
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.6) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
//  Footer year
// ============================================================
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
