var mdl = (function () {
    return {
        toast: function (msg, obj, timeout) {
            var snackbarContainer = document.querySelector('.mdl-js-snackbar'); //toast div
            if (!obj) { obj = '' }
            if (!timeout) { timeout = 15000 }
            data = {
                message: msg + obj,
                timeout: timeout
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        },
        toastUp: function (msg) {
            var snackbarContainer = document.querySelector('.mdl-js-snackbar');
            var snackbarText = document.querySelector('.mdl-snackbar__text');
            snackbarText.innerHTML = msg;
            snackbarContainer.classList.add("mdl-snackbar--active");

        },
        toastDown: function (count) {
            setTimeout(function () {
                var snackbarContainer = document.querySelector('.mdl-js-snackbar');
                snackbarContainer.classList.remove("mdl-snackbar--active");
            }, config.timeout * count);
        },
        toastOk: function (msg) {
            var snackbarContainer = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: msg,
                actionHandler: function (event) { document.querySelector('.mdl-js-snackbar').classList.remove("mdl-snackbar--active"); },
                actionText: 'Ok',
                timeout: 60000
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        },
    };
})();