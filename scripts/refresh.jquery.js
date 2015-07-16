$.fn.refreshMe = function(opts){
      var $this = this,
          defaults = {
            ms:1500,
            parentSelector:'.panel',
            started:function(){},
            completed:function(){}
          },
          settings = $.extend(defaults, opts);
  
      var par = this.parents(settings.parentSelector);
      var panelToRefresh = par.find('.refresh-container');
      var dataToRefresh = par.find('.info h4');
      
      var ms = settings.ms;
      var started = settings.started;
      var completed = settings.completed;
      
      $this.click(function(){
        $this.addClass('fa-spin');
        panelToRefresh.show();
        if (dataToRefresh) {
          started(dataToRefresh);
        }
        setTimeout(function(){
          if (dataToRefresh) {
              completed(dataToRefresh);
          }
          panelToRefresh.fadeOut(800);
          $this.removeClass('fa-spin');
        },ms);
        return false;
      });
};