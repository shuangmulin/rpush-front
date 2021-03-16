<template>
  <div class="config_dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="720px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      title="接收人信息"
      :show-close="false"
    >
      <div class="container">
        <img class="c_img" src="../../../../assets/回形针@2x.png" width="48" height="48"/>
        <div class="item is-required">
          <label>接收人名称</label>
          <el-input :placeholder="`请输入接收人名称`" v-model="receiver.receiverName" size="mini"></el-input>
        </div>
        <div class="item is-required">
          <label>接收人ID</label>
          <el-input :placeholder="`请输入接收人ID`" v-model="receiver.receiverId" size="mini"></el-input>
        </div>
        <div class="item is-required">
          <label>接收人分组</label>
          <el-select
            v-model="receiver.groupId"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="(item) in receiverGroups"
              :label="item.groupName"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getReceiver, updateReceiver, queryGroup } from '@/api/rpush'
export default {
  name: 'receiverDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: ''
    },
    receiverId: {
      type: Number,
      default: null
    },
    groupId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      receiver: {},
      receiverGroups: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let groupRes = await queryGroup(this.platform, {
        pageNum: 1,
        pageSize: 2147483647
      })
      this.receiverGroups = groupRes.data.dataList

      if (this.receiverId && this.receiverId > 0) {
        let receiverRes = await getReceiver(this.platform, this.receiverId)
        this.receiver = receiverRes.data
      } else {
        if (this.groupId) {
          this.receiver.groupId = Number(this.groupId) // 如果有传分组id，默认选择传入的分组
        }
      }
    },
    async handleSave () {
      let res = await updateReceiver({
        platform: this.platform,
        ...this.receiver
      })
      if (res.code !== 0) {
        return
      }
      this.$emit('update:dialogVisible', false)
      this.$emit('handleSave')
    },
    handleCancel () {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .c_img {
    position: absolute;
    left: 0;
    top: -6px;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .row_one {
    width: 33%;
  }
  .item {
    width: 33%;
    padding: 0 5px;
    margin-bottom: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    label {
      font-size: 12px;
      font-weight: 400;
      color: rgba(29, 35, 52, 1);
      display: inline-block;
      margin-bottom: 8px;
    }
  }
}
.items {
  display: flex;
  flex-direction: column;
  width: 100%;
  label {
    font-size: 12px;
    font-weight: 400;
    color: rgba(29, 35, 52, 1);
    display: inline-block;
    margin-bottom: 8px;
  }
}
.item_title {
  display: block;
}
.is-required {
  label {
    display: inline-block;
    position: relative;
    &::after {
      content: "*";
      position: absolute;
      left: -5px;
      top: 0;
      color: red;
    }
  }
}
.container {
  flex-wrap: wrap;
  display: flex;
}
.customize_wrap_content {
  flex-wrap: wrap;
  display: flex;
  .item {
    width: 33%;
    padding: 0 5px;
    margin-bottom: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    label {
      font-size: 12px;
      font-weight: 400;
      color: rgba(29, 35, 52, 1);
      display: inline-block;
      margin-bottom: 8px;
    }
  }
}
.item_title {
  padding: 24px 0;
  line-height: 24px;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}
/deep/ .dialog-footer {
  justify-content: flex-end;
}
/deep/ .el-dialog__header {
  padding: 30px 32px !important;
  font-size: 16px;
  font-weight: 500;
  color: rgba(29, 35, 52, 1);
}
/deep/ .el-dialog__body {
  padding: 0 32px;
}
/deep/ .el-dialog__footer {
  padding: 24px 32px;
}
</style>
<style lang="scss">
.itemDate .el-date-editor {
  width: 205px !important;
}
</style>
