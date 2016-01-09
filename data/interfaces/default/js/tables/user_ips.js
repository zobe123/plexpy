user_ip_table_options = {
    "destroy": true,
    "language": {
        "search": "Search: ",
        "lengthMenu":"Show _MENU_ entries per page",
        "info":"Showing _START_ to _END_ of _TOTAL_ results",
        "infoEmpty":"Showing 0 to 0 of 0 entries",
        "infoFiltered":"(filtered from _MAX_ total entries)",
        "emptyTable": "No data in table",
    },
    "stateSave": true,
    "pagingType": "bootstrap",
    "processing": false,
    "serverSide": true,
    "pageLength": 10,
    "order": [ 0, 'desc'],
    "autoWidth": false,
    "columnDefs": [
        {
            "targets": [0],
            "data":"last_seen",
            "render": function ( data, type, full ) {
                return moment(data, "X").fromNow();
            },
            "searchable": false,
            "width": "15%",
            "className": "no-wrap hidden-xs"
        },
        {
            "targets": [1],
            "data": "ip_address",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData) {
                    if (isPrivateIP(cellData)) {
                        if (cellData != '') {
                            $(td).html(cellData);
                        } else {
                            $(td).html('n/a');
                        }
                    } else {
                        $(td).html('<a href="javascript:void(0)" data-toggle="modal" data-target="#ip-info-modal"><span data-toggle="ip-tooltip" data-placement="left" title="IP Address Info" id="ip-info"><i class="fa fa-map-marker"></i></span>&nbsp' + cellData +'</a>');
                    }
                } else {
                    $(td).html('n/a');
                }
            },
            "width": "15%",
            "className": "no-wrap modal-control-ip"
        },
        {
            "targets": [2],
            "data": "platform",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData !== '') {
                    $(td).html(cellData);
                }
            },
            "width": "15%",
            "className": "no-wrap hidden-md hidden-sm hidden-xs modal-control"
        },
        {
            "targets": [3],
            "data":"player",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData) {
                    var transcode_dec = '';
                    if (rowData['video_decision'] === 'transcode') {
                        transcode_dec = '<span class="transcode-tooltip" data-toggle="tooltip" title="Transcode"><i class="fa fa-server fa-fw"></i></span>&nbsp';
                    } else if (rowData['video_decision'] === 'copy') {
                        transcode_dec = '<span class="transcode-tooltip" data-toggle="tooltip" title="Direct Stream"><i class="fa fa-video-camera fa-fw"></i></span>&nbsp';
                    } else if (rowData['video_decision'] === 'direct play' || rowData['video_decision'] === '') {
                        transcode_dec = '<span class="transcode-tooltip" data-toggle="tooltip" title="Direct Play"><i class="fa fa-play-circle fa-fw"></i></span>&nbsp';
                    }
                    $(td).html('<div><a href="#" data-target="#info-modal" data-toggle="modal"><div style="float: left;">' + transcode_dec + '&nbsp' + cellData + '</div></a></div>');
                } else {
                    $(td).html('n/a');
                }
            },
            "width": "15%",
            "className": "no-wrap hidden-md hidden-sm hidden-xs modal-control"
        },
        {
            "targets": [4],
            "data":"last_watched",
            "createdCell": function (td, cellData, rowData, row, col) {
                if (cellData !== '') {
                    var media_type = '';
                    var thumb_popover = ''
                    if (rowData['media_type'] === 'movie') {
                        media_type = '<span class="media-type-tooltip" data-toggle="tooltip" title="Movie"><i class="fa fa-film fa-fw"></i></span>';
                        thumb_popover = '<span class="thumb-tooltip" data-toggle="popover" data-img="pms_image_proxy?img=' + rowData['thumb'] + '&width=80&height=120&fallback=poster" data-height="120">' + cellData + '</span>'
                        $(td).html('<div class="history-title"><a href="info?source=history&rating_key=' + rowData['rating_key'] + '"><div style="float: left;">' + media_type + '&nbsp' + thumb_popover + '</div></a></div>');
                    } else if (rowData['media_type'] === 'episode') {
                        media_type = '<span class="media-type-tooltip" data-toggle="tooltip" title="Episode"><i class="fa fa-television fa-fw"></i></span>';
                        thumb_popover = '<span class="thumb-tooltip" data-toggle="popover" data-img="pms_image_proxy?img=' + rowData['thumb'] + '&width=80&height=120&fallback=poster" data-height="120">' + cellData + '</span>'
                        $(td).html('<div class="history-title"><a href="info?source=history&rating_key=' + rowData['rating_key'] + '"><div style="float: left;" >' + media_type + '&nbsp' + thumb_popover + '</div></a></div>');
                    } else if (rowData['media_type'] === 'track') {
                        media_type = '<span class="media-type-tooltip" data-toggle="tooltip" title="Track"><i class="fa fa-music fa-fw"></i></span>';
                        thumb_popover = '<span class="thumb-tooltip" data-toggle="popover" data-img="pms_image_proxy?img=' + rowData['thumb'] + '&width=80&height=80&fallback=poster" data-height="80">' + cellData + '</span>'
                        $(td).html('<div class="history-title"><a href="info?source=history&rating_key=' + rowData['rating_key'] + '"><div style="float: left;">' + media_type + '&nbsp' + thumb_popover + '</div></a></div>');
                    } else if (rowData['media_type']) {
                        $(td).html('<a href="info?rating_key=' + rowData['rating_key'] + '">' + cellData + '</a>');
                    } else {
                        $(td).html('n/a');
                    }
                }
            },
            "width": "30%",
            "className": "hidden-sm hidden-xs"
        },
        {
            "targets": [5],
            "data":"play_count",
            "searchable": false,
            "width": "10%"
            }
    ],
    "drawCallback": function (settings) {
        // Jump to top of page
        // $('html,body').scrollTop(0);
        $('#ajaxMsg').fadeOut();

        // Create the tooltips.
        $('.transcode-tooltip').tooltip();
        $('.media-type-tooltip').tooltip();
        $('.watched-tooltip').tooltip();
        $('.thumb-tooltip').popover({
            html: true,
            trigger: 'hover',
            placement: 'right',
            content: function () {
                return '<div style="background-image: url(' + $(this).data('img') + '); width: 80px; height: ' + $(this).data('height') + 'px;" />';
            }
        });

    },
    "preDrawCallback": function(settings) {
        var msg = "<i class='fa fa-refresh fa-spin'></i>&nbspFetching rows...";
        showMsg(msg, false, false, 0)
    }
}

$('#user_ip_table').on('mouseenter', 'td.modal-control span', function () {
    $(this).tooltip();
});

$('#user_ip_table').on('click', 'td.modal-control', function () {
    var tr = $(this).parents('tr');
    var row = user_ip_table.row(tr);
    var rowData = row.data();

    function showStreamDetails() {
        $.ajax({
            url: 'get_stream_data',
            data: { row_id: rowData['id'], user: rowData['friendly_name'] },
            cache: false,
            async: true,
            complete: function (xhr, status) {
                $("#info-modal").html(xhr.responseText);
            }
        });
    }
    showStreamDetails();
});

$('#user_ip_table').on('click', 'td.modal-control-ip', function () {
    var tr = $(this).parents('tr');
    var row = user_ip_table.row( tr );
    var rowData = row.data();

    function getUserLocation(ip_address) {
        if (isPrivateIP(ip_address)) {
            return "n/a"
        } else {
            $.ajax({
                url: 'get_ip_address_details',
                data: {ip_address: ip_address},
                async: true,
                complete: function(xhr, status) {
                    $("#ip-info-modal").html(xhr.responseText);
                }
            });
        }
    }

    getUserLocation(rowData['ip_address']);
});