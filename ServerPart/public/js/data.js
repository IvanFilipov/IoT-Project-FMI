/* globals requester localStorage */

const HTTP_HEADER_KEY = "x-auth-key",
    KEY_STORAGE_USERNAME = "username",
    KEY_STORAGE_AUTH_KEY = "authKey";

var dataService = (function(){
    function login(user) {  
        return requester.postJSON("php/login.php", user)
            .then(respUser => {
                var resp = JSON.parse(respUser);
                localStorage.setItem("username", user.username);
                localStorage.setItem("authKey", resp.result.authKey);
                return respUser;
            });
    }
    function register(user) {
        return requester.postJSON("php/register.php", user);
    }
    function logout() {
        return Promise.resolve()
            .then(() => {
                localStorage.removeItem(KEY_STORAGE_USERNAME);
                localStorage.removeItem(KEY_STORAGE_AUTH_KEY);
            });
    }
    function isLoggedIn() {
        return Promise.resolve()
            .then(() => {
                return !!localStorage.getItem(KEY_STORAGE_USERNAME);
            });
    }

    function getUsername() {

        return localStorage.getItem(KEY_STORAGE_USERNAME);
        // return new Promise((resolve, reject) => {
        //     if (localStorage.getItem(KEY_STORAGE_USERNAME))
        //         resolve(localStorage.getItem(KEY_STORAGE_USERNAME));
        //     else reject();
        // });
    }

    function getUsers() {
        return requester.get("php/users.php");
    }

    function getUser(name) {        
        let options = {
            headers: {
                [KEY_STORAGE_USERNAME]: name,
                [HTTP_HEADER_KEY]: localStorage.getItem(KEY_STORAGE_AUTH_KEY)
            }
        };
        return requester.get(`php/user.php`, options);
    }

    function allEsps() { 
        return requester.get("php/book.php");
    }
    function allEspsToCompare() { 
        let options;
        if(isLoggedIn())   
        {
            options = {
                headers: {
                    [KEY_STORAGE_USERNAME]: localStorage.getItem(KEY_STORAGE_USERNAME),
                    [HTTP_HEADER_KEY]: localStorage.getItem(KEY_STORAGE_AUTH_KEY)
                }
            };
        }
        return requester.get("php/getAllEspsByLogedIn.php", options);
    }

    function addESP(esp) {
        return controllESP(esp,`php/addEsp.php`);
    }

    function removeESP(esp) {
        return controllESP(esp,`php/removeEsp.php`);
    }
    function renameESP(esp) {
        return controllESP(esp,`php/renameEsp.php`);
    }
    function changeStatusESP(esp) {
        return controllESP(esp,`php/changeStatusEsp.php`);
    }

    function controllESP(esp,service) {
        let options = {
            headers: {
                username: localStorage.getItem(KEY_STORAGE_USERNAME),
                [HTTP_HEADER_KEY]: localStorage.getItem(KEY_STORAGE_AUTH_KEY)
            }
        };
        return requester.postJSON(service, esp, options);
    }
    function getEspData(espData){
        let service = "php/getEspData.php?";
        service += "unic_id=" + espData.unic_id;
        service += "&fromDay=" + espData.from.day;
        service += "&fromMonth=" + espData.from.month;
        service += "&fromYear=" + espData.from.year;
        service += "&fromHour=" + espData.from.hour;
        service += "&fromMinute=" + espData.from.minute;
        service += "&toDay=" + espData.to.day;
        service += "&toMonth=" + espData.to.month;
        service += "&toYear=" + espData.to.year;
        service += "&toHour=" + espData.to.hour;
        service += "&toMinute=" + espData.to.minute;

        return requester.get(service)
            .then(respUser => {
                // var resp = JSON.parse(respUser);
                // localStorage.setItem("username", user.username);
                // localStorage.setItem("authKey", resp.result.authKey);
                return respUser;
            });

    }
    return {
        login,
        register,
        logout,
        isLoggedIn,
        getUsername,
        getUsers,
        getUser,
        allEsps,
        allEspsToCompare,
        addESP,
        removeESP,
        renameESP,
        changeStatusESP,
        getEspData
        // getEspsData
    }
})();

