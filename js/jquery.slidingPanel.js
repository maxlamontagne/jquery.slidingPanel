/**
 * jQuery Sliding Panel 1.0
 * By Maxime Lamontagne <maxlamontagne@gmail.com>
 *
 * Copyright 2014 Maxime Lamontagne
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($){
    'use strict';

    $.fn.slidingPanel = function(options) {

        return this.each(function() {

            var config = $.extend({
                duration: 400,
                easing: 'swing',
                onInitialize: function(panel, button) {},
                onShow: function(panel, button) {},
                onHide: function(panel, button) {}
            }, options || {});

            if (!config.side) {
                config.side = $(this).attr('data-panel-side')
                            ? $(this).attr('data-panel-side')
                            : 'left';
            }

            $(this).bind('click', function(e) {

                var $button = $(this);

                var $panel = $button.attr('data-panel')
                           ? $($button.attr('data-panel'))
                           : $($button.attr('href'));

                var css = { position: 'fixed', top: 0 };
                css[config.side] = '-' + $panel.width() + 'px';

                $panel.css(css);

                if (!$panel.data('panel-initialized')) {

                    $panel.addClass('ui-sliding-panel')
                          .wrapInner('<div class="panel-content" />');

                    var animationProperties = {};

                    $panel.bind('show.slidingPanel', function(ev) {
                        if ($panel.data('panel-state') === 'animation') return;

                        $panel.data('panel-state', 'animation').show();
                        $panel.appendTo('body'); // Put in front
                        animationProperties[config.side] = '+=' + $panel.width();
                        config.onShow($panel[0], $button[0]);
                        $panel.animate( animationProperties,
                                        config.duration,
                                        config.easing,
                                        function() {
                                            $panel.addClass('panel-open')
                                                .data('panel-state', null);
                                        } );
                    });

                    $panel.bind('hide.slidingPanel', function(ev) {
                        if ($panel.data('panel-state') === 'animation') return;

                        $panel.data('panel-state', 'animation');
                        animationProperties[config.side] = '-=' + $panel.width();
                        config.onHide($panel[0], $button[0]);
                        $panel.animate( animationProperties,
                                        config.duration,
                                        config.easing,
                                        function() {
                                            $panel.hide()
                                                .removeClass('panel-open')
                                                .data('panel-state', null);
                                        } );
                    });

                    $panel.on('click', 'a[data-panel-close]', function(ev) {
                        $panel.trigger('hide.slidingPanel');

                        ev.preventDefault();
                        ev.stopPropagation();
                    });

                    $panel.appendTo('body')
                          .data('panel-initialized', true);

                    config.onInitialize($panel[0], $button[0]);
                }

                $panel.trigger( $panel.hasClass('panel-open')
                                ? 'hide.slidingPanel'
                                : 'show.slidingPanel' );

                e.preventDefault();
                e.stopPropagation();
            });

            return this;
        });
    }
})(jQuery);
