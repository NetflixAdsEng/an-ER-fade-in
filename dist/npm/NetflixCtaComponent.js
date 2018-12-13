!(function() {
  var COMPONENT_NAME = 'netflix-cta';
  var PREFIX = 'mm-component';
  var TRANSITION_EASING = '.4s cubic-bezier(0.19, 1, 0.22, 1)';
  // the proportion of padding right of the CTA arrow to the CTA width
  var ARROW_PADDING_TO_WIDTH = 0.04;
  // list of attributes that affect CTA layout
  var LAYOUT_ATTRIBUTE_LIST = [
    'width',
    'height',
    'font',
    'font-size',
    'min-font-size',
    'max-width',
    'stretch-direction',
    'arrow'
  ];

  function stretchStrToPercent(stretchStr) {
    if (!stretchStr || stretchStr === 'left') {
      return 0;
    } else if (stretchStr === 'center') {
      return 0.5;
    } else if (stretchStr === 'right') {
      return 1;
    }

    // if it ends with %...
    if (stretchStr.indexOf('%') === stretchStr.length - 1) {
      var stretchPercent = parseFloat(stretchStr);
      // and is valid num...
      if (!isNaN(stretchPercent)) {
        return stretchPercent / 100;
      }
    }
    return 0;
  }

  function parsePaddingAttr(padAttr) {
    if (typeof padAttr === 'number') {
      return padAttr + 'px';
    }

    var parsedNum = parseFloat(padAttr);
    // is number string --> convert to px
    if (!isNaN(parsedNum) && /^(\d|\.)+$/.test(padAttr)) {
      return parsedNum + 'px';
    }
    return padAttr;
  }

  function horizontalPadding(el) {
    var style = window.getComputedStyle(el, null);
    return parseInt(style.getPropertyValue('padding-left'), 10) + parseInt(style.getPropertyValue('padding-right'), 10);
  }

  // Calculate width without padding.
  function innerWidth(el) {
    var style = window.getComputedStyle(el, null);
    return (
      el.clientWidth -
      parseInt(style.getPropertyValue('padding-left'), 10) -
      parseInt(style.getPropertyValue('padding-right'), 10)
    );
  }

  // Calculate height without padding.
  function innerHeight(el) {
    var style = window.getComputedStyle(el, null);
    return (
      el.clientHeight -
      parseInt(style.getPropertyValue('padding-top'), 10) -
      parseInt(style.getPropertyValue('padding-bottom'), 10)
    );
  }

  function style() {
    // use unique class name as identifier because there are dynamic values in the generated stylesheet
    var UNIQUE_CLASS_NAME = 'uc-' + (Math.random() * 1000000).toFixed(0);

    var horizPaddingAttr = this.getAttribute('horizontal-pad');
    var vertPaddingAttr = this.getAttribute('vertical-pad');

    var horizPadding = parsePaddingAttr(horizPaddingAttr) || '4%';
    var vertPadding = parsePaddingAttr(vertPaddingAttr) || '2%';

    Utils.createStyle.call(
      this,
      COMPONENT_NAME + '.' + UNIQUE_CLASS_NAME,
      '.button',
      'will-change: transform;cursor: pointer;overflow: hidden;text-align: center;font-size:' +
        this.data.size +
        'px; font-family: ' +
        this.data.font,
      '*',
      'box-sizing: border-box;',
      '.button .fill',
      'will-change: transform;width:100%;height:100%;transform-origin:top left;-webkit-transform-origin:top left;transform: scale(0, 1);-webkit-transform: scale(0, 1); transition: transform ' +
        TRANSITION_EASING +
        ';',
      '.button .arrow',
      'will-change: transform;position:absolute;text-align: right;top:50%;left:auto;right:auto;width:100%;font-size:160% !important;-webkit-transform: translate(0%, -50%);transform: translate(0%, -50%);',
      '.button .arrow svg',
      'position:absolute;right:' + ARROW_PADDING_TO_WIDTH * 100 + '%;left:auto;top:0;',
      '.button .copy',
      'will-change: transform;transform-origin: 0 0;letter-spacing:1.1px' +
        // setting each padding independently
        // in case, either padding vars are invalid in CSS
        ';padding-top:' +
        vertPadding +
        ';padding-bottom:' +
        vertPadding +
        ';padding-left:' +
        horizPadding +
        ';padding-right:' +
        horizPadding +
        ';transition: color ' +
        TRANSITION_EASING +
        ';color:' +
        this.data.color[1],
      '.button .border',
      '-webkit-box-sizing: border-box;box-sizing: border-box;position: absolute;top: 0;left: 0;width:100%;height:100%;border:solid ' +
        this.borderSize +
        'px ' +
        this.data.color[0],
      'div',
      'position: absolute;top: 0;left: 0;'
    );

    if (!Utils.isMobile) {
      Utils.createStyle.call(
        this,
        COMPONENT_NAME + '.' + UNIQUE_CLASS_NAME,
        '.button:hover .bgImageHover',
        'width:100% !important;',
        '.button.hover .bgImageHover',
        'width:100% !important;',
        '.button:hover .fill',
        'transform: scale(1, 1); -webkit-transform: scale(1, 1);',
        '.button.hover .fill',
        'transform: scale(1, 1); -webkit-transform: scale(1, 1);',
        '.button:hover .arrow',
        'color:' + this.data.color[0],
        '.button.hover .arrow',
        'color:' + this.data.color[0],
        '.button:hover .copy',
        'color:' + this.data.color[0],
        '.button.hover .copy',
        'color:' + this.data.color[0],
        '.button.isArrow:hover .copy',
        'color:' + this.data.color[0]
      );
    }

    this.className += ' ' + PREFIX + ' ' + UNIQUE_CLASS_NAME;
    this.style.position = 'absolute';
    this.button.style.backgroundColor = this.data.color[0];
    this.fill.style.backgroundColor = this.data.color[1];
  }

  var component = Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        this._attached = false;
        this._hasInited = false;
        this._resizeQueued = false;
        this.button = document.createElement('div');
        this.button.className = 'button';
        this.fill = document.createElement('div');
        this.fill.className = 'fill';
        this.copy = document.createElement('div');
        this.copy.className = 'copy';
        this.arrow = document.createElement('div');
        this.arrow.className = 'arrow';
        this.border = document.createElement('div');
        this.border.className = 'border';
      },
      enumerable: true
    },
    detachedCallback: {
      value: function() {
        this._attached = false;
      }
    },
    attachedCallback: {
      value: function() {
        this._attached = true;

        if (this._hasInited) {
          if (this._resizeQueued) {
            this.resize();
          }
          return;
        }

        this._hasInited = true;

        this.data = {};
        this.data.color = [this.getAttribute('color-1') || '#e50914', this.getAttribute('color-2') || '#ffffff'];
        this.data.size = parseInt(this.getAttribute('font-size'), 10) || 12;
        this.data.minSize = parseInt(this.getAttribute('min-font-size'), 10) || 8;
        this.data.font = (this.getAttribute('font') || 'Netflix Sans') + ', Arial, sans-serif';
        this.data.text = this.getAttribute('text');

        var bgImg = this.getAttribute('background-image');
        if (bgImg) {
          this.bgImgContainer = document.createElement('div');
          this.bgImgContainer.className = 'bgImage';
          var img = new Image();
          img.src = bgImg;
          this.bgImgContainer.appendChild(img);
          this.button.appendChild(this.bgImgContainer);
          this.bgImgContainer.setAttribute('style', 'position: absolute; top:0;left:0;');
        }

        this.appendChild(this.button);
        this.button.appendChild(this.fill);

        var bgImgHover = this.getAttribute('background-image-hover');
        if (bgImgHover) {
          this.bgImgContainerHover = document.createElement('div');
          this.bgImgContainerHover.className = 'bgImageHover';
          var imgHover = new Image();
          imgHover.src = bgImgHover;
          this.bgImgContainerHover.appendChild(imgHover);
          this.button.appendChild(this.bgImgContainerHover);
          this.bgImgContainerHover.setAttribute(
            'style',
            'position: absolute; top:0;left:0;width:0%;overflow:hidden;height:' +
              this.height +
              'px; transition: width ' +
              TRANSITION_EASING +
              ';'
          );
          this.fill.setAttribute('style', 'display:none;');
        }

        this.button.appendChild(this.copy);

        this.hasArrow = this.hasAttribute('arrow');
        this.hasBorder = this.hasAttribute('border');
        this.borderSize = this.getAttribute('border') || 1;

        if (this.hasArrow) {
          this.button.appendChild(this.arrow);
          this.button.className += ' isArrow';
        }

        if (this.hasBorder) {
          this.button.appendChild(this.border);
        }

        style.call(this);

        this.button.addEventListener(
          'click',
          function() {
            if (this.click) this.click();
            var c = document.createEvent('CustomEvent');
            c.initCustomEvent('cta-click', !0, !0, 'Netflix CTA Click');
            this.dispatchEvent(c);
          }.bind(this)
        );

        // necessary to get the arrow to change color properly
        this.button.addEventListener(
          'mouseover',
          function(event) {
            this.mouseover.call(this);
          }.bind(this)
        );

        this.button.addEventListener(
          'mouseout',
          function(event) {
            this.mouseout.call(this);
          }.bind(this)
        );

        var cta = 'WATCH NOW';

        var MonetComponent = document.querySelector('monet-integrator');
        if (MonetComponent) {
          MonetComponent.register(this);
          MonetComponent.getMonetData().then(
            function(data) {
              var key = this.getAttribute('data-dynamic-key') || 'CTA';
              var d = key;
              if (d.split('.').length === 1) {
                d = 'rootAssets["text.' + d + '"].text';
              }
              try {
                cta = eval('data.' + d);
                var locale = Monet.getComponentLocale('text.' + key).substr(0, 2);
                this.copy.classList.add(locale);
                if (locale == 'ar' || locale == 'he') {
                  this.setAttribute('rtl', true);
                }
                this.text(cta);
                this.dispatchEvent(new CustomEvent('ready'));
              } catch (e) {
                Monet.logEvent('MONET_DATA_ERROR', {
                  details: 'Netflix CTA Component error; Could not find data in rootAssets: ' + 'text.' + d,
                  stack: e
                });

                MonetComponent.getBackupMonetData().then(
                  function(backupData) {
                    var ld = d;
                    if (d.split('.').length === 1) {
                      d = 'rootAssets["text.' + d + '"].text';
                    }
                    cta = eval('backupData.' + d);
                    var locale = Monet.getComponentLocale('text.' + key).substr(0, 2);
                    this.copy.classList.add(locale);
                    if (locale == 'ar' || locale == 'he') {
                      this.setAttribute('rtl', true);
                    }
                    this.text(cta);

                    this.dispatchEvent(new CustomEvent('ready'));
                  }.bind(this),
                  function(error) {
                    Monet.logEvent('MONET_DATA_ERROR', {
                      details: 'Failed to load backup Monet data',
                      stack: error
                    });
                  }
                );
              }
            }.bind(this),
            function(error) {
              Monet.logEvent('MONET_DATA_ERROR', {
                details: 'Failed to load backup Monet data',
                stack: error
              });
            }
          );
        } else {
          this.text(cta);
        }
      },
      enumerable: true
    },

    attributeChangedCallback: {
      value: function(attrName, oldVal, newVal) {
        if (!this._attached) {
          return;
        }

        // if change in an attribute that affects layout
        if (LAYOUT_ATTRIBUTE_LIST.indexOf(attrName) >= 0 && oldVal !== newVal) {
          this.resize();
        }
      },
      enumerable: true
    },

    text: {
      value: function(text) {
        var copyText = text || this.copy.innerHTML;
        copyText = copyText && copyText.toUpperCase && copyText.toUpperCase();
        this.copy.innerHTML = copyText;
        this.resize();
      }
    },

    resize: {
      value: function(w, h, options) {
        /* 
        Resize options:
        - tryingMultiLine - try putting copy on multiple lines
        - tryingStretch - try stretching CTA width
        - originalWidth - first width to try when resizing w/ multiple lines
        - stopRetrying - discontinue resizing routine. Mostly for debugging purposes
        */
        options = options || {};

        // queue resize when the element is back in the dom
        if (!this._attached) {
          this._resizeQueued = true;
          return;
        }

        this._resizeQueued = false;
        this.rtl = this.getAttribute('rtl');

        if (this.rtl) {
          TweenMax.set(this.copy, {
            css: {
              right: 0,
              left: 'auto'
            }
          });
          this.arrow.setAttribute(
            'style',
            'position:absolute;text-align: left;top:50%;left:auto;right:auto;width:100%;font-size:160% !important;-webkit-transform: scale(-1,1) translate(0%, -50%);transform: scale(-1,1) translate(0%, -50%);'
          );
        } else {
          TweenMax.set(this.copy, {
            css: {
              right: 'auto',
              left: 0
            }
          });
          this.arrow.setAttribute(
            'style',
            'position:absolute;text-align: right;top:50%;left:auto;right:auto;width:100%;font-size:160% !important;-webkit-transform: translate(0%, -50%);transform: translate(0%, -50%);'
          );
        }

        var parsedWidth = parseInt(this.getAttribute('width'), 10);
        var maxWidth = parseInt(this.getAttribute('max-width'), 10) || 140;

        parsedWidth = isNaN(parsedWidth) ? null : parsedWidth;

        // taking minimum of width and max-width in case someone puts lower max width then width
        var width = w || parsedWidth || (this.offsetWidth || 109);
        var height = h || (this.getAttribute('height') || (this.offsetHeight || 28));
        width = Math.min(width, maxWidth);

        this.copy.style.width = this.button.style.width = this.style.width = width + 'px';
        this.copy.style.height = this.button.style.height = this.style.height = height + 'px';
        this.copy.style.whiteSpace = options.tryingMultiLine ? 'normal' : 'nowrap';

        this.height = height;
        if (this._attached) {
          this.arrow.innerHTML = '';

          // createArrow
          var s = Math.floor(this.height / 3.3);
          TweenMax.set(this.arrow, {
            height: s
          });
          var elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          elem.setAttribute('width', s + 'px');
          elem.setAttribute('height', s + 'px');
          elem.line = new Utils.SvgIcon('line1', 'M0,0 l' + s / 2 + ',' + s / 2 + 'l-' + s / 2 + ',' + s / 2);
          elem.line.setAttribute('fill', 'none');
          elem.line.setAttribute('stroke', this.data.color[1] || 0);
          elem.line.setAttribute('stroke-width', 2);
          elem.appendChild(elem.line);

          this.arrow.appendChild(elem);
        }

        // padding around sides
        var sidePad = ARROW_PADDING_TO_WIDTH * width;
        if (this.hasArrow) {
          this.copy.style.width = width - (sidePad + s) + 'px';
        }

        Utils.textFit(this.copy, {
          detectMultiLine: true,
          multiLine: options.tryingMultiLine,
          alignHoriz: true,
          alignVert: true,
          // subtracting by 1 since textFit bumps up font sizes by 1 internally
          minFontSize: this.data.minSize,
          maxFontSize: this.data.size
        });

        // update multiLine status
        this._multiLine = !!options.tryingMultiLine;

        if (options.stopRetrying || (options.tryingStretch && options.tryingMultiLine)) {
          this._applyCopyFixes();
          return;
        }

        var span = this.copy.querySelector('span');

        // temporarily allow span to wrap around text
        var prevPosition = span.style.position;
        var prevDisplay = span.style.display;
        span.style.position = 'static';
        span.style.display = 'inline';
        var spanWidth = span.offsetWidth;

        // then remove element styling
        span.style.position = prevPosition;
        span.style.display = prevDisplay;

        var spanHeight = span.offsetHeight;

        var copyContainerWidth = innerWidth(this.copy);
        var copyContainerHeight = innerHeight(this.copy);
        var copyExcessWidth = spanWidth - copyContainerWidth;
        var copyExcessHeight = spanHeight - copyContainerHeight;

        var fontSize = getComputedStyle(this.copy).fontSize;

        // if copy bleeds beyond container
        // also implies copy is at minimum font size since textFit utility will try
        // to use min font size to try fitting copy to CTA
        if (copyExcessWidth > 0 || copyExcessHeight > 0) {
          if (!options.tryingStretch) {
            var extraWidth = copyExcessWidth + horizontalPadding(this.copy);
            var potentialNewWidth = width + extraWidth;
            // if CTA height being exceeded,
            // just set newWidth to maxWidth
            // since can't get the exact ideal width
            // to accomodate multiline copy
            var newWidth = copyExcessHeight > 0 ? maxWidth : Math.min(maxWidth, potentialNewWidth);
            this.resize(newWidth, null, {
              originalWidth: width,
              tryingStretch: true,
              tryingMultiLine: options.tryingMultiLine
            });

            // default behavior: stretches from left
            var stretchOrigin = this.getAttribute('stretch-origin');
            var percentOrigin = stretchStrToPercent(stretchOrigin);

            if (percentOrigin > 0) {
              TweenMax.set(this, {
                x: '-=' + extraWidth * percentOrigin
              });
            }
          } else if (!options.tryingMultiLine) {
            this.resize(options.originalWidth, null, {
              originalWidth: options.originalWidth,
              tryingStretch: false,
              tryingMultiLine: true
            });
          }
        } else {
          this._applyCopyFixes();
        }
      }
    },

    mouseover: {
      value: function() {
        if (!Utils.isMobile) {
          this.button.classList.add('hover');
        }
        this.arrow.querySelector('svg').line.setAttribute('stroke', this.data.color[0]);
      }
    },

    mouseout: {
      value: function() {
        if (!Utils.isMobile) {
          this.button.classList.remove('hover');
        }
        this.arrow.querySelector('svg').line.setAttribute('stroke', this.data.color[1]);
      }
    },

    preview: {
      value: function() {
        this.setAttribute('arrow', '');
        this.setAttribute('border', '');
        this.setAttribute('size', 12);
      }
    },

    _applyCopyFixes: {
      value: function() {
        var xFix = this.getAttribute('copy-x-fix');
        var yFix = this.getAttribute('copy-y-fix');
        var parsedXFix = parseFloat(xFix);
        var parsedYFix = parseFloat(yFix);
        // whether to apply copy-y-fix to copy on multiple lines
        var yFixOnMultiLine = this.getAttribute('y-fix-on-multiLine') !== null;

        if (parsedXFix || parsedYFix) {
          TweenMax.set(this.copy, {
            x: xFix ? '+=' + parsedXFix : 0,
            y: yFix && (!this._multiLine || yFixOnMultiLine) ? '+=' + parsedYFix : 0
          });
        }
      }
    }
  });

  component.observedAttributes = LAYOUT_ATTRIBUTE_LIST;
  if (document.createElement(COMPONENT_NAME).constructor.__proto__ !== window.HTMLElement) {
    document.registerElement(COMPONENT_NAME, {
      prototype: component
    });
  }
})();
