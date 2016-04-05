var s,
    dashboard = {
      
      settings : {
        html: $('html'),
        body: $('body'),
        instances: $(".instance"),
        dataValue: $(".instance-detail-value"),
        dataNeedle: $(".instance-box-dial-needle"),
        updateTimeHolder: $(".instance-detail-lastChange > .time"),
        triggerQueue: []
      },

      init: function() {
        s = this.settings;

        this.instanceLineup();
      },

      instanceLineup: function() {
        for (var i = s.instances.length - 1; i >= 0; i--) {
          var instance = s.instances[i];

          dashboard.getData($(instance));
          dashboard.queueTriggers($(instance));

          if (i == 0) {
            setTimeout(function() {
              dashboard.triggerData();
            }, 200);
          };
        };
      },

      getData: function(instance) {
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
          var message = JSON.parse(e.data);

          var data = message.data,
              time = message.published_at,
              needlePos = dashboard.needlePosition(data, type),
              relTime = dashboard.timeRelative(time);

          instance.find(s.dataValue).text(data);
          instance.find(s.dataNeedle).css("transform", "rotate("+needlePos+"deg)");
          instance.find(s.updateTimeHolder).text(relTime);
          lastUpdate = time;
        });

        if (lastUpdate) {
          setInterval(function() {
            var relTime = dashboard.timeRelative(lastUpdate);
            instance.find(s.updateTimeHolder).text(relTime);
          }, 5000);
        };

      },

      queueTriggers: function(instance) {
        var trigger = instance.data("trigger"),
            id = instance.data("id"),
            token = instance.data("token"),
            url = "https://api.particle.io/v1/devices/"+id+"/"+trigger+"?access_token="+token;

        if ($.inArray(url, s.triggerQueue) == -1) {
          s.triggerQueue.push(url);
        };
      },

      triggerData: function() {
        var triggers = s.triggerQueue;

        for (var i = triggers.length - 1; i >= 0; i--) {
          $.ajax({
            url: triggers[i],
            method: "POST",
            data: { args : "get" },
            dataType: "json"
          });
        };
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
  dashboard.init();
});
