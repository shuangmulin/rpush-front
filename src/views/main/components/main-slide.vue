<template>
  <el-menu :default-active="activeIndex" class="menu-container">
    <div class="menu-img">
      <img style="width: 150px" src="../../../../styles/images/indexIcon.png" alt="" />
    </div>
    <div v-for="(item,index) in routes"
         :key="index">
      <!-- nextLevel -->
      <el-menu-item :index="item.name"
                    v-if="!item.meta.nextLevel"
                    @click="jumpRouter(item)">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{item.meta.title}}</span>
      </el-menu-item>
      <el-submenu v-else :index="item.name">
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span>{{item.meta.title}}</span>
        </template>
        <el-menu-item :index="sub.name"
                      v-for="(sub, subIdex) in item.children"
                      :key="subIdex"
                      v-if="!sub.meta.isNotShow"
                      @click="jumpRouter(sub)">
          <span slot="title">{{sub.meta.title}}</span>
        </el-menu-item>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
import rpush from '@/router/modules/rpush'
import other from '@/router/modules/other'
const route = [...rpush, ...other]

export default {
  name: 'main-slide',
  data () {
    return {
      routes: [],
      activeIndex: '0'
    }
  },
  created () {
    document.title = 'Rpush — ' + this.$route.meta.title
    this.activeIndex = this.$route.name
    this.routes = route.filter(item => {
      return item.meta && !item.meta.hideInMenu
    })
  },
  methods: {
    jumpRouter (val) {
      console.log(val)
      document.title = 'Rpush — ' + val.meta.title
      this.$router.push({ name: val.name })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  background-color: #1d2334 !important;
  .menu-img {
    width: 100%;
    text-align: center;
  }
  /deep/ .el-menu-item, /deep/ .el-submenu__title{
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-submenu__title {
    color: #c3c6cc;
    &:hover {
      background-color: #1d2334;
      color: #fff;
    }
  }
  /deep/ .el-submenu__title.is-active {
    background-color: #0078ff;
    color: #fff;
  }
  /deep/ .el-submenu .el-menu-item {
    min-width: 175px !important;
  }
}
</style>
