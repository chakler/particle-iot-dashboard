var s,
    lastUpdate,
    checker = {
      
      settings : {
        html: $('html'),
        body: $('body'),
        instances: $(".instance"),
        tempValue: $(".tempDetail-temp"),
        tempNeedle: $(".tempBox-dial-needle"),
        updateTimeHolder: $(".tempDetail-lastUpdate > .time")
      },

      init: function() {
        s = this.settings;

        this.instanceLineup();
      },

      instanceLineup: function() {
        for (var i = s.instances.length - 1; i >= 0; i--) {
          var instance = s.instances[i];

          checker.getTemp($(instance), function() {
            setTimeout(function() {
              checker.triggerTemp($(instance));
            }, 200);
          });
        };
      },

      getTemp: function(instance, callback) {
        var mEvent = instance.data("event"),
            id = instance.data("id"),
            token = instance.data("token");

        var url = "https://api.particle.io/v1/devices/"+id+"/events/"+mEvent+"?access_token="+token;
        var stream = new EventSource(url);
        var lastUpdate;

        stream.onerror = function(e) {
          s.body.prepend('<div class="errorMessage"></div>');
          $(".errorMessage").html('This is taking longer than usual, let’s just <a href="#" onclick="location.reload();">refresh the page</a>.')
        };

        stream.addEventListener("temperature", function(e) {
          var message = JSON.parse(event.data);

          var temp = message.data,
              time = message.published_at,
              needlePos = checker.needlePosition(temp),
              relTime = checker.timeRelative(time);

          instance.find(s.tempValue).text(temp);
          instance.find(s.tempNeedle).css("transform", "rotate("+needlePos+"deg)");
          instance.find(s.updateTimeHolder).text(relTime);
          lastUpdate = time;
        });

        setInterval(function() {
          var relTime = checker.timeRelative(lastUpdate);
          instance.find(s.updateTimeHolder).text(relTime);
        }, 30000);

        callback();
      },

      triggerTemp: function(instance) {
        var trigger = instance.data("trigger"),
            id = instance.data("id"),
            token = instance.data("token");

        $.ajax({
          url: "https://api.particle.io/v1/devices/"+id+"/"+trigger+"?access_token="+token,
          method: "POST",
          data: { args : "get" },
          dataType: "json"
        });
      },

      needlePosition: function(temp) {
        var step = 270/50;
        var basePosition = temp*step;
        var realPosition = basePosition-45;

        return realPosition;
      },

      timeRelative: function(time) {
        var updateTime = moment(time);
        var relativeTime = updateTime.fromNow();

        return relativeTime;
      }
    }

$(function() {
  checker.init();
});
