(function ($) {
  $(function () {
 
        calculate();
 
        jQuery('#calculator input').keyup(function() {
            this.value = this.value.replace(/[^0-9\.,]/g, '');
            this.value = this.value.replace(/[,]/, '.');
        });
        jQuery('.calc input, .calc select').change(function() {
            calculate();
        });
        jQuery('.calc input').keyup(function() {
            calculate();
        });
        function calculate() {
      $('.calc').each(function(key, val){
        calcInputs = {};
            $(this).find('input, select').each(function(key, val){
                name = $(this).attr('name');
                val = $(this).val();
                if (!$.isNumeric(val)) {
                    switch (name) {
                        case 'area':
                            val = "";
                            break;
                        default:
                            break;
                    }
                    $(this).val(val);
                }
                calcInputs[name] = val;
            });
 
            total = 0;
 
            switch (calcInputs.material) {
                case 'MSD':
            total += calcInputs.area * 390;
            break;
                case 'Pongs':
            total += calcInputs.area * 469;
            break;
                case 'CTN':
            total += calcInputs.area * 700;
            break;
            default:
            break;
            }
 
        install = calcInputs.area * 0;
        total += install;
 
            total += '';
            jQuery(this).find('span.total').html(total);
      });
        }
 
    });
})(jQuery);
;