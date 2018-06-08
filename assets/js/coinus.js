var $html = $('html'),
    $body = $('body');

var Coinus = (function(){

  function Coinus() {
    this.init();
  }

  Coinus.prototype = {
    init: function() {
      this.v = 0;
      this.total = 0;
      this.DUR = 0.7;

      this.$chartCircle = $('.ct-chart--circle');
      this.$chartBar = $('.ct-chart--bar');
      this.$selecbox = $('.selectbox');

      this.$chartBar.length && this.chartBar();
      this.$chartCircle.length && this.chartCircle();
      this.$selecbox.length && this.selectToggle();
    },
    chartBar: function() {
      var self = this;

      this.$chartBar.each(function(i, el){
        var $el = $(el),
            value = $el.data('value'),
            total = $el.data('total'),
            unit = $el.data('unit'),
            average = ((value/total)*100).toFixed(0);

            self.total += total;
            self.v += value;

        $el.append('<div class="ct-value--bar"></div><div class="ct-value">'+value+unit+'<span lang="en" class="ct-average">'+average+'%</span></div>');

        var $value = $el.find('.ct-value--bar');

        $value.css('width', average+'%');
      });
    },
    chartCircle: function() {
      var self = this,
          value = this.v,
          total = this.total,
          unit = this.$chartCircle.data('unit'),
          average = ((value / total) * 100).toFixed(0),
          containerHeight = this.$chartCircle.parent().outerHeight(),
          count = {
            start: 0
          },
          el = null,
          $chartist = null;

      // 100% 초과할 경우
      average < 100 ? average : average = 100;

      el = '<div lang="en" class="ct-total">'+total+'<span>'+unit+'</span></div><div lang="en" class="ct-value">'+value+'<span>'+unit+'</span></div><div lang="en" class="ct-average"><span class="ct-average-cell">Total<b>'+average+'</b></span></div>';

      this.$chartCircle.append(el);

      TweenMax.to(count, this.DUR, {
        start: average,
        onUpdate: function () {
          self.addNum($('.ct-average b'), count.start);
        }      
      });

      $chartist = new Chartist.Pie('.ct-chart--circle', {
        series: [total, total, value]
      }, {
        donut: true,
        showLabel: false,
        total: total
      });

      if(!$html.hasClass('ie')) {
        setTimeout(function() {
          var $el = $('.ct-chart-donut'),
              $path = $el.find('path');

          $path.each(function(i, el){
            var length = $(el).get(0).getTotalLength();
            
            TweenMax.set($(el), {
              strokeDasharray: length
            });

            TweenMax.fromTo($(el), self.DUR, {
              delay: 0.1,
              strokeDashoffset: length
            }, {
              strokeDashoffset: length * 2
            });            
          });
        }, 1);

      }   
    },
    selectToggle: function() {
      this.$selecbox.on({
        'click': function(){
          var $el = $(this);
          $el.toggleClass('is-toggle');
        },
        'focusout': function(){
          var $el = $(this);

          if($el.hasClass('is-toggle')) {
            $el.toggleClass('is-toggle');
          }
        }
      });
    },
    addNum: function($target, num) {
      num = Math.ceil(num);
      $target.html(Math.ceil(num)+'%');
    }   
  };

  return Coinus;
})();

