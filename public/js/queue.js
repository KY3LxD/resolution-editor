/*jshint esversion: 5, browser: true, varstmt: false, jquery: true */
/*exported*/

//the template dom element for the list
var templateItem;

//true when the check now link is alowed to work, prevents click spamming
var allowCheckNow = true;

//the last time the server was asked for an update
var lastUpdateTime = Date.now();

//how often the data is fetched, 30 seconds by default
var updateIntervalTime = 30000;

//the current first item
var firstItem;

//message and list elements
var list, errorMsg, noItems;

//config is set by specific page code
var updateListConfig = { };

//returns a nice time text description
function getTimeText(time) {
  //super short
  if (time < 30) {
    return "Just now";
  }

  //really short
  if (time < 60) {
    return "Less than a minute";
  }

  //pretty short
  if (time < 120) {
    return "Two minutes";
  }

  //less than 120 minutes
  time /= 60;
  if (time < 120) {
    return Math.round(time) + " minutes";
  }

  //less than 48 hours
  time /= 60;
  if (time < 48) {
    return Math.round(time) + " hours";
  }

  //really long: any amount of days
  return Math.round(time / 24) + " days";
}

//sets the basic attributes of a list item with a given data object
function setBasicAttribs(data, elem) {
  //set content in subelements
  elem.find(".item-token").text(data.token).attr("href", "/resolution/editor/" + data.token);
  elem.find(".item-year").text(data.idYear);
  elem.find(".item-id").text(data.resolutionId);

  //set forum and main sponsor
  elem.find(".item-forum").text(data.address.forum);
  elem.find(".item-sponsor").text(data.address.sponsor.main);

  //set age, get delta time in seconds and convert to time text
  elem.find(".item-age").text(getTimeText((Date.now() - data.waitTime) / 1000));
}

//does a list update if the last one was more than 30 seconds ago
function updateTimer() {
  //get time since last update
  var timeDiff = Date.now() - lastUpdateTime;

  //was long enough ago
  if (timeDiff > updateIntervalTime) {
    //update now, will reset timer
    updateList();

    //set to start again in 30 seconds
    setTimeout(updateTimer, updateIntervalTime);
  } else {
    //try again in how much time is left until 30 seconds is reached
    setTimeout(updateTimer, updateIntervalTime - timeDiff);
  }
}

//updates the list of resolutions
function updateList() {
  //get new list from server
  $.get(updateListConfig.url).done(function(data) {
    //hide error message, we got some data
    errorMsg.hide();

    //if there are any items to display
    //list is interpreted as last items being oldest -> top of list -> to be worked on first
    if (typeof data === "object" && data instanceof Array && data.length) {
      //show list and hide message for no items
      list.show();
      noItems.hide();

      //get the next first item from the list
      var newFirst = data.pop();

      //run pre copyh andler if given
      if (typeof updateListConfig.preCopyHandler === "function") {
        updateListConfig.preCopyHandler(newFirst, firstItem);
      }

      //copy over first item
      firstItem = newFirst;

      //set display of first item in special first item box
      var firstElem = $("#first-item");

      //set basic attribs for first element
      setBasicAttribs(firstItem, firstElem);

      //set print amount of pages per document, question mark if not given
      $("#item-print-length").text(
        (firstItem.pageAmount &&
         firstItem.pageAmount +
         (firstItem.pageAmount === 1 ? " page" : " pages") //correct plural
        ) || "? pages");

      //remove all list items that exceed the amount of items in the list
      list.children(".list-item").slice(data.length).remove();

      //given that there are items left
      if (data.length) {
        //set data in the left over elements
        list.children(".list-item").each(function() {
          //set attributes of this item
          setBasicAttribs(data.pop(), $(this));
        });

        //for any remainin data items, add new items
        data.reverse().forEach(function(item) {
          //make a clone of the template, add it to the list and add data to it
          setBasicAttribs(item, templateItem.clone().appendTo(list));
        });
      }
    } else {
      //hide list (makes an ugly line otherwise) and show no items message
      list.hide();
      noItems.show();
    }
  }).fail(function() {
    //hide other things
    noItems.hide();
    list.hide();

    //show error message, request went wrong
    errorMsg.show();
  });

  //reset timer
  lastUpdateTime = Date.now();
}

//on document ready
$(document).ready(function() {
  //detach the template element from the list
  templateItem = $("#item-template").detach().removeClass("hide-this").removeAttr("id");

  //get queue elements
  list = $("#queue");
  errorMsg = $("#error-msg");
  noItems = $("#no-items-msg");

  //register handler on link to update the list
  var checkNow = $("#update-data-now");
  checkNow.on("click", function() {
    //only if allowed right now
    if (allowCheckNow) {
      //update list now
      updateList();

      //grey out text and disable flag
      checkNow.addClass("grey-text");
      allowCheckNow = false;

      //and re-enable in a few seconds
      setTimeout(function() {
        //set flag back and enable text again
        allowCheckNow = true;
        checkNow.removeClass("grey-text");
      }, 3000);
    }
  });

  //start first, will queue itself to run updateList in 30 seconds
  updateTimer();
});
