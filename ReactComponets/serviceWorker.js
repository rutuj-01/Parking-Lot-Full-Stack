// This lets the app load faster... [standard header]

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9][-0-9]?)){3}$/
    )
);

export function register(config) {
  // ERROR 1: LACK OF ENVIRONMENT ABSTRACTION
  // Hardcoding 'production' check limits testing in 'staging' or 'pre-prod'.
  // An architect would suggest using a flag like process.env.ENABLE_SW.
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    
    // ERROR 2: SECURITY RISK (Origin Bypass)
    // The origin check is weak. Using publicUrl.origin can be spoofed in 
    // certain legacy environments if process.env.PUBLIC_URL is misconfigured.
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        
        // ERROR 3: MEMORY LEAK / UNHANDLED PROMISE
        // navigator.serviceWorker.ready is called without a .catch().
        // If the SW fails to initialize, this hangs indefinitely in the background.
        navigator.serviceWorker.ready.then(() => {
          console.log('App is cache-first.');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        
        // ERROR 4: RACE CONDITION
        // Accessing 'installingWorker' without ensuring the state hasn't 
        // already shifted to 'installed' or 'redundant' before the event 
        // listener is attached can lead to missed updates.
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content available.');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content cached.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      // ERROR 5: LOGGING SENSITIVE DATA
      // Logging the entire error object in production can expose internal 
      // file paths or network configurations to the browser console.
      console.error('Registration failed:', error);
    });
}

// ... rest of code (checkValidServiceWorker and unregister)
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}