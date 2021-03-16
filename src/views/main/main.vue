<template>
  <el-container class="my_container">
    <el-container class="my_main_container">
      <el-aside class="my_main_slide"
                text-color="rgba(195, 198, 204, 1)"
                active-text-color="rgba(255, 255, 255, 1)"
                width="180px">
        <main-slide />
      </el-aside>
      <el-main class="my_main_box">
        <router-view />
      </el-main>
    </el-container>
    <div @click="handleBackSys" class="backSys"><i class="iconfont icontuichu"></i>退出</div>
  </el-container>
</template>

<script>
export default {
  name: 'main-layout',
  components: {
    mainSlide: () => import('./components/main-slide.vue')
  },
  methods: {
    handleBackSys () {
      this.$router.push({ name: 'login' })
      localStorage.removeItem('operateLoginInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.my_container {
  height: 100%;
}
.my_main_container {
  flex: 1;
  overflow: hidden;
}
.my_main_header {
  position: relative;
  display: flex;
  z-index: 10;
  background: #fff;
  height: 50px !important;
  line-height: 50px;
  box-shadow: 0 3px 5px #ccc;
  font-size: 16px;
  font-weight: 600;
  padding-right: 0;
  img {
    width: 30px;
    vertical-align: middle;
    margin-top: -3px;
  }
  div:first-child {
    flex-grow: 1;
  }
  div:last-child {
    font-size: 16px;
    font-weight: 200;
    width: 100px;
    border-left: 1px solid #ccc;
    text-align: center;
    &:hover {
      background: #ecf5ff;
      cursor: pointer;
    }
  }
}
.my_main_slide {
  position: relative;
  z-index: 5;
  box-shadow: 2px 0 2px #ccc;
  height: 100%;
  background-color: rgba(29, 35, 52, 1);
}
.my_main_box {
  padding: 0;
}
/deep/ .el-menu-item.is-active {
  background-color: rgba(0, 120, 255, 1);
  color: #fff;
}
/deep/ .el-menu-item {
  background-color: rgba(29, 35, 52, 1);
  color: rgba(195, 198, 204, 1);
}
.backSys {
  color: rgba(255, 0, 80, 1);
  position: absolute;
  padding-left: 20px;
  bottom: 20px;
  z-index: 99;
  cursor: pointer;
  .icontuichu {
    padding-right: 5px;
    display: inline-block;
  }
}
</style>
