/* globals dataService templates $ Handlebars console */

var handlebars = handlebars || Handlebars;

function registerUser() {
    templates.get("register")
        .then(function(html) {
            $("#container").html(html);
        
            $("#btn-register").on("click", (ev) => {
                let user = {
                    username: $("#tb-username").val(),
                    email: $("#tb-email").val(),
                    password: $("#tb-password").val(),
                    password2: $("#tb-password2").val()
                };
                if(user.password !== user.password2) {
                    toastr.error('first != second', 'Bad pass!');
                    return false;
                }
                delete user.password2;
                dataService.register(user)
                    .then((respUser) => {
                        delete user.email;
                        return dataService.login(user);
                    })
                    .then((respUser) => {
                        //123456q
                        $(document.body).addClass("logged-in");
                        $(".btn-nav-profile").attr("href", "#/profiles/" + user.username);
                        document.location = "#/profiles/" + user.username;
                    })
                    .catch(function(response) {
                        toastr.error(JSON.parse(response.responseText).result.err,
                             response.statusText);
                    });

                ev.preventDefault();
                return false;
          });
    });
    

    // var user = {
    //     email: $
    // }
}

let controllers = {
    get(dataService, templates) {
        return {
            login() {
                dataService.isLoggedIn()
                    .then(isLoggedIn => {
                        if (isLoggedIn) {
                            //redirect to
                            let username = localStorage.getItem(KEY_STORAGE_USERNAME);
                            window.location = "#/profiles/" + username;
                            return;
                        }

                        templates.get("login")
                            .then((templateHtml) => {
                                let templateFunc = handlebars.compile(templateHtml);
                                let html = templateFunc();
                                $("#container").html(html);

                                $("#btn-login").on("click", (ev) => {
                                    let user = {
                                        username: $("#tb-username").val(),
                                        passHash: $("#tb-password").val()
                                    };

                                    user = {username: user.username, password: user.passHash}; 
                                    dataService.login(user)
                                        .then((respUser) => {
                                            $(document.body).addClass("logged-in");
                                            // $(".btn-nav-profile").on("click")
                                            $(".btn-nav-profile").attr("href", "#/profiles/" + user.username);
                                            document.location = "#/profiles/" + user.username;
                                        }, (respUser) => {
                                            console.log("response:" + respUser);
                                            toastr.error('Username or password is incorrect', 'Server');
                                            return false;
                                        });

                                    ev.preventDefault();
                                    return false;
                                });

                            });
                    });
            },
            register: registerUser
        };
    }
};