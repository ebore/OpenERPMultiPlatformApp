// global vars
var MethodList;
var currentFieldID;

// get methods and info from server
function getMethods()
{
    // get server-url
    var server= $("#server_url").val();

    // show loading-picture
    $('#load_image').show();

    // set empty error and info-text
    setError('');
    setInfo('');

    // get array
    $.getJSON( "ajax.php", {f: "getMethods", srv: server},
        function(json)
        {
            // check json-return-value
            if(json)
            {
                // got we some response
                if(json.success == 'false')
                    setError(json.err);
                else
                {
                  //allright, we got the methods
                  MethodList = json.methods;
                  setMethodsToListbox();
                }
                
            }
            else
                setError("response is null");

            // hide loading-picture
            $('#load_image').hide();
        });
}

// set methods to listbox
function setMethodsToListbox()
{
    //@todo: check list

    // clear list
    $('#methodList').children().remove();
    
    // fill
    $.each(MethodList, function(index, itemData)
        {
            var option = "<option value='" + index + "' >" +
                itemData.ret + " " + itemData.name + "(" + itemData.param + ")" +
                "</option>";
            $('#methodList').append(option);
        });

    // show info-box
    setInfo(MethodList.length + ' methods were successful received from server.');
}

// get a response for a method from server
function getResponse()
{
    // get server-url and method-name
    var server= $("#server_url").val();
    var method = $('#method').val();

    // prepare param-array
    var params = new Array();
    for(i=1; i <= currentFieldID; i++)
    {
        params.push('string');
        params.push($(":input[name='param" + i + "']").val());
    }

    // show loading-picture
    $('#load_image').show();

    // set empty error and info-text
    setError('');
    setInfo('');

    // send json-request
    $.getJSON( "ajax.php", {f: "getResponse", srv: server, m: method, p: params},
        function(json)
        {
            // check json-return-value
            if(json)
            {
                // got we some response
                if(json.success == 'false')
                    setError(json.err);
                else
                {
                  //allright, we got the methods
                  $('#outbox').val(json.response);
                }

            }
            else
                setError("response is null");

            // hide loading-picture
            $('#load_image').hide();
        });
}

function getDatabases() {

    $("#errorMsg").html("Please Wait...");

    // get server-url and method-name
    var server = "http://localhost:8069/xmlrpc/db";
    var method = "list";

    // prepare param-array
    var params = new Array();
    for(i=1; i <= currentFieldID; i++)
    {
        params.push('string');
        params.push('');
    }

//    // show loading-picture
//    $('#load_image').show();

    // set empty error and info-text
    // setError('');
    // setInfo('');

    // send json-request
    $.getJSON( "http://localhost:8000/xmlrpc-test/ajax.php", {f: "getResponse", srv: server, m: method, p: params},
        function(json)
        {
            // check json-return-value
            if(json)
            {
                // got we some response
                if (json.success == 'false')
                    $("#errorMsg").html(json.error);
                else
                {
                    //allright, we got the methods
                    //$("#errorMsg").html(json.response);

                    var $ddERPDatabases = $("#ddERPDatabases");

                    $ddERPDatabases.empty().append('<option>' + json.response + '</option>').selectmenu('refresh');

                    //clear msg
                    $("#errorMsg").html("");
                }

            }
            else
                $("#errorMsg").html("json is null...");

//            // hide loading-picture
//            $('#load_image').hide();
        });
}

function loginOpenERP()
{
	
    // get server-url and method-name
    var server = "http://localhost:8069/xmlrpc/common";
    var method = "login";

    // prepare param-array
    var params = new Array();
    for(i=1; i <= currentFieldID; i++)
    {
        params.push('string');
        params.push('eboreApps');
		
		params.push('string');
        params.push('admin');

		params.push('string');
        params.push('admin');		
    }

    // show loading-picture
    $('#load_image').show();

    // set empty error and info-text
    // setError('');
    // setInfo('');

    // send json-request
    $.getJSON( "ajax.php", {f: "getResponse", srv: server, m: method, p: params},
        function(json)
        {
            // check json-return-value
            if(json)
            {
                // got we some response
                if(json.success == 'false')
                    alert(json.err);
                else
                {
                  //allright, we got the methods
                  alert(json.response);
                }

            }
            else
                alert("response is null");

            // hide loading-picture
            $('#load_image').hide();
        });
}


