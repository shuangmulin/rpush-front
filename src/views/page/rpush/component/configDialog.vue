<template>
  <div class="config_dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="720px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      title="配置信息"
      :show-close="false"
    >
      <div class="container">
        <img class="c_img" src="../../../../assets/回形针@2x.png" width="48" height="48"/>
        <div class="item is-required">
          <label>配置名称</label>
          <el-input :placeholder="`请输入配置名称`" v-model="config.configName" size="mini"></el-input>
        </div>
      </div>
      <div class="customize_wrap">
        <div class="customize_wrap_content">
          <div class="item itemDate" v-for="(item, index) in fields" :key="index">
            <label>{{ item.name }}</label>
            <el-date-picker
              v-model="item.value"
              type="datetime"
              v-if="item.type === 'DATETIME'"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择日期"
            ></el-date-picker>
            <el-select
              v-model="config[item.key]"
              placeholder="请选择"
              v-else-if="['BOOLEAN', 'ENUM', 'RPUSH_TEMPLATE' ].includes(item.type)"
              size="mini"
            >
              <el-option
                v-for="(optionItem) in item.options"
                :key="optionItem.id"
                :label="optionItem.name"
                :value="optionItem.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="config[item.key]"
              v-else-if="['STRING', 'INTEGER', 'DECIMAL'].includes(item.type)"
              :placeholder="item.description"
              size="mini"
            ></el-input>
          </div>
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
import { queryConfigField, getConfig, updateConfig } from '@/api/rpush'
export default {
  name: 'configDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: ''
    },
    configId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      fields: [],
      config: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let res = await queryConfigField(this.platform)
      this.fields = res.data

      if (this.configId && this.configId > 0) {
        let configRes = await getConfig(this.platform, this.configId)
        this.config = configRes.data
      }
    },
    async handleSave () {
      let res = await updateConfig({
        platform: this.platform,
        configId: this.configId,
        configName: this.config.configName,
        config: this.config
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
