/*jshint esversion: 5, browser: true, varstmt: false, jquery: true */

//preset code
var presetCode;

//true when the check now link is alowed to work, precents click spamming
var allowCheckNow = true;

//the template element for the list
var templateItem;

//removes the topmost element from the list and updates the list
function removeTopItem() {
  //remove top item
  $("#queue li").first().remove();

  //update list to make new top item
  updateList();
}

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
  elem.find(".item-token").text(data.token);
  elem.find(".item-year").text(data.idYear);
  elem.find(".item-id").text(data.resolutionId);
  console.log(data);
  //set age, get delta time in seconds and convert to time text
  elem.find(".item-age").text(getTimeText((Date.now() - data.waitTime) / 1000));
}

//updates the list of resolutions
function updateList() {
  //get queue elements
  var list = $("#queue");
  var errorMsg = $("#error-msg");
  var noItems = $("#no-items-msg");

  //get new list from server
  $.post("/queue/print/getitems", { code: presetCode }).done(function(data) {
    //hide error message, we got some data
    errorMsg.hide();

    //if there are any items to display
    if (typeof data === "object" && data instanceof Array && data.length) {
      //show list and hide message for no items
      list.show();
      noItems.hide();

      //list is interpreted as last items being oldest -> top of list -> to be worked on first
      //get first item
      var first = data.pop();

      //set display of first item in special first item box
      var firstElem = $("#first-item");

      //set basic attribs
      setBasicAttribs(first, firstElem);

      //set special attributes for header element
      var address = first.content.resolution.address;
      firstElem.find(".item-forum").text(address.forum);
      firstElem.find(".item-sponsor").text(address.sponsor.main);

      //remove all list items that exceed the amount of items in the list
      list.children(".list-item").slice(data.length).remove();

      //set data in the left over elements
      list.children(".list-item").each(function(index) {
        //set attributes of this item
        setBasicAttribs(data[index], $(this));
      });
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
}

//on document ready
$(document).ready(function() {
  //get code from document
  presetCode = $("#code-preset").text();

  //detach the template element from the list
  templateItem = $("#item-template").detach().removeClass(".hide-this");

  //do initial list update
  updateList();

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
});
