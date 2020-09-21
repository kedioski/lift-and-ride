<template>
  <form class="sign-in-box ">
    <h2 class="headline">
      Sign in
    </h2>
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field
            v-model="name"
            label="Name"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="surname"
            label="Surname"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="email"
            label="Email"
          />
        </v-row>
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
        <v-row>
          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Confirm password"
          />
        </v-row>
      </v-container>
    </v-card-text>
    <div>
      <v-btn
        color="blue darken-1"
        text
        @click="register"
      >
        <h3>Register</h3>
      </v-btn>
      <br>
      <v-btn
        color="blue darken-1"
        text
        @click="logIn"
      >
        <h3>Log in</h3>
      </v-btn>
    </div>
  </form>
</template>

<script>
  export default {
    name: 'SignIn',

    data () {
      return {
        name: '',
        surname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      }
    },

    methods: {
      logIn () {
        this.$router.push('log-in')
      },

      register () {
        const isValid = this.validate()
        if (isValid) {
          const uniqueUsername = this.checkUsername()
          if (uniqueUsername) {
            this.saveUser()
          } else {
            this.$alert('Username already exists!')
          }
        } else {
          this.$alert('All fields are required. Password must match confirm password!')
        }
      },

      validate () {
        if (this.name && this.surname && this.email && this.username && this.password && this.confirmPassword && this.password === this.confirmPassword) {
          return true
        }
        return false
      },

      checkUsername () {

      },

      saveUser () {

      },
    },
  }
</script>

<style scoped>
.sign-in-box {
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

.sign-in-box  h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.sign-in-box  div {
  text-align: center;
}
</style>
