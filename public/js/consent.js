// EU 국가 코드 목록
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 
  'NO', 'CH'
];

// IP 기반 국가 확인 및 동의 배너 표시 로직
async function checkLocationAndShowBanner() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // EU 지역이 아닌 경우 바로 GA 활성화
    if (!EU_COUNTRIES.includes(data.country_code)) {
      setConsentCookie('granted');
      initializeGA('granted');
      return;
    }
    
    // EU 지역인 경우 기존 동의 확인
    const consent = getConsentCookie();
    if (consent === null) {
      showConsentBanner();
    } else {
      initializeGA(consent);
    }
  } catch (error) {
    console.error('Error checking location:', error);
    // 에러 발생 시 안전하게 동의 배너 표시
    const consent = getConsentCookie();
    if (consent === null) {
      showConsentBanner();
    } else {
      initializeGA(consent);
    }
  }
}

// 쿠키 동의 상태를 저장하는 함수
function setConsentCookie(consent) {
  const d = new Date();
  d.setTime(d.getTime() + (365*24*60*60*1000));
  document.cookie = `cookie_consent=${consent};expires=${d.toUTCString()};path=/`;
}

// 쿠키 동의 상태를 확인하는 함수
function getConsentCookie() {
  const name = "cookie_consent=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

// Google Analytics 초기화 함수
function initializeGA(consent) {
  if (consent === 'granted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    });
  } else {
    gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
  }
}

// 동의 배너 표시 함수
function showConsentBanner() {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div id="cookie-consent-banner" class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-4 md:mb-0 text-sm">
            <p>We use cookies to enhance your browsing experience and analyze site traffic. 
               By clicking "Accept All", you consent to our use of cookies.</p>
          </div>
          <div class="flex space-x-4">
            <button onclick="acceptConsent()" class="bg-[#e82127] hover:bg-[#d41920] text-white px-6 py-2 rounded-lg transition-colors">
              Accept All
            </button>
            <button onclick="rejectConsent()" class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Reject All
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
}

// 동의 수락 처리
function acceptConsent() {
  setConsentCookie('granted');
  initializeGA('granted');
  document.getElementById('cookie-consent-banner').remove();
}

// 동의 거부 처리
function rejectConsent() {
  setConsentCookie('denied');
  initializeGA('denied');
  document.getElementById('cookie-consent-banner').remove();
}

// 페이지 로드 시 실행
window.addEventListener('load', function() {
  checkLocationAndShowBanner();
}); 