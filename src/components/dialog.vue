<template>
  <div class="com-dialog">
    <el-dialog :visible.sync="dialogVisible"
               :show-close="false"
               :close-on-click-modal="false"
               :width="dialogWidth">
      <div class="dialog-title" slot="title">{{title}}</div>
      <!-- 是否显示图标 -->
      <div class="icon" v-show="isIcon"></div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="cancel">取消</el-button>
        <el-button :type="type" size="mini" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    isIcon: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '320px'
    },
    type: {
      type: String,
      default: 'danger'
    }
  },
  data () {
    return {

    }
  },
  methods: {
    cancel () {
      this.$emit('update:dialogVisible', false)
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px;
  .input-box {
    display: flex;
    padding-bottom: 10px;
    flex-direction: column;
    .label {
      display: inline-block;
      margin-bottom: 5px;
      position: relative;
    }
    .is-required {
      &::after {
        position: absolute;
        content: '*';
        left: -5px;
        top: 0;
        color: red;
      }
    }
    .input-box-suffix {
      line-height: 28px;
    }
  }
}
</style>
