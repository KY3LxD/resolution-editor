/*jshint esversion: 5, browser: true, varstmt: false, jquery: true */

//sets the state of a class (adding or removing)
$.fn.classState = function(state, className) {
  //add or remove class depending on flag value
  this.each(function() {
    $(this)[state ? "addClass" : "removeClass"](className);
  });
  return this;
};

//hides and unhides by adding or removing hide-this
$.fn.setHide = function(makeHidden) {
  //modify class status
  return this.classState(makeHidden, "hide-this");
};

//sets the disabled state for element by adding or removing the .disabled class
$.fn.disabledState = function(makeDisabled) {
  //set class state for .disabled
  return this.classState(makeDisabled, "disabled");
};

//triggers several events in order
$.fn.triggerAll = function(eventNames, params) {
  //trigger all events with params
  eventNames.split(/[ ,]+/).forEach(function(event) {
    this.trigger(event, params);
  }, this);

  //return this for chaining
  return this;
};

//navigation collapse
$(document).ready(function() {
  //init collapsable navbar
  $(".button-collapse").sideNav();

  //init help dropdown menu
  $(".dropdown-button").dropdown({
    constrainWidth: false,
    hover: true
  });

  //register event handlers
  $("body")
  .on("touchstart", function() {
    //register touch event and remove tooltips for touch-devices
    $(".tooltipped").tooltip("remove");
  });
});

//check for old browser and alert
if (typeof Array.prototype.map !== "function") {
  alert("You are using a severely outdated browser and we strongly encourage you to update" +
        " it immediately. Because of that, this website may not work as expected and you may face" +
        " security issues (not just with this website, but in general).");
}
