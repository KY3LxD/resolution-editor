/*jshint asi: false, esnext: false, browser: true, jquery: true, indent: 2*/
//all countries/orgs that can be sponsors or co-sponsors
var listOfSponsors = {
  "Placeholder Coutry": "http://placehold.it/250x250",
  "Italy": null,
  "China": null,
  "United States of America": null,
  "Germany": null
};

//all phrases possible in the two different clause types
var listOfPreambPhrases = {
  "Notices": null,
  "Approves of": null,
  "BLAHBLAHBLAH": null,
  "Calls out with joy": null
};
var listOfOpPhrases = {
  "Recommends": null,
  "Calls uppon": null,
  "other things": null
};

//data used to inititalize input fields/thingies and their other options
var initData = {
  "#co-spon": {
    autocompleteOptions: {
      data: listOfSponsors,
      limit: 20,
      minLength: 1
    },
    secondaryPlaceholder: "Co-Sponors",
    placeholder: "Co-Sponors"
  },
  "#main-spon": {
    data: listOfSponsors,
    limit: 20,
    minLength: 1
  },
  "#preamb-clauses .phrase-input": {
    data: listOfPreambPhrases,
    limit: 20,
    minLength: 1
  },
  "#op-clauses .phrase-input": {
    data: listOfOpPhrases,
    limit: 20,
    minLength: 1
  },
  ".simple-input": {} //normal inout fields need to init data but need to be in this object in order to have all their events registered
};

//resets sibling labels
function resetSiblingLabels(field) {
  //get the siblings of the field and reset them by removing the active class
  $(field).siblings("label").removeClass("active");
}

//types of initialization to do
var fieldTypes = [
  {
    typeSelector: ".autocomplete",
    events: {
      init: function(event) {
        //first convert plain html element to jQuery element because the materialize functions only work on that
        $(this).autocomplete(event.data);
      },
      reset: function(element, data) {
        //reset by setting value to empty string
        $(this).val("");

        //also reset label for this field
        resetSiblingLabels(this);
      }
    }
  },
  {
    typeSelector: "input",
    events: {
      init: function(element, data) { },
      reset: function(element, data) {
        $(this).val("");
        resetSiblingLabels(this);
      }
    }
  },
  {
    typeSelector: ".chips",
    events: {
      init: function(element, data) {
        $(this).material_chip(event.data);
      },
      reset: function(element, data) {
        console.log("fired chips reset");
        $(this).empty();
        $(this).trigger("init");
      }
    }
  }
];

//do things when the document has finished loading
$(document).ready(function(){
  //attach event handlers to all things that match in data
  for (var selector in initData) {
    //data for this element
    var elementInitData = initData[selector];

    //get the element we should do an init with
    var element = $(selector);

    //check with the type selector until we find a match
    var typeIndex = 0;
    while (typeIndex < fieldTypes.length && ! element.is(fieldTypes[typeIndex].typeSelector)) {
      typeIndex ++;
    }

    //stop for this element if cant find type
    if (typeIndex === fieldTypes.length) {
      console.log("exited element", element);
      continue;
    }

    //if there actually was a match then attach all the events for this type
    if (typeIndex < fieldTypes.length) {
      var typeEvents = fieldTypes[typeIndex].events;
      for (var eventName in typeEvents) {
        console.log(eventName, typeIndex);
        //pass function that has the element and data bound
        element.on(eventName, elementInitData, typeEvents[eventName]);
      }
    }
  }

  //trigger all init events
  $("#editor-main").find("*").trigger("init");

  //register reset buttons
  $(".reset-button").click(function(event) {
    //trigger reset for all contained elements
    $("#" + event.currentTarget.getAttribute("for"))
      .find("*")
      .trigger("reset");
  });
});
