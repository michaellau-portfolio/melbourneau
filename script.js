// ============================================================
//  HERO — looping YouTube background video with unmute button
// ============================================================
// Uses YouTube's IFrame API so we can control mute/unmute and loop.
(function () {
  var hero = document.getElementById('top');
  if (!hero) return;
  var videoId = hero.getAttribute('data-video-id');
  if (!videoId) return;

  var soundBtn = document.getElementById('heroSound');
  var soundLabel = document.getElementById('heroSoundLabel');
  var player;

  // Load the YouTube IFrame API script once.
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  // YouTube calls this global function automatically when the API is ready.
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('heroEmbed', {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,            // must start muted for autoplay to work
        controls: 0,        // hide player controls (clean look)
        loop: 1,
        playlist: videoId,  // required so loop=1 actually loops a single video
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        onReady: function (e) {
          e.target.mute();
          e.target.playVideo();
        }
      }
    });
  };

  // Toggle sound on button click.
  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      if (!player || typeof player.isMuted !== 'function') return;
      if (player.isMuted()) {
        player.unMute();
        player.setVolume(100);
        soundLabel.innerHTML = '\uD83D\uDD0A Sound on';
      } else {
        player.mute();
        soundLabel.innerHTML = '\uD83D\uDD07 Sound off';
      }
    });
  }
})();

// ============================================================
//  GRID — click a thumbnail to open the video in a lightbox
// ============================================================
var lightbox = document.getElementById('lightbox');
var frame = document.getElementById('lightboxFrame');
var closeBtn = document.getElementById('lightboxClose');
var tiles = document.querySelectorAll('.tile');

function openLightbox(url) {
  frame.innerHTML =
    '<iframe src="' + url + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  frame.innerHTML = ''; // stops the video playing
  document.body.style.overflow = '';
}

tiles.forEach(function (tile) {
  tile.addEventListener('click', function () {
    var url = tile.getAttribute('data-video');
    if (url) openLightbox(url);
  });
});

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

// ============================================================
//  Footer year
// ============================================================
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
