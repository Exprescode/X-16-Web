var vm = new Vue({
    el: '#form',
    data: {
        email: '',
        password: '',
        message: '',
        message_style: ''
    },
    methods: {
        authenticate: function () {
            console.log(this.email);
            console.log(this.password);
            axios.get('http://45.79.78.80/query',{
                    params: {
                        query: "query {GetUser(email:\"" + vm.email + "\" password:\"" + vm.password + "\")}"
                    }
            }).then(function(response){
                if(response.data.data.GetUser === "User retrieved."){
                    window.location.replace("./chat.html");
                } else {
                    vm.message = "Invalid email or password!";
                    vm.message_style = "message negative";
                }
            }).catch(function (error) {
                vm.message = "Something went wrong. Please try again later.";
                vm.message_style = "message negative";
            });
        }
    }
});

var message = (new URLSearchParams(window.location.search)).get('message');
if (message === "register") {
    vm.message = "Success! Please verify your account via email.";
    vm.message_style = "message positive";
}
if (message === "reset") {
    vm.message = "Success! Please check your email for verification.";
    vm.message_style = "message positive";
}