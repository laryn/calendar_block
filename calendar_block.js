function calendar() {
  var ref = {};
  ref.settings = {};
  ref.ajax_settings = {};

  ref.init = function() {
    ref.settings = Drupal.settings.calendar_block;
    //trace(ref.settings);

    ref.ajax_settings = {type: "POST", url: ref.settings.ajax_response_path, success:function(result) { ref.ajaxResponse(result)}};
    ref.getCalandar(ref.settings.date.month, ref.settings.date.year);
    ref.setColors(true);
  };
  
  ref.setWidth = function() {
    var width = parseInt(ref.settings.width);

    // Calculate the width of the weekdays
    var hok_width = Math.round(width / 7);
    // Calculate the width of the last weekday
    var last_hok_width = width - (6 * hok_width);
    // Calculate the width of the header
    var header_width = width - (2 * $('#calendar_prev').width());
    // Calculate the font size
    var font_size = Math.floor(hok_width / 2);
    // Calculate the top padding
    var padding_top = Math.floor((((hok_width - font_size) / 2) * 1.3) -1);

    $('#calendar_ajax').width(width);
    $('#calendar_month').width(header_width);
    $('.hok').width(hok_width);
    $('.week .hok span').css({
      'margin-top':padding_top + 'px',
      'font-size':(font_size - 2)  + 'px'
    }).parent().height(hok_width);
    $('#calendar_month').css({'font-size':font_size + 'px'});
    $('.hok.last').width(last_hok_width);
  };
  
  ref.setColors = function(init) {
    if (init) {
      $('#calendar_ajax').css({
        'background-color':ref.settings.background_color
      });
    }
    else {
      $('#calendar_ajax').css({
        'color':ref.settings.font_color,
      	'border':'solid 1px ' + ref.settings.border_color
      }).find('a').css({
        'color':ref.settings.link_color
      });
      $('#nav, .hok.top').css({
        'color':ref.settings.header_color
      });
    };
  };

  ref.getCalandar = function(month, year) {
    if (year && month) {
      ref.ajax_settings.data = {month:month, year:year};
    };
    $.ajax(ref.ajax_settings);
  };
  
  /**
   * Callback for the slider
   * Sets the width of the calender while the slider is dragged
   */
  ref.sliderSlide = function(e, ui) {
    ref.settings.width = ui.value;
    ref.setWidth();
  };

  ref.ajaxResponse = function(result) {
    delete(ref.ajax_settings.data);
    $("#calendar_ajax").html(result);
    ref.setWidth();
    ref.setColors();
    ref.addResponseListeners();
  };
  
  ref.addResponseListeners = function(result) {
    $("#calendar_prev, #calendar_next").click(function() {
      var date = $(this).attr('class').split('-');
      ref.getCalandar(date[0], date[1]);
    });
    
    $('#edit-background-color, #edit-font-color, #edit-header-color, #edit-link-color, #edit-border-color').change(function() {
      var elem = $(this).attr('id').replace(/edit-/, '').replace(/-/, '_');
      ref.settings[elem] = $(this).val();
      ref.setColors((elem == 'background_color'));
    });
  };
  
  return ref;
};

$(function() {
	Drupal.calendar = new calendar();
	Drupal.calendar.init();
});