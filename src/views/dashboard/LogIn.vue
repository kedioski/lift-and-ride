<template>
  <form class="login-box">
    <h2 class="headline">
      Log in
    </h2>
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field
            v-model="username"
            label="Username"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
          />
        </v-row>
      </v-container>
    </v-card-text>
    <div>
      <v-btn
        color="blue darken-1"
        text
        @click="logIn"
      >
        <h3>Log in</h3>
      </v-btn>
      <br>
      <v-btn
        color="blue darken-1"
        text
        @click="register"
      >
        <h3>Register</h3>
      </v-btn>
    </div>
  </form>
</template>

<script>
  import { db } from '../../main'

  export default {
    name: 'LogIn',

    data () {
      return {
        username: '',
        password: '',
      }
    },

    methods: {
      logIn () {
        db.collection('users').where('username', '==', this.username).where('password', '==', this.password).get().then(querySnapshot => {
          const users = querySnapshot.docs
          if (users && users.length) {
            localStorage.loggedUser = this.username
            this.$router.push('/')
          } else {
            this.$alert('User or password is not valid!')
          }
        })
      },

      register () {
        this.$router.push('sign-in')
      },
    },
  }
</script>

<style scoped>
.login-box {
  position: absolute;
  top: 35%;
  left: 50%;
  width: 500px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: #C0C7CE;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box div {
  text-align: center;
}
</style>
