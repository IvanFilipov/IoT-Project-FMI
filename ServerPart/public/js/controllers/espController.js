var espController = (function() {
    function all() {
        return Promise.all([dataService.allEsps(), templates.get("book")])
            .then(function([data, template]) {
                console.log(data);
                let templateFunc = handlebars.compile(template);
                let html = templateFunc(data.result);
                $("#container").html(html);

                dataController.showInfo();
                // $('.btn-info').on('click',dataController.showEspData);
            });
    }

    function addEspToCompare() {
        $("#select-esp-to-comp").click((ev) => {
            if($('#select-esp-to-comp option').length <= 1)
            {
                Promise.all([dataService.allEspsToCompare()])
                .then(function([data]) {
                    $.each(data.result.ESPS, function(index, esp) { // Iterates through a collection
                        $("#select-esp-to-comp").append( // Append an object to the inside of the select box
                            $("<option></option>") // Yes you can do this.
                                .text(esp.name + " by " + esp.username)
                                .val(esp.name)
                                .attr("data-unicid", esp.unic_id)
                        );
                    });

                });
            }
        });
        // $('.select-esp-to-comp').change(function(ev){
        //             //do somthing
        //             console.log(ev);
        //     $('.select-esp-to-comp').empty().append("<option selected disabled>chose ESP to compare</option>")
        // });
    }

    function add() {
        $(".btn-add-ESP").on("click", (ev) => {
            var esp = {
                name: $("#esp-name").val(),
                unic_id: $("#unic-id").val()
            };
            dataService.addESP(esp)
                .then((respUser) => {
                    let location = "#/profiles/" + localStorage.getItem("username");
                    document.location = location;
                    document.location.reload();
                }).catch((respUser)=>{
                    console.log(respUser);
                    alert("ha1");
                });
                
            ev.preventDefault();
            return false;
        });
    }

    function remove(){
        $(".btn-delete-esp").on("click", (ev) => {

            var esp = {
                unic_id: $(ev.currentTarget).parent().data("unicid")
            };

            dataService.removeESP(esp)
                .then((respUser) => {
                    let location = "#/profiles/" + localStorage.getItem("username");
                    document.location = location;
                    document.location.reload();
                });
                
            ev.preventDefault();
            return false;
        });
    }

    function rename(){

        $(".btn-rename-esp").on("click", (ev) => {
            var esp = {
                unic_id: $(ev.currentTarget).parent().data("unicid"),
                newName: $("#esp-new-name").val()
            };
            dataService.renameESP(esp)
                .then((respUser) => {
                    let location = "#/profiles/" + localStorage.getItem("username");
                    document.location = location;
                    document.location.reload();
                });
                
            ev.preventDefault();
            return false;
        });
    }

    function changeStatus(){
        $(".changeStatus").on("change", function (ev) {
            let newStatus = this.value;
            // let unic_id = $(ev.currentTarget).parent().data("unicid") || $('#controlModelParams').data("unicid"); 

            var esp = {
                unic_id: $(ev.currentTarget).parent().data("unicid"),
                newStatus: newStatus
            };
            dataService.changeStatusESP(esp)
                .then((respUser) => {
                    let location = "#/profiles/" + localStorage.getItem("username");
                    document.location = location;
                    document.location.reload();
                });
                
            ev.preventDefault();
            return false;
        });
    }

    function showControll()
    {

        $(".btn-controll").click(function(){ // Click to only happen on announce links
            // $("#controlModal").val($(this).parent().data('unicid'));
            // $('#createFormId').modal('show');
            // alert($(this).parent().data('unicid'));
            // // $('#controlModal').data( "unicid", $(this).parent().data('unicid') );
            // $('#controlModelParams').data( "unicid", $(this).parent().data('unicid') );
            // $('#controlModelParams').data( "public", $(this).parent().data('public') );

            $('#controlModal .modal-title').text("ESP " + $(this).parent().data('espname'));
            $(".changeStatus.selectpicker").val($(this).parent().data('public'));
            
            $('.modal-esp-data').data( "unicid", $(this).parent().data('unicid') );
            $('.modal-esp-data').data( "public", $(this).parent().data('public') );
            $('.modal-esp-data').data( "username", $(this).parent().data('username') );

        // alert();
        });
    }


    return {
        all: all,
        addEspToCompare: addEspToCompare,
        add: add,
        remove: remove,
        rename: rename,
        changeStatus: changeStatus,
        showControll: showControll
    }
})();