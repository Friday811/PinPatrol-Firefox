$(document).ready(function(){
    var table = $('#tableFile').DataTable({
        "initComplete": function( settings, json ) {
            $('div.loading').remove();
        },
        "columnDefs": [{
            "targets": 3,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);

            },
            "render": function (data, type, full, meta) {
                var d = new Date("1970-01-01");
                d.setDate(d.getTime() + data);
                return d.toDateString();
            }
        }, {
            "targets": 4,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);

            },
            "render": function (data, type, full, meta) {
                var lastrow = data.split(",");
                //date expire
                var d = new Date();
                d.setTime(lastrow[0]);

                return d.toUTCString();
            }

        }, {
            "targets": 5,
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).attr('title', cellData);
            },
            "render": function (data, type, full, meta) {
                //security property set
                var property = "";
                if(data == 0){
                    property = "SecurityPropertyUnset";
                }
                else if(data == 1){
                    property = "SecurityPropertySet";
                }
                else{
                    property = "SecurityPropertyKnockout";
                }

                return property;
            }
        }]
    });

    var dropTable = document.getElementById("tableFile");
    dropTable.addEventListener('dragover', handleDragOver, false);
    dropTable.addEventListener('drop', handleJSONDrop, false);

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    $("#filesclick").click(function() {
        if ($("#tableFileBody").hasClass('emptyTable')){
            $( "#files" ).click();
        }
    });
});

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and read
  for (var i = 0, f; f = files[i]; i++) {
    if (f.name == 'SiteSecurityServiceState.txt' && f.type == 'text/plain') {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            var text = e.target.result;
            var list = text.split("\n");
            list.pop(); //delete the last

            var table = $('#tableFile').DataTable();
            table.rows().remove().draw(false);
            writeTable(list);
          };
        })(f);

        reader.readAsText(f);

        $("#tableFileBody").removeClass('emptyTable'); // Only read from file first time
    } else {
            alert('This isn´t file SiteSecurityServiceState.txt');
        }
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

 function handleJSONDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    // Loop through the FileList and read
    for (var i = 0, f; f = files[i]; i++) {
        if (f.name == 'SiteSecurityServiceState.txt' && f.type == 'text/plain') {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var text = e.target.result;
            var list = text.split("\n");
            list.pop(); //delete the last

            var table = $('#tableFile').DataTable();
            table.rows().remove().draw(false);
            writeTable(list);
          };
        })(f);

        reader.readAsText(f);

        $("#tableFileBody").removeClass('emptyTable'); // Only read from file first time
        } else {
            alert('This isn´t file SiteSecurityServiceState.txt');
        }
    }
}

function writeTable(list){

    for(var i = 0; i<list.length; i++) {
        var columns = list[i].split("\t");
        for (var j = 0; j < columns.length; j++) {
            switch (j) {
                case 0:
                    var firtsrow = columns[j].split(":");
                    var domain = firtsrow[0];
                    var HSTS = firtsrow[1];
                    break;
                case 1:
                    var score = columns[j];
                    break;
                case 2:
                    var dateDate = columns[j];

                    break;
                case 3:
                    var lastrow = columns[j].split(",");
                    //date expire
                    var dateExpire = lastrow[0];
                    var property = lastrow[1];

                    //include subdomains
                    var subDomains = lastrow[2] == 1 ? "includeSubdomains" : " - ";

                    if(typeof lastrow[3] !== 'undefined' && lastrow[3] != 0 && lastrow[3] != 2){
                        var pins = lastrow[3].split("=");
                        var temp = "";
                        for(var k = 0; k < pins.length; k++){
                            if(pins[k] != ""){
                                temp = pins[k] + "=" + "<br/>" + temp
                            }
                        }
                        var fpins = temp;
                    }
                    else{
                        var fpins = " - ";
                    }
                    break;
            }
        }
        var table = $('#tableFile').DataTable();
        table.row.add([domain, HSTS, score, dateDate, dateExpire, property, subDomains, fpins]).draw(false);
    }
    $('#dropfiles').remove();
}
