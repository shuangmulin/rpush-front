<template>
  <div id="app" :style="{height: heights +'px'}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      heights: 500
    }
  },
  mounted () {
    this.heights = window.innerHeight
    window.onresize = () => {
      this.heights = window.innerHeight
    }
  }
}
</script>

<style>
body {
  /* width: 100%; */
  min-width: 1200px;
  height: 100%;
  background: #f0f0f0;
  margin: 0
}
#app {
  width: 100%;
  font-size: 14px;
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
/* // 滚动条宽度 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0, 0, 0, 0.15);
}
#app .el-table .el-table__header {
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}
#app .el-table th, #app .el-table td {
  font-size: 12px;
  padding: 5px 0;
}
#app .el-table .el-button--text {
  padding: 0;
  font-size: 12px;
}
#app .table-card {
  flex: 1;
  margin: 10px;
  overflow: auto;
}
#app .el-card__body {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
}
.el-card_flexColumn {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-card_flex1 {
  flex: 1;
  position: relative;
  overflow-y: hidden;
}
.el-card_flexPagination {
  text-align: center;
  margin-top: 5px;
  padding: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield; /* firefox */
}
body .el-table th.gutter{
  display: table-cell!important;
}
</style>
