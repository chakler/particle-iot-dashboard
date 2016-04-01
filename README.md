# Particle IoT Dashboard

An online dashboard used to monitor sensors powered with [Particle](https://www.particle.io/).

---

## Installation

### Jekyll 

The dashboard uses [Jekyll](http://jekyllrb.com), a static site generator, to generate the dashboard for you. Since Jekyll is based on [Ruby](https://www.ruby-lang.org/), you’ll also need to install Ruby for the project.

To install Jekyll, run the following in your terminal:

```bash 
gem install jekyll
```

### Grunt

If you want to tweak the styles and the javascripts, you’ll need to install [Grunt](http://gruntjs.com/) to compile and minify the code. Grunt requires [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) to run so you’ll need to have those two first.

To install Grunt, simply run the following in your terminal:

```bash
npm install
```

## Setup

### Particle

There are basically two components that make the data work, one is the **event feed**, another one is the **trigger**.

#### Event feed

The event feed is where the dashboard gets the Particle data from. It is done by publishing data from your device to the Particle cloud.

To publish data, add the following to your Particle code:

```c++
Particle.publish(“eventName”, data);
// e.g. Particle.publish("temperature", “25°c”);
```

To see if it works, check your [Particle logs](https://dashboard.particle.io/user/logs).

#### Trigger

Since temperature and humidity data won’t usually be fed to the cloud every single second, there is a possibility where there’s no data that can be seen immediately by the dashboard. To fix this, we need to trigger a function to publish data to the Particle cloud when we load the dashboard.

First thing to do is to put the following code inside ```void setup()``` to expose the trigger:

```c++
Particle.function(“triggerName”, triggerFunction);
// e.g. Particle.function("getTemp", getCurrentTemp);
```

Then you’ll need to create the trigger function and put the data publishing code inside of the function:

```c++
int triggerFunction(String command) {
    Particle.publish(“eventName”, data);
    return 1;
}

// e.g.
// int getCurrentTemp(String command) {
//     Particle.publish("temperature", tempPublish);
//     return 1;
// }
```

### Dashboard

In the dashboard, every data presentation is called an **Instance**, and in every instance, there is a **name**, a **dial**, a **data value**, and a **last-change time**.

To create a new instance, follow the template and create a new ```.md``` file inside the ```_instances``` folder:

```yaml
---
# Give the instance a name
title: Instance name

# The data type of the instance
# There are only two data types available right now—temperature and humidity
type: temperature

# The order of the instance
# One with a lower number comes first
order: 1

particle:
  # The event name of the event feed
  event: temp
  
  # The Device ID of your Particle device
  deviceID: 123412341234123412341234
  
  # The access token to your Particle account
  accessToken: 1234abcd1234abcd1234abcd1234abcd1234abcd
  
  # The trigger name of your trigger function
  triggerFunction: triggerFunction
---
```

For example:
```yaml
---
title: Room Temperature
type: temperature 
order: 1
particle:
  event: temp
  deviceID: 123412341234123412341234
  accessToken: 1234abcd1234abcd1234abcd1234abcd1234abcd
  triggerFunction: getTemp 
---
```

## Use

### Local

To compile and serve the the dashboard locally, type in the following into the terminal and hit enter:

```bash
jekyll serve
```

Then open ```127.0.0.1:4000``` in your browser.

### Github

Since the dashboard is created with Jekyll, it’s compatible with Github Pages. Just push the code to the ```gh-pages``` branch or your repository and voila!

Check out [Github Pages](https://pages.github.com/) for more info.

### Host it somewhere else

To host the dashboard somewhere else, compile the site by entering the following in the terminal:

```bash
jekyll build
```

The site will be generated in a folder call ```_site```. You can then upload the content inside the ```_site``` folder to your hosting.

## Edit

### CSS

The CSS of this project is written in [Sass](http://sass-lang.com/). To edit the styles, edit ```css/dev/main.scss```, then compile it by running:

``` bash
grunt css
```

You can also have Grunt watch for any changes in the ```scss``` file and auto-compile it by running:

```bash
grunt
```

### Javascript

There are two js files in this project—```plugins.js``` and ```main.js```. They are uglified and built into one single ```main.min.js```. If you’ve made any changes, always remember to uglify the code by running:

```bash
grunt js
```

Or just like the CSS, you can always have Grunt to watch and take care of the js by running:

```bash
grunt
```

## FAQ
- **How is this dashboard different from Particle’s own dashboard?**

  Particle’s own dashboard is used to see if things are working properly so the visuals are more event oriented. The IoT Dashboard is used to display the current data published by your devices, hence the visuals are more data oriented, it aims to show you the current data clearly.
  
- **Does the IoT dashboard store any data?**
   
   No, it only shows you the most recent data published by your device.
   
- **Do you have plan on expanding the number of data types supported?**
   
   Yes, the power data type with probably be added next. If you have any suggestions, contribute by improving the code and [make a pull request](https://github.com/chakler/particle-iot-dashboard/pulls), or just [file an issue](https://github.com/chakler/particle-iot-dashboard/issues).
 
## License

Particle IoT Dashboard is licensed under the terms of the MIT license.

See the [LICENSE](https://github.com/chakler/particle-iot-dashboard/blob/master/LICENSE.md) file for license rights and limitations (MIT).

## Authors

The project is created and maintained by Aceler Chua ([Website](http://aclr.co), [Twitter](https://twitter.com/chakler)) with the help of [these kind people](https://github.com/chakler/particle-iot-dashboard/graphs/contributors).