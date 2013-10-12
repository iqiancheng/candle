$(function() {
  $('#server').val(localStorage.server);

  var to_email = localStorage.to_email;
  if (to_email) {
      var splitter = to_email.split('@');
      if (splitter.length > 1 ) {
        $('#kindle-email-name').val(splitter[0]);
        $('#kindle-email-domain').val(splitter[1]);
      }
  }

  $('#save-btn').click(function(){
    localStorage.server = $('#server').val();
    localStorage.to_email = $('#kindle-email-name').val() + 
        '@' + $('#kindle-email-domain').val();
    $('#saved-tip').fadeIn(500).fadeOut(500);
  });
});
