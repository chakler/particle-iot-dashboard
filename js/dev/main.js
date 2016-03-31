var s,
    lastUpdate,
    checker = {
      
      settings : {
        html: $('html'),
        body: $('body'),
        instances: $(".instance"),
        dataValue: $(".instance-detail-value"),
        dataNeedle: $(".instance-box-dial-needle"),
        updateTimeHolder: $(".instance-detail-lastChange > .time")
      },

      init: function() {
        s = this.settings;

        this.instanceLineup();
      },

      instanceLineup: function() {
        for (var i = s.instances.length - 1; i >= 0; i--) {
          var instance = s.instances[i];

          checker.getData($(instance), function() {
            setTimeout(function() {
              checker.triggerData($(instance));
            }, 200);
          });
        };
      },

      getData: function(instance, callback) {
        var mEvent = instance.data("event"),
            id = instance.data("id"),
            token = instance.data("token"),
            type = instance.data("type");

        var url = "https://api.particle.io/v1/devices/"+id+"/events/"+mEvent+"?access_token="+token;
        var stream = new EventSource(url);
        var lastUpdate;

        stream.onerror = function(e) {
          if (s.body.children(".errorMessage").length == 0) {
            s.body.prepend('<div class="errorMessage"></div>');
            $(".errorMessage").html('This is taking longer than usual, let’s just <a href="#" onclick="location.reload();">refresh the page</a>.')
          };
        };

        stream.addEventListener(mEvent, function(e) {
          var message = JSON.parse(event.data);

          var data = message.data,
              time = message.published_at,
              needlePos = checker.needlePosition(data, type),
              relTime = checker.timeRelative(time);

          instance.find(s.dataValue).text(data);
          instance.find(s.dataNeedle).css("transform", "rotate("+needlePos+"deg)");
          instance.find(s.updateTimeHolder).text(relTime);
          lastUpdate = time;
        });

        setInterval(function() {
          var relTime = checker.timeRelative(lastUpdate);
          instance.find(s.updateTimeHolder).text(relTime);
        }, 30000);

        callback();
      },

      triggerData: function(instance) {
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

      needlePosition: function(data, type) {
        switch (type) {
          case "temperature":
            var totalVal = 50;
            break;
          case "humidity":
            var totalVal = 100;
            break;
        }

        var step = 270/totalVal;
        var basePosition = data*step;
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
