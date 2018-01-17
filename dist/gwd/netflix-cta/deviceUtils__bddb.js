window.Utils = window.Utils || {}

Utils.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

Utils.isiOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);
Utils.isiOS9up = this.isiOS && ((navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)[1] > 9);
Utils.isiPad   = /iPad/.test(navigator.userAgent);
Utils.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);