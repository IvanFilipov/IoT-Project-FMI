/* globals $ Promise */

let requester = {
    get(url, options = {}) {
        var headers = options.headers || {};
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                url,
                headers,
                method: "GET",
                success(response) {
                    resolve(response);
                }
            });
        });
        return promise;
    },
    putJSON(url, body, options = {}) {
        let promise = new Promise((resolve, reject) => {
            var headers = options.headers || {};
            $.ajax({
                url,
                headers,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(body),
                success(response) {
                    resolve(response);
                },
                error(response) {
                    resolve(response);
                },
            });
        });
        return promise;
    },
    postJSON(url, body, options = {}) {
        let promise = new Promise((resolve, reject) => {
            var headers = options.headers || {};

            $.ajax({
                url,
                headers,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                success(response) {
                    resolve(response);
                },
                error(response) {
                    reject(response);
                }
            });
        });
        return promise;
    },
    deleteJSON(url, body, options = {}) {
        let promise = new Promise((resolve, reject) => {
            var headers = options.headers || {};

            $.ajax({
                url,
                headers,
                method: "DELETE",
                contentType: "application/json",
                data: JSON.stringify(body),
                success(response) {
                    resolve(response);
                },
                error(response) {
                    reject(response);
                }
            });
        });
        return promise;
    },
    
    getJSON(url) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                url,
                method: "GET",
                contentType: "application/json",
                success(response) {
                    resolve(response);
                }
            });
        });
        return promise;
    }
};




// let requester = (function(){
//     function get(url) {
//         let promise = new Promise((resolve, reject) => {
//             $.ajax({
//                 url,
//                 method: "GET",
//                 success(response) {
//                     resolve(response);
//                 }
//             });
//         });
//         return promise;
//     }
//     function putJSON(url, body, options = {}) {
//         let promise = new Promise((resolve, reject) => {
//             var headers = options.headers || {};
//             $.ajax({
//                 url,
//                 headers,
//                 method: "PUT",
//                 contentType: "application/json",
//                 data: JSON.stringify(body),
//                 success(response) {
//                     resolve(response);
//                 }
//             });
//         });
//         return promise;
//     }
//     function postJSON(url, body, options = {}) {
//         let promise = new Promise((resolve, reject) => {
//             var headers = options.headers || {};

//             $.ajax({
//                 url,
//                 headers,
//                 method: "POST",
//                 contentType: "application/json",
//                 data: JSON.stringify(body),
//                 success(response) {
//                     resolve(response);
//                 },
//                 error(response) {
//                     reject(response);
//                 }
//             });
//         });
//         return promise;
//     }
//     function getJSON(url) {
//         let promise = new Promise((resolve, reject) => {
//             $.ajax({
//                 url,
//                 method: "GET",
//                 contentType: "application/json",
//                 success(response) {
//                     resolve(response);
//                 }
//             });
//         });
//         return promise;
//     }

//     return {
//         get: get,
//         putJSON: putJSON,
//         postJSON: postJSON,
//         getJSON: getJSON
//     }
// })();