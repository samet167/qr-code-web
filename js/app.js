/**
 * QR Studio Pro - Application Logic & Rich Animation Engine
 * Powered by QRCodeStyling with Client-Side Generation
 */

(function () {
  'use strict';

  // State Management
  const state = {
    type: 'url',
    data: 'https://google.com',
    resolution: 1000,
    margin: 10,
    dotsColor: '#0f172a',
    bgColor: '#ffffff',
    dotsType: 'rounded',
    cornersType: 'extra-rounded',
    logo: null,
    history: []
  };

  // DOM Elements
  const elements = {
    // Theme
    html: document.documentElement,
    themeToggleBtn: document.getElementById('themeToggleBtn'),

    // QR Preview & Animations
    qrPreviewWrapper: document.getElementById('qrPreviewWrapper'),
    qrDeviceCard: document.getElementById('qrDeviceCard'),
    qrContainer: document.getElementById('qrContainer'),
    qrPlaceholder: document.getElementById('qrPlaceholder'),
    scannerLaser: document.getElementById('scannerLaser'),
    currentSizeTag: document.getElementById('currentSizeTag'),
    resButtons: document.querySelectorAll('.res-btn'),
    confettiCanvas: document.getElementById('confettiCanvas'),

    // Action Buttons
    downloadPngBtn: document.getElementById('downloadPngBtn'),
    downloadSvgBtn: document.getElementById('downloadSvgBtn'),
    copyImageBtn: document.getElementById('copyImageBtn'),
    shareBtn: document.getElementById('shareBtn'),

    // Tabs & Slider
    segmentedTabs: document.getElementById('segmentedTabs'),
    tabSlider: document.getElementById('tabSlider'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    typeForms: document.querySelectorAll('.type-form'),

    // Inputs
    inputUrl: document.getElementById('inputUrl'),
    clearUrlBtn: document.getElementById('clearUrlBtn'),
    pasteUrlBtn: document.getElementById('pasteUrlBtn'),
    sampleChips: document.querySelectorAll('.chip'),

    inputText: document.getElementById('inputText'),
    textCharCount: document.getElementById('textCharCount'),

    wifiSsid: document.getElementById('wifiSsid'),
    wifiPass: document.getElementById('wifiPass'),
    wifiSec: document.getElementById('wifiSec'),
    wifiHidden: document.getElementById('wifiHidden'),

    vcardFirst: document.getElementById('vcardFirst'),
    vcardLast: document.getElementById('vcardLast'),
    vcardPhone: document.getElementById('vcardPhone'),
    vcardEmail: document.getElementById('vcardEmail'),
    vcardOrg: document.getElementById('vcardOrg'),

    emailTo: document.getElementById('emailTo'),
    emailSubject: document.getElementById('emailSubject'),
    emailBody: document.getElementById('emailBody'),

    // Customization
    paletteButtons: document.querySelectorAll('.palette-btn'),
    colorDots: document.getElementById('colorDots'),
    colorBg: document.getElementById('colorBg'),
    colorDotsHex: document.getElementById('colorDotsHex'),
    colorBgHex: document.getElementById('colorBgHex'),
    dotStyle: document.getElementById('dotStyle'),
    cornerStyle: document.getElementById('cornerStyle'),
    logoFileInput: document.getElementById('logoFileInput'),
    removeLogoBtn: document.getElementById('removeLogoBtn'),
    marginRange: document.getElementById('marginRange'),
    marginVal: document.getElementById('marginVal'),
    marginButtons: document.querySelectorAll('.margin-btn'),

    // Mobile Native App Dock
    dockBtnInput: document.getElementById('dockBtnInput'),
    dockBtnCustomize: document.getElementById('dockBtnCustomize'),
    dockBtnPreview: document.getElementById('dockBtnPreview'),
    dockBtnHistory: document.getElementById('dockBtnHistory'),
    dockBtnDownload: document.getElementById('dockBtnDownload'),
    sectionInputs: document.getElementById('sectionInputs'),
    sectionCustomize: document.getElementById('sectionCustomize'),
    sectionPreview: document.getElementById('sectionPreview'),

    // History
    historyBtn: document.getElementById('historyBtn'),
    historyDrawer: document.getElementById('historyDrawer'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    closeHistoryBtn: document.getElementById('closeHistoryBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    historyList: document.getElementById('historyList'),
    historyBadge: document.getElementById('historyBadge'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
  };

  let qrCodeInstance = null;
  let debounceTimer = null;
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  // Initialize App
  function init() {
    loadTheme();
    loadHistory();
    setupQRCodeInstance();
    setupEventListeners();
    setupRippleEffects();
    setup3DTilt();
    setupConfettiCanvas();
    updateTabSlider();
    updateQRCode();
  }

  // 1. Setup QRCodeStyling Instance
  function setupQRCodeInstance() {
    try {
      qrCodeInstance = new QRCodeStyling({
        width: 280,
        height: 280,
        margin: state.margin,
        type: 'canvas',
        data: state.data,
        image: state.logo,
        dotsOptions: {
          color: state.dotsColor,
          type: state.dotsType
        },
        backgroundOptions: {
          color: state.bgColor
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
          imageSize: 0.35
        },
        cornersSquareOptions: {
          color: state.dotsColor,
          type: state.cornersType
        },
        cornersDotOptions: {
          color: state.dotsColor,
          type: state.cornersType === 'extra-rounded' ? 'dot' : state.cornersType
        },
        qrOptions: {
          errorCorrectionLevel: 'Q'
        }
      });

      elements.qrContainer.innerHTML = '<div class="scanner-laser" id="scannerLaser"></div>';
      elements.scannerLaser = document.getElementById('scannerLaser');
      qrCodeInstance.append(elements.qrContainer);
    } catch (e) {
      console.error('QRCodeStyling init error:', e);
    }
  }

  // 2. Trigger Glowing Laser Scanner Animation
  function triggerLaserScan() {
    if (!elements.scannerLaser) return;
    elements.scannerLaser.classList.remove('scanning');
    void elements.scannerLaser.offsetWidth; // Trigger reflow
    elements.scannerLaser.classList.add('scanning');
  }

  // 3. Update QR Code in Real-time
  function updateQRCode(saveToHistory = false) {
    calculatePayload();

    if (!qrCodeInstance) return;

    qrCodeInstance.update({
      data: state.data || ' ',
      margin: state.margin,
      image: state.logo,
      dotsOptions: {
        color: state.dotsColor,
        type: state.dotsType
      },
      backgroundOptions: {
        color: state.bgColor
      },
      cornersSquareOptions: {
        color: state.dotsColor,
        type: state.cornersType
      },
      cornersDotOptions: {
        color: state.dotsColor,
        type: state.cornersType === 'extra-rounded' ? 'dot' : state.cornersType
      }
    });

    triggerLaserScan();

    if (saveToHistory && state.data && state.data.trim() !== '') {
      recordHistory(state.type, state.data);
    }
  }

  function triggerUpdate(save = false) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateQRCode(save);
    }, 90);
  }

  // 4. Calculate Payload Data based on Active Tab
  function calculatePayload() {
    switch (state.type) {
      case 'url': {
        let val = (elements.inputUrl.value || '').trim();
        if (val && !/^https?:\/\//i.test(val)) {
          val = 'https://' + val;
        }
        state.data = val || 'https://google.com';
        break;
      }
      case 'text': {
        const val = elements.inputText.value || '';
        state.data = val.trim() || 'QR Code Studio Pro';
        if (elements.textCharCount) {
          elements.textCharCount.textContent = `${val.length} អក្សរ`;
        }
        break;
      }
      case 'wifi': {
        const ssid = (elements.wifiSsid.value || '').trim();
        const pass = elements.wifiPass.value || '';
        const sec = elements.wifiSec.value;
        const hidden = elements.wifiHidden.checked;
        if (!ssid) {
          state.data = 'WIFI:S:MyWiFi;T:WPA;P:password;;';
        } else {
          state.data = `WIFI:S:${escapeWifi(ssid)};T:${sec};P:${escapeWifi(pass)};H:${hidden ? 'true' : 'false'};;`;
        }
        break;
      }
      case 'vcard': {
        const first = elements.vcardFirst.value.trim();
        const last = elements.vcardLast.value.trim();
        const phone = elements.vcardPhone.value.trim();
        const email = elements.vcardEmail.value.trim();
        const org = elements.vcardOrg.value.trim();

        if (!first && !phone && !email) {
          state.data = 'BEGIN:VCARD\nVERSION:3.0\nFN:Sokha Chea\nTEL:+85512345678\nEND:VCARD';
        } else {
          state.data = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${last};${first};;;`,
            `FN:${first} ${last}`.trim(),
            phone ? `TEL;TYPE=CELL:${phone}` : '',
            email ? `EMAIL:${email}` : '',
            org ? `ORG:${org}` : '',
            'END:VCARD'
          ].filter(Boolean).join('\n');
        }
        break;
      }
      case 'email': {
        const to = (elements.emailTo.value || '').trim();
        const subject = encodeURIComponent((elements.emailSubject.value || '').trim());
        const body = encodeURIComponent((elements.emailBody.value || '').trim());

        if (!to) {
          state.data = 'mailto:hello@example.com?subject=Hello';
        } else {
          state.data = `mailto:${to}?subject=${subject}&body=${body}`;
        }
        break;
      }
      default:
        state.data = 'https://google.com';
    }
  }

  function escapeWifi(str) {
    return str.replace(/([\\;,:"])/g, '\\$1');
  }

  // 5. Animated Tab Slider Positioning
  function updateTabSlider() {
    const activeBtn = elements.segmentedTabs.querySelector('.tab-btn.active');
    if (!activeBtn || !elements.tabSlider) return;

    elements.tabSlider.style.width = `${activeBtn.offsetWidth}px`;
    elements.tabSlider.style.transform = `translateX(${activeBtn.offsetLeft - 6}px)`;
  }

  // 6. Setup Event Listeners
  function setupEventListeners() {
    // Theme Toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Tab Switching
    elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.dataset.type;
        if (state.type === targetType) return;

        elements.tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        updateTabSlider();

        elements.typeForms.forEach(f => f.classList.remove('active'));
        const targetForm = document.getElementById(`form-${targetType}`);
        if (targetForm) targetForm.classList.add('active');

        state.type = targetType;
        triggerUpdate(true);
      });
    });

    window.addEventListener('resize', updateTabSlider);

    // Inputs Events
    elements.inputUrl.addEventListener('input', () => triggerUpdate());
    elements.inputUrl.addEventListener('change', () => triggerUpdate(true));

    elements.clearUrlBtn.addEventListener('click', () => {
      elements.inputUrl.value = '';
      elements.inputUrl.focus();
      triggerUpdate();
    });

    // Paste URL Button
    elements.pasteUrlBtn.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          elements.inputUrl.value = text.trim();
          showToast('បាន Paste Link រួចរាល់!');
          triggerUpdate(true);
        }
      } catch (err) {
        showToast('សូមចុច Ctrl+V / Cmd+V ដើម្បី Paste');
      }
    });

    // Sample Chips
    elements.sampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.inputUrl.value = chip.dataset.sample;
        showToast(`បានជ្រើសរើស ${chip.textContent}`);
        triggerUpdate(true);
      });
    });

    // Text input
    elements.inputText.addEventListener('input', () => triggerUpdate());
    elements.inputText.addEventListener('change', () => triggerUpdate(true));

    // WiFi Inputs
    [elements.wifiSsid, elements.wifiPass, elements.wifiSec, elements.wifiHidden].forEach(el => {
      el.addEventListener('input', () => triggerUpdate());
      el.addEventListener('change', () => triggerUpdate(true));
    });

    // vCard Inputs
    [elements.vcardFirst, elements.vcardLast, elements.vcardPhone, elements.vcardEmail, elements.vcardOrg].forEach(el => {
      el.addEventListener('input', () => triggerUpdate());
      el.addEventListener('change', () => triggerUpdate(true));
    });

    // Email Inputs
    [elements.emailTo, elements.emailSubject, elements.emailBody].forEach(el => {
      el.addEventListener('input', () => triggerUpdate());
      el.addEventListener('change', () => triggerUpdate(true));
    });

    // Palette Presets
    elements.paletteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.paletteButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const fg = btn.dataset.fg;
        const bg = btn.dataset.bg;

        state.dotsColor = fg;
        state.bgColor = bg;

        elements.colorDots.value = fg;
        elements.colorBg.value = bg;
        elements.colorDotsHex.textContent = fg.toUpperCase();
        elements.colorBgHex.textContent = bg.toUpperCase();

        triggerUpdate();
      });
    });

    // Color Pickers
    elements.colorDots.addEventListener('input', (e) => {
      state.dotsColor = e.target.value;
      elements.colorDotsHex.textContent = e.target.value.toUpperCase();
      elements.paletteButtons.forEach(b => b.classList.remove('active'));
      triggerUpdate();
    });

    elements.colorBg.addEventListener('input', (e) => {
      state.bgColor = e.target.value;
      elements.colorBgHex.textContent = e.target.value.toUpperCase();
      elements.paletteButtons.forEach(b => b.classList.remove('active'));
      triggerUpdate();
    });

    // Shapes
    elements.dotStyle.addEventListener('change', (e) => {
      state.dotsType = e.target.value;
      triggerUpdate();
    });

    elements.cornerStyle.addEventListener('change', (e) => {
      state.cornersType = e.target.value;
      triggerUpdate();
    });

    // Logo Upload
    elements.logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        showToast('សូមជ្រើសរើស Logo ទំហំតូចជាង 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        state.logo = event.target.result;
        elements.removeLogoBtn.classList.remove('hidden');
        showToast('បានបញ្ចូល Logo ជោគជ័យ!');
        triggerUpdate();
      };
      reader.readAsDataURL(file);
    });

    // Remove Logo
    elements.removeLogoBtn.addEventListener('click', () => {
      state.logo = null;
      elements.logoFileInput.value = '';
      elements.removeLogoBtn.classList.add('hidden');
      showToast('បានដក Logo ចេញ');
      triggerUpdate();
    });

    // Margin / Padding Controls
    if (elements.marginRange) {
      elements.marginRange.addEventListener('input', (e) => {
        state.margin = parseInt(e.target.value, 10);
        if (elements.marginVal) elements.marginVal.textContent = `${state.margin}px`;
        updateMarginChips();
        triggerUpdate();
      });
    }

    if (elements.marginButtons) {
      elements.marginButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          state.margin = parseInt(btn.dataset.margin, 10);
          if (elements.marginRange) elements.marginRange.value = state.margin;
          if (elements.marginVal) elements.marginVal.textContent = `${state.margin}px`;
          updateMarginChips();
          triggerUpdate();
        });
      });
    }

    function updateMarginChips() {
      if (!elements.marginButtons) return;
      elements.marginButtons.forEach(btn => {
        if (parseInt(btn.dataset.margin, 10) === state.margin) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Resolution Buttons
    elements.resButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.resButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.resolution = parseInt(btn.dataset.res, 10);
        elements.currentSizeTag.textContent = `${state.resolution} × ${state.resolution} px`;
      });
    });

    // Export Actions
    elements.downloadPngBtn.addEventListener('click', handleDownloadPng);
    elements.downloadSvgBtn.addEventListener('click', handleDownloadSvg);
    elements.copyImageBtn.addEventListener('click', handleCopyImage);
    elements.shareBtn.addEventListener('click', handleShare);

    // Mobile Native App Dock Controls
    const dockButtons = [elements.dockBtnInput, elements.dockBtnCustomize, elements.dockBtnPreview, elements.dockBtnHistory];
    
    function setActiveDock(btn) {
      dockButtons.forEach(b => {
        if (b) b.classList.remove('active');
      });
      if (btn) btn.classList.add('active');
    }

    if (elements.dockBtnInput) {
      elements.dockBtnInput.addEventListener('click', () => {
        if (elements.sectionInputs) elements.sectionInputs.scrollIntoView({ behavior: 'smooth' });
        setActiveDock(elements.dockBtnInput);
      });
    }

    if (elements.dockBtnCustomize) {
      elements.dockBtnCustomize.addEventListener('click', () => {
        if (elements.sectionCustomize) elements.sectionCustomize.scrollIntoView({ behavior: 'smooth' });
        setActiveDock(elements.dockBtnCustomize);
      });
    }

    if (elements.dockBtnPreview) {
      elements.dockBtnPreview.addEventListener('click', () => {
        if (elements.sectionPreview) elements.sectionPreview.scrollIntoView({ behavior: 'smooth' });
        triggerLaserScan();
        setActiveDock(elements.dockBtnPreview);
      });
    }

    if (elements.dockBtnHistory) {
      elements.dockBtnHistory.addEventListener('click', () => {
        openHistory();
        setActiveDock(elements.dockBtnHistory);
      });
    }

    if (elements.dockBtnDownload) {
      elements.dockBtnDownload.addEventListener('click', handleDownloadPng);
    }

    // History Drawer
    elements.historyBtn.addEventListener('click', openHistory);
    elements.closeHistoryBtn.addEventListener('click', closeHistory);
    elements.drawerBackdrop.addEventListener('click', closeHistory);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
  }

  // 7. Tactile Button Ripple Effect
  function setupRippleEffects() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.ripple-btn');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-effect');

      const existing = btn.querySelector('.ripple-effect');
      if (existing) existing.remove();

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  // 8. Interactive 3D Perspective Tilt on QR Card
  function setup3DTilt() {
    const card = elements.qrDeviceCard;
    if (!card) return;

    // Desktop hover tilt
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 9. Confetti Celebration Engine
  function setupConfettiCanvas() {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;

    confettiCtx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  function launchConfetti() {
    if (!confettiCtx) return;

    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    confettiParticles = [];

    for (let i = 0; i < 75; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.7,
        r: Math.random() * 6 + 4,
        d: Math.random() * 75,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 16,
        vy: -(Math.random() * 14 + 10),
        gravity: 0.5,
        opacity: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.tiltAngle += p.tiltAngleIncremental;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < window.innerHeight) {
        activeCount++;
        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.moveTo(p.x + p.tilt + p.r, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        confettiCtx.stroke();
        confettiCtx.globalAlpha = 1;
      }
    });

    if (activeCount > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  // 10. Download Handlers with Confetti & Custom Margin / Padding
  async function handleDownloadPng() {
    if (!qrCodeInstance) return;
    try {
      showToast('កំពុងទាញយក PNG...');
      
      const exportMargin = Math.round((state.margin / 280) * state.resolution);

      const exportInstance = new QRCodeStyling({
        width: state.resolution,
        height: state.resolution,
        margin: exportMargin,
        type: 'canvas',
        data: state.data,
        image: state.logo,
        dotsOptions: {
          color: state.dotsColor,
          type: state.dotsType
        },
        backgroundOptions: {
          color: state.bgColor
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: Math.round(state.resolution * 0.02),
          imageSize: 0.35
        },
        cornersSquareOptions: {
          color: state.dotsColor,
          type: state.cornersType
        },
        cornersDotOptions: {
          color: state.dotsColor,
          type: state.cornersType === 'extra-rounded' ? 'dot' : state.cornersType
        },
        qrOptions: {
          errorCorrectionLevel: 'Q'
        }
      });

      await exportInstance.download({
        name: `qrcode-${Date.now()}`,
        extension: 'png'
      });

      recordHistory(state.type, state.data);
      launchConfetti();
      showToast('ទាញយក PNG បានជោគជ័យ!');
    } catch (err) {
      console.error(err);
      showToast('មានបញ្ហាក្នុងការទាញយក');
    }
  }

  async function handleDownloadSvg() {
    if (!qrCodeInstance) return;
    try {
      showToast('កំពុងទាញយក SVG...');
      await qrCodeInstance.download({
        name: `qrcode-${Date.now()}`,
        extension: 'svg'
      });
      recordHistory(state.type, state.data);
      launchConfetti();
      showToast('ទាញយក SVG បានជោគជ័យ!');
    } catch (err) {
      console.error(err);
      showToast('មានបញ្ហាក្នុងការទាញយក SVG');
    }
  }

  // 11. Copy Image to Clipboard with Confetti
  async function handleCopyImage() {
    const canvas = elements.qrContainer.querySelector('canvas');
    if (!canvas) {
      showToast('រកមិនឃើញរូបភាព QR');
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('មិនអាចចម្លងរូបភាពបាន');
          return;
        }

        if (navigator.clipboard && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            launchConfetti();
            showToast('បានចម្លងរូបភាពទៅ Clipboard!');
            return;
          } catch (clipErr) {
            console.warn('Clipboard write failed, fallback to download:', clipErr);
          }
        }
        handleDownloadPng();
      }, 'image/png');
    } catch (e) {
      showToast('Browser មិនគាំទ្រ Copy រូបភាពផ្ទាល់');
    }
  }

  // 12. Native Share API
  async function handleShare() {
    const canvas = elements.qrContainer.querySelector('canvas');
    if (!canvas) return;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'QR Code របស់ខ្ញុំ',
              text: state.data
            });
          } else {
            await navigator.share({
              title: 'QR Code',
              url: state.data
            });
          }
          showToast('បានចែករំលែកដោយជោគជ័យ!');
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(state.data);
        showToast('បាន Copy តំណភ្ជាប់ទៅ Clipboard!');
      } catch (err) {
        showToast('មិនអាច Share បាននៅលើ Browser នេះ');
      }
    }
  }

  // 13. History Management
  function loadHistory() {
    try {
      const saved = localStorage.getItem('qr_history_pro');
      state.history = saved ? JSON.parse(saved) : [];
      updateHistoryUI();
    } catch (e) {
      state.history = [];
    }
  }

  function recordHistory(type, data) {
    if (!data) return;
    
    state.history = state.history.filter(item => item.data !== data);
    state.history.unshift({
      id: Date.now(),
      type,
      data,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (state.history.length > 20) {
      state.history.pop();
    }

    try {
      localStorage.setItem('qr_history_pro', JSON.stringify(state.history));
    } catch (e) {}

    updateHistoryUI();
  }

  function updateHistoryUI() {
    if (!elements.historyList) return;

    if (state.history.length === 0) {
      elements.historyList.innerHTML = `
        <div class="empty-history">
          <p>មិនទាន់មានប្រវត្តិបង្កើត QR Code ទេ</p>
        </div>
      `;
      elements.historyBadge.classList.add('hidden');
    } else {
      elements.historyBadge.textContent = state.history.length;
      elements.historyBadge.classList.remove('hidden');

      elements.historyList.innerHTML = state.history.map(item => `
        <div class="history-item" data-id="${item.id}">
          <div class="history-info">
            <span class="history-type-badge">${item.type}</span>
            <span class="history-value" title="${escapeHtml(item.data)}">${escapeHtml(item.data)}</span>
            <span class="history-time">${item.time}</span>
          </div>
          <button class="icon-btn restore-history-btn" title="ផ្ទុកឡើងវិញ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
        </div>
      `).join('');

      elements.historyList.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = parseInt(el.dataset.id, 10);
          const item = state.history.find(h => h.id === id);
          if (item) {
            restoreHistoryItem(item);
          }
        });
      });
    }
  }

  function restoreHistoryItem(item) {
    const tab = Array.from(elements.tabButtons).find(t => t.dataset.type === item.type);
    if (tab) tab.click();

    if (item.type === 'url') elements.inputUrl.value = item.data;
    if (item.type === 'text') elements.inputText.value = item.data;

    state.data = item.data;
    triggerUpdate();
    closeHistory();
    showToast(`បានផ្ទុក QR ពីប្រវត្តិ!`);
  }

  function clearHistory() {
    state.history = [];
    try {
      localStorage.removeItem('qr_history_pro');
    } catch (e) {}
    updateHistoryUI();
    showToast('បានសម្អាតប្រវត្តិទាំងអស់');
  }

  function openHistory() {
    elements.historyDrawer.classList.add('open');
    elements.historyDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeHistory() {
    elements.historyDrawer.classList.remove('open');
    elements.historyDrawer.setAttribute('aria-hidden', 'true');
  }

  // 14. Toast Notification
  let toastTimer = null;
  function showToast(msg) {
    if (!elements.toast) return;
    elements.toastMessage.textContent = msg;
    elements.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  // 15. Theme Toggle
  function loadTheme() {
    const saved = localStorage.getItem('qr_theme') || 'dark';
    elements.html.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = elements.html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    elements.html.setAttribute('data-theme', next);
    try {
      localStorage.setItem('qr_theme', next);
    } catch (e) {}
    showToast(`ប្តូរទៅកាន់ ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