var Dropdown = (function() {
    var arrKey = [38, 40];

    function Dropdown() {
        this.$select = $('div.dropdown');
        this.$options = this.$select.find('.dropdown-option');

        this.setup();
    }

    Dropdown.prototype = {
        setup: function() {
            var self = this;

            self.$select.each(function() {
                var $box = $(this),
                    $selector = $box.find('.dropdown-selector'),
                    $selected = $box.find('.dropdown-text'),
                    $list = $box.find('.dropdown-option'),
                    $items,
                    selected = '',
                    islink = !!$list.find('a').length,
                    itemSelector = (islink) ? 'a' : 'li';

                function init() {
                    var top = 0;

                    $selector.attr('tabindex', 0);

                    setAttr();
                    self.setStyle($box);

                    self.$select.on('click.dropdown', function(e) {
                        // e.preventDefault();
                        e.stopPropagation();
                    });

                    // events
                    $list.on('click', itemSelector, function() {

                        if ( $(this).hasClass('is-disabled') ) {
                            $(this).blur();
                        } else {
                            select(this);
                        }
                    });

                    $list.on('keydown', itemSelector, function(e){
                        var item = this,
                            $li = self.getItem(itemSelector, item),
                            i = $(item).data('index');

                        switch (e.keyCode) {
                            // enter
                            case 13:
                                if(!islink) {
                                    !$li.hasClass('is-disabled') && $(item).trigger('click');

                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                                break;

                            // tab or esc
                            case 9:
                            case 27:
                                afterSelect();

                                e.preventDefault();
                                e.stopPropagation();
                                break;

                            // left or up
                            case 37:
                            case 38:
                                $li.prev().length && $items.eq(i - 1).focus();
                                break;

                            // right or down
                            case 39:
                            case 40:
                                $li.next().length && $items.eq(i + 1).focus();
                                break;
                        }
                    });

                    $list.on('focus', itemSelector, function() {
                        var item = this,
                            $li = self.getItem(itemSelector, item);
                        $li.addClass('is-active');
                    });

                    $list.on('blur', itemSelector, function() {
                        var item = this,
                            $li = self.getItem(itemSelector, item);
                        $li.removeClass('is-active');
                    });

                    $selector.on('click keydown', function(e) {
                        if (e.type === 'click' || e.keyCode == 13) {
                            if ( $box.data('is-open') ) {
                                self.close($box);
                            } else {
                                open();
                                if ( e.keyCode == 13 ) {
                                    $items.eq(0).focus();
                                }
                            }
                            e.preventDefault();
                        }
                    });

                    $body.on('click', function() {
                        self.close($box);
                    });

                    // 선택된 아이템 처리
                    if ($list.has('.is-current').length || $list.find(':checked').length) {
                        if (islink) {
                            $list.find('.is-current').addClass('is-active');
                            $selected.html($list.find('.is-current').html());
                        } else {
                            top = $(window).scrollTop();
                            $list.find(':checked').parent().click();
                            $list.find('.is-current').click();
                            $(window).scrollTop(top);
                            $selector.blur();
                        }
                    }
                }

                function select(obj) {
                    var $el = $(obj),
                        has_el = !!$el.find('.select-item').length;

                    if ( has_el ) {
                        selected = $el.find('.select-item').html();
                    } else {
                        selected = $el.text();
                    }

                    $list.find('li').removeClass('is-current');
                    $el.parent('li').addClass('is-current');

                    $selector.find('>span').html( selected );

                    if ( !islink ) {
                        $list.find('input').prop('checked', false);
                        $items.removeClass('is-current');

                        $el.find('input').prop('checked', true).trigger('change');
                        $el.addClass('is-current');
                    }
                    afterSelect();
                }

                function setAttr() {
                    $items = ( islink ) ? $list.find('a') : $list.find('li');

                    $items.each(function(i, el) {
                        $(el).data('index', i);
                    });

                    if ( !islink ) {
                        $items.attr('tabindex', 0).find('input[type=radio]').attr('tabindex', '-1').each(function(idx, el) {
                            var $el = $(el), $label, id;

                            if ( $el.attr('id') && $el.attr('id') !== '' ) return;

                            id = $el.attr('name') + (idx + 1);
                            $el.attr('id', id);

                            $label = $el.parent('label') || $el.siblings('label');
                            $label.length && $label.attr('for', id);
                        });
                    }
                }

                function open() {
                    if ( $box.data('is-open') || self.isDisabled($box) ) return;

                    // li refresh 대비
                    setAttr();

                    self.open($box);
                }

                function afterSelect() {
                    self.close($box);
                    $selector.focus();
                }

                $(function() {
                    init();
                });
            });

            $(window).on('resize', function(){
                self.$select.each(function(i, el){
                    self.setStyle($(el));
                });
                self.allClose();
            });
        },
        getItem: function(itemSelector, el) {
            return (itemSelector === 'a') ? $(el).parent() : $(el);
        },
        open: function($box) {
            this.allClose();
            $box.addClass('is-active').css('zIndex', 80).data('is-open', true);
            $box.find('.dropdown-option').show();
            this.blockArrow();
        },
        close: function($box) {
            this.$options.hide();
            $body.off('keydown.blockArrow');
            $box.removeClass('is-active').css('zIndex', '').data('is-open', false);
        },
        setStyle: function($box) {
            var $selector = $box.find('.dropdown-selector'),
                $list = $box.find('.dropdown-option'),
                islink = !!$list.find('a').length,
                $testItem = (islink) ? $list.find('a') : $list.find('label'),
                itemWidth, selectorWidth;

            // for resize
            $selector.width('');
            $list.show().css({'visibility':'hidden', 'width':''});

            if ( !$box.hasClass('dropdown--wide') ) {
                itemWidth = parseInt($testItem.width());
                selectorWidth = parseInt($selector.width());
                // boxWidth = parseInt($box.width());

                $selector.width(Math.max(itemWidth, selectorWidth));
            }

            $list.css({'visibility':'visible', 'width':'100%'}).hide();
        },
        allClose: function() {
            this.close(this.$select);
        },
        blockArrow: function() {
            $body.on('keydown.blockArrow', 'li', function(event) {
                var key = event.which;

                if( $.inArray(key, arrKey) > -1 ) {
                    event.preventDefault();
                }
            });
        },
        isDisabled: function($box) {
            if ( $box.hasClass('is-disabled') && $box.data('disabled-msg') ) {
                alert($box.data('disabled-msg'));
            }
            return $box.hasClass('is-disabled');
        }
    };

    return Dropdown;
})();

$(function() {
  new Coinus();
  new Dropdown();
});
