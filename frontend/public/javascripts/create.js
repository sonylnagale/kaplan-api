$(document).ready(function(){
  let next = 1;
  $(".add-more").click(function(e){
    e.preventDefault();
    let addto = "#field" + next;
    let addRemove = "#field" + (next);
    next = next + 1;
    let newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="tags[]" type="text">';
    let newInput = $(newIn);
    let removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
    let removeButton = $(removeBtn);
    $(addto).after(newInput);
    $(addRemove).after(removeButton);
    $("#field" + next).attr('data-source',$(addto).attr('data-source'));
    $("#count").val(next);
    $('.remove-me').click(function(e){
        e.preventDefault();
        let fieldNum = this.id.charAt(this.id.length-1);
        let fieldID = "#field" + fieldNum;
        $(this).remove();
        $(fieldID).remove();
    });
  });
});