// add new param-field
function addParamField(param_type)
{
    //  and delete "no parameters"-text if neccessary
    if(currentFieldID == 0)
            $('#params').html('');

    // increase currentFieldID
    currentFieldID++;

    // set param_type
    if(typeof(param_type) == "string")
        param_type = " : " + param_type;
    else
        param_type = '';

    // build field html
    var field = "<div id='param" + currentFieldID + "' style='display:none;'>param " 
        + currentFieldID + param_type +"<br/><input type='text' name='param"
        + currentFieldID +"' /></div>";

    // append field und unset focus
    $('#params').append(field);
    $('#param' + currentFieldID).show(200);
    $('#button_add').blur();
}

// remove param-field
function removeParamField()
{
    //check if we have some fields
    if(currentFieldID > 0)
        // remove last field
        $('#param' + currentFieldID).hide(300,
            function()
            {
                // decrease and remove
                $('#param' + currentFieldID--).remove();
                
                // set info-text, if no parameters are set
                if(currentFieldID == 0)
                   $('#params').html("no parameter : ()");
            });

    //unset focus
    $('#button_remove').blur();
}

// clears all parameters
function clearParamList()
{
    currentFieldID = 0;
    $('#params').html("no parameter : ()");
}

// set list-selection
function setListSelection()
{
    // set to custom?
    if($('#methodList').val() == 'custom')
    {
        // set names to defaults
        $('#method_name').html('custom method');
        $('#output_name').html('output');

        // enable editing
        $('#method').removeAttr("disabled");
        $('#button_add').button( "option", "disabled", false );
        $('#button_remove').button( "option", "disabled", false );
    }
    // otherwise set name, ehlp and parameters
    else
    {
        // set name
        var methodname = MethodList[$('#methodList').val()].name;
        $('#method_name').html('method : ' + methodname);
        $('#method').val(methodname);

        // set parameters
        clearParamList();
        $.each( MethodList[$('#methodList').val()].param.split(','),
            function(index, itemData)
            {
                if(trim(itemData) != '')
                addParamField(trim(itemData));
            });

        // set output-name
        var out_type = MethodList[$('#methodList').val()].ret;
        $('#output_name').html('output : ' + out_type);

        // disable editing
        $('#method').attr("disabled","disabled");
        $('#button_add').button( "option", "disabled", true );
        $('#button_remove').button( "option", "disabled", true );
    }
}

// show/hide error-box
function setError(err_text)
{
    if(err_text == '')
    {
        $('#error_text').html("");
        $('#error').hide();
    }
    else
    {
        $('#error_text').html("<strong>Error:</strong> " + err_text);
        $('#error').show();
    }
}

// show/hide info-box
function setInfo(info_text)
{
    if(info_text == '')
    {
        $('#info_text').html("");
        $('#info').hide();
    }
    else
    {
        $('#info_text').html(info_text);
        $('#info').show();
    }
}

// trim a string
function trim (str)
{
  return str.replace (/^\s+/, '').replace (/\s+$/, '');
}

// reset form
function resetForm()
{
     // reset global currentFieldID to 1
    currentFieldID = 1;

    // reset param-fields
    $('#params').html("<div id='param1'>param 1 <br/>" +
                    "<input type='text' name='param1' /></div>");

    // reset MethodList
    MethodList = new Array();

    // clear methodname and enable editing
    $('#method').val('');
    $('#method').removeAttr("disabled");

    // enable buttons
    $('#button_add').button( "option", "disabled", false );
    $('#button_remove').button( "option", "disabled", false );
    $("#button_send").button( "option", "disabled", false );

    // set names to defaults
    $('#method_name').html('custom method');
    $('#output_name').html('output');
}
