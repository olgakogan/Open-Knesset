function hide_annotation_form(annoid) {
    $("#annotationform-"+annoid).hide();
    $("#annotations-"+annoid).show();
    $("#selectable-"+annoid).text(gettext("Annotate"));
    $("#annotationrealform-"+annoid)[0].reset();
    $("#editable-"+annoid).show();
    if(annotation_objects[annoid].annotation_count >0){
      $("#annotationtoolbox-"+annoid).show();
    }
}
$(function(){
    $(".annotation-form").hide();
    $(".annotation-content").each(function(){
        var annoid = $(this).attr("id").split("-")[1];
        annotation_objects[annoid] = new Annotations(annoid);
    });
    for(var a in annotation_objects){
        annotation_objects[a].importQuotes();
        annotation_objects[a].insertQuotes();
    }
    $(".annotationform-cancel").click(function(e) {
        e.preventDefault();
        var annoid = $(this).attr("id").split("-")[1];
        annotation_objects[annoid].toggleSelectView();
        hide_annotation_form(annoid);
    });
    $(".annotationform-link").click(function(e){
      e.preventDefault();
      if (!window.logged_in) {
          var msg = gettext("Sorry, only logged users can annotate.")+$("#message_login").html()
          $.jGrowl(msg, {sticky: true});
          return false
      }
      var annoid = $(this).attr("id").split("-")[1];
      annotation_objects[annoid].toggleSelectView();
      if($("#annotations-"+annoid).css("display")=="none"){
        hide_annotation_form(annoid);
      } else{
        $(this).text(gettext("Cancel"));
        $("#annotationform-"+annoid).show();
        $("#annotations-"+annoid).hide();
        $("#editable-"+annoid).hide();
        $("#annotationtoolbox-"+annoid).hide();
      }
    });
  $(".markall").click(function(e){
    var aid = $(this).attr("id").split("-")[1];
    if($(this).attr('checked')){
      annotation_objects[aid].updateDefaultAnnotationColor("self");
    } else{
      annotation_objects[aid].updateDefaultAnnotationColor("inherit");
    }
  });
  $(".annotationrealform").submit(function(e){
    var id = $(this).attr("id").split("-")[1];
    if($("#selection_start-"+id).val()=="" || $("#selection_end-"+id).val()==""){
      alert(gettext("Please make a selection."));
      e.preventDefault();
      return false;
    }
    return true;
  });
  $(".reallydelete").live("submit", function(e){
    if (!window.is_staff){
        var msg = $("#message_staff").html()
        $.jGrowl(msg, {sticky: true});
        return false
    }
    return confirm(gettext('Delete can not be un-done. Are you sure?'));
  });
  $(".annotationflagselect").change(function(e){
    var id = $(this).parents("form").attr("id").split("-")[1];
    var val = parseInt($(this).val());
    var color = null;
    switch(val){
      case 0: // Put more colors here
        color = "#99ccff"; break;
    }
    if(color != null){
      $("#color_value").val(color);
      $("#annotationcolor-"+id).val(color);
      $("div.color_picker").css("background-color", color); 
    }
  });
  $(".toggle").live("click", function(e){
     e.preventDefault();
     var id = $(this).attr("id");
     if (id == ""){
       var url = $(this).attr("href");
       var sel = $("."+url.substring(1,url.length)+"-container");
     } else {var sel = $("#"+id+"-container");}
     sel.toggle();
  });
  $('input[name=color]').colorPicker();
});
