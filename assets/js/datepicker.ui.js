import '@fengyuanchen/datepicker/dist/datepicker';

var Datepicker = (function(){
  function Datepicker() {
    this.init();
  }
  Datepicker.prototype = {
    init: function(){
      $('[data-toggle="datepicker"]').datepicker({
        language: 'ko-KR',
        format: 'yyyy년 mm월 dd일',
        days: ['일', '월', '화', '수', '목', '금', '토'],
        daysMin: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        yearSuffix: '년',
        weekStart: 1,
        startView: 0,
        yearFirst: true,
        autoHide: true   
      });      
    }
  };
  return Datepicker;
})();

$(function() {
  new Datepicker();
});
