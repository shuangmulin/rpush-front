<template>
  <div v-loading="loginLoading" class="loading-wrapper" element-loading-spinner="el-icon-loading">
    <div class="header clearfix">
      <a class="left" href="javascript:void(0);">Rpush</a>
    </div>
    <div class="loginIndexComponent">
      <h3>
        <div>Rpush</div>
      </h3>
      <div id="admin_login" class="admin-login">
<!--        <input type="text" style="position: absolute; top: -999px" />-->
<!--        <input type="password" style="position: absolute; top: -999px" />-->
        <div class="admin">
          <p>登录账号</p>
          <p>
            <input
              class="user_name"
              type="text"
              placeholder="请输入登录账号"
              autocomplete="off"
              v-model="name"
            />
          </p>
        </div>
        <div class="password">
          <p>输入密码</p>
          <p>
            <input
              class="user_password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              v-model="password"
            />
          </p>
        </div>
        <div class="login-button">
          <p>
            <button id="admin_login_submit" class="button primary-btn" @click="handleLogin">登录</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {login} from '@/api/rpush'
export default {
  name: 'operationLogin',
  data () {
    return {
      name: '',
      password: '',
      loginLoading: false
    }
  },
  mounted () {
    this.enterKeyup()
  },
  methods: {
    // 点击登录
    async handleLogin () {
      if (!this.name && !this.password) {
        this.$message({
          showClose: true,
          message: '登录账号和密码不能为空！',
          type: 'error'
        })
        return
      }
      if (!this.name) {
        this.$message({
          showClose: true,
          message: '登录账号不能为空！',
          type: 'error'
        })
        return
      }
      if (!this.password) {
        this.$message({
          showClose: true,
          message: '用户密码不能为空！',
          type: 'error'
        })
        return
      }
      await login({
        client_id: this.name,
        client_secret: this.password
      })
      this.$router.replace({ name: 'configManagement' })
    },
    enterKey (event) {
      const code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode
      if (code === 13) {
        this.handleLogin()
      }
    },
    enterKeyupDestroyed () {
      document.removeEventListener('keyup', this.enterKey)
    },
    enterKeyup () {
      document.addEventListener('keyup', this.enterKey)
    }
  },
  destroyed () {
    // 销毁enter事件
    this.enterKeyupDestroyed()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$background: #f6f7fb;
$button: #4781ff;
.header {
  min-width: 1200px;
  height: 50px;
  line-height: 50px;
  box-shadow: 1px 1px 10px 5px #ddd;
  margin-bottom: 30px;
  background: #fff;
  z-index: 10;
  position: relative;
}
.header a {
  display: block;
  padding: 0 21px;
  text-decoration: none;
  color: #343434;
  font-size: 16px;
  border-left: 1px solid #f6f7fb;
}
.left {
  float: left;
}
.right {
  float: right;
}
.loading-wrapper {
  background: $background;
  height: 100%;
}
.loginIndexComponent {
  position: fixed;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: 400px;
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 0 30px;
  padding-bottom: 20px;
  transform: translate(-50%, -50%);
  overflow: hidden;
  h3 {
    color: #2c3347;
    font-size: 20px;
    font-weight: 300;
    text-align: center;
    margin: 30px 0;
    line-height: 1.3;
  }
  .phone-login {
    display: none;
  }
  .tab {
    position: absolute;
    bottom: -1px;
    margin-bottom: 20px;
    a {
      display: block;
      text-decoration: none;
      color: #24acff;
      font-size: 13px;
    }
    .choice-admin,
    .choice-phone {
      position: relative;
    }
    .active {
      color: #666;
    }
  }
  .admin {
    margin: 0 0 20px 0;
    > p {
      &:nth-of-type(1) {
        font-size: 12px;
        margin: 0 5px 10px;
        color: #a5a7ab;
        &:before {
          content: "*";
          color: #ee1c25;
          font-size: 14px;
        }
      }
      &:nth-of-type(2) {
        margin: 0 0 10px 0;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        input {
          display: block;
          width: 323px;
          height: 30px;
          padding-left: 7px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-weight: 300;
          background: #fff;
        }
      }
      &:nth-of-type(3) {
        font-size: 12px;
        text-align: right;
        > span {
          &:nth-of-type(2) {
            cursor: pointer;
            color: #4781ff;
            margin: 0 0 0 4px;
          }
        }
      }
    }
  }
  .password {
    margin: 0 0 20px 0;
    > p {
      color: #a5a7ab;
      &:nth-of-type(1) {
        font-size: 12px;
        margin: 0 5px 10px;
        // &:before {
        //   content: '*';
        //   color: #ee1c25;
        //   font-size: 14px;
        // }
      }
      &:nth-of-type(2) {
        margin: 0 0 10px 0;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        input {
          display: block;
          width: 323px;
          height: 30px;
          padding-left: 7px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-weight: 300;
          background: #fff;
        }
      }
      &:nth-of-type(3) {
        font-size: 12px;
        text-align: right;
        > span {
          &:nth-of-type(2) {
            cursor: pointer;
            color: #4781ff;
            margin: 0 0 0 4px;
          }
        }
      }
    }
  }
  .check-number {
    margin-bottom: 35px;
    .check-title {
      &:before {
        content: "*";
        color: #ee1c25;
      }
    }
    input {
      display: block;
      width: 240px;
      height: 30px;
      padding-left: 7px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-right: 0px;
      border-radius: 3px 0 0 3px;
      font-weight: 300;
    }
    button {
      display: block;
      width: 92px;
      height: 32px;
      line-height: 32px;
      border-radius: 0 3px 3px 0;
    }
  }
  .login-button {
    > p {
      &:nth-of-type(1) {
        margin: 0 0 10px 0;
        button.button.primary-btn {
          font-size: 16px;
          width: 340px;
          height: 40px;
          border-radius: 3px;
          background: $button !important;
          border: none;
          color: #fff;
        }
      }
      &:nth-of-type(2) {
        font-size: 12px;
        text-align: right;
        > span {
          &:nth-of-type(2) {
            cursor: pointer;
            color: #4781ff;
            margin: 0 0 0 4px;
          }
        }
      }
    }
  }
  .to-register {
    margin-top: 50px;
    text-align: right;
    font-size: 13px;
    color: #666;
    a {
      text-decoration: none;
      color: #24acff;
    }
  }
  .user_code::-webkit-input-placeholder,
  .user_name::-webkit-input-placeholder,
  .user_password::-webkit-input-placeholder {
    // color: red;
    font-size: 12px;
    color: #a5a7ab;
    font-weight: normal;
    font-family: "Microsoft Yahei", "Source Sans Pro", "Helvetica Neue", Arial,
      sans-serif;
  }
}
</style>
