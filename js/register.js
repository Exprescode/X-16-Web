var vm = new Vue({
    el: '#form',
    data: {
        email:'',
        name:'',
        password:'',
        email_error: false,
        connection_error: false
    },
    methods: {
        register: function() {
            axios.post(
                'http://45.79.78.80/query',
                {
                    "query": "mutation {SignUpUser(email:\"" + this.email + "\" name:\"" + this.name + "\" password:\"" + this.password + "\")}"
                }
            )
            .then(function(response) {
                // console.log(response);
                if(response.data.data){ //Sign up successful.
                    window.location.replace("./login.html?message=register");
                } else { //Sign up failed.
                    vm.email_error = true;
                }
            })
            .catch(function(error) {
                // console.log(error);
                vm.connection_error = true;
            });
        }
    }
});