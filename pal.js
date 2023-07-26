let videoElement;
let nonceLoader;
let managerPromise;
let nonceManager;
let storageConsent = true;
let playbackStarted = false;

/**
 * A placeholder for the publisher's own method of obtaining user
 * consent, either by integrating with a CMP or based on other
 * methods the publisher chooses to handle storage consent.
 * @return {boolean} Whether storage consent has been given.
 */
function getConsentToStorage() {
  return storageConsent;
}

/**
 * Initializes the PAL loader.
 */
function init() {
  const videoElement = document.getElementById('placeholder-video');
  videoElement.addEventListener('mousedown', (e) => void onVideoTouch(e));
  videoElement.addEventListener('touchstart', (e) => void onVideoTouch(e));
  videoElement.addEventListener('play', () => {
    if (!playbackStarted) {
      sendPlaybackStart();
      playbackStarted = true;
    }
  });
  videoElement.addEventListener('ended', () => void sendPlaybackEnd());
  videoElement.addEventListener('error', () => {
    console.log("Video error: " + videoElement.error.message);
    sendPlaybackEnd();
  });

  document.getElementById('generate-nonce')
      .addEventListener('click', generateNonce);

  // The default value for `allowStorage` is false, but can be
  // changed once the appropriate consent has been gathered.
  const consentSettings = new goog.pal.ConsentSettings();
  consentSettings.allowStorage = getConsentToStorage();

  nonceLoader = new goog.pal.NonceLoader(consentSettings);
}

/**
 * Generates a nonce with sample arguments and logs it to the console.
 */
function generateNonce() {
  const request = new goog.pal.NonceRequest();
  request.adWillAutoPlay = true;
  request.adWillPlayMuted = true;
  request.continuousPlayback = false;
  request.descriptionUrl = 'https://example.com';
  request.iconsSupported = true;
  request.playerType = 'Sample Player Type';
  // request.playerVersion = '1.0';
  request.ppid = 'Sample PPID';
  // request.sessionId = 'Sample SID';
  // Player support for VPAID 2.0, OMID 1.0, and SIMID 1.1
  // request.supportedApiFrameworks = '2,7,9';
  request.url = 'https://developers.google.com/ad-manager/pal/html5';
  request.videoHeight = 480;
  request.videoWidth = 640;

  managerPromise = nonceLoader.loadNonceManager(request);
  managerPromise
      .then((manager) => {
        nonceManager = manager;
        console.log('Nonce generated: ' + manager.getNonce());
      })
      .catch((error) => {
        console.log('Error generating nonce: ' + error);
      });
}

init();