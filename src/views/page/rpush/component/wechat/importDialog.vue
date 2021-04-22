<template>
  <div class="config_dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="720px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      title="从企业微信导入"
      :show-close="false"
    >
      <div class="container">
        <img class="c_img" src="../../../../../assets/回形针@2x.png" width="48" height="48"/>
        <div class="item">
          <label>请选择配置</label>
          <el-select v-model="model.configId" @change="configChange" size="mini" clearable placeholder="请选择配置...">
            <el-option
              v-for="item in configs"
              :key="item.configId"
              :label="item.configName"
              :value="item.configId">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="padding: 0 5px; margin-bottom: 10px">
        <el-tabs v-model="model.importStyle" type="border-card">
          <el-tab-pane name="0" label="导入所有用户">
            <div class="customize_wrap">
              <div class="customize_wrap_content">
                <div class="item itemDate">
                  <label>选择分组：</label>
                  <el-select
                    :clearable="false"
                    v-model="model.groupId"
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
            </div>
          </el-tab-pane>
          <el-tab-pane name="1" label="按部门导入">
            <div class="customize_wrap">
              <div class="customize_wrap_content">
                <div class="item itemDate">
                  <el-radio size="mini" v-model="model.departmentStyle" label="1">按部门名称创建分组</el-radio>
                  <el-radio size="mini" v-model="model.departmentStyle" label="2">导入指定分组</el-radio>
                </div>
                <div v-if="model.departmentStyle === '2'" class="item itemDate">
                  <label>选择分组：</label>
                  <el-select
                    :clearable="false"
                    v-model="model.groupId"
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
                <div class="item itemDate">
                  <label>选择部门：</label>
                  <el-select
                    clearable
                    multiple
                    v-model="model.departmentIds"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option
                      v-for="(item) in departments"
                      :label="item.name"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-tab-pane>
<!--          <el-tab-pane label="按标签导入">-->
<!--            <div class="customize_wrap">-->
<!--              <div class="customize_wrap_content">-->
<!--                <div class="item itemDate">-->
<!--                  <el-radio size="mini" v-model="model.departmentStyle" label="1">按标签名称匹配分组</el-radio>-->
<!--                  <el-radio size="mini" v-model="model.departmentStyle" label="2">指定导入分组</el-radio>-->
<!--                </div>-->
<!--                <div class="item itemDate">-->
<!--                  <label>选择分组：</label>-->
<!--                  <el-select-->
<!--                    :clearable="false"-->
<!--                    v-model="model.groupId"-->
<!--                    placeholder="请选择"-->
<!--                    size="mini"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="(item) in receiverGroups"-->
<!--                      :label="item.groupName"-->
<!--                      :value="item.id"-->
<!--                      :key="item.id"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--                <div class="item itemDate">-->
<!--                  <label>选择标签：</label>-->
<!--                  <el-select-->
<!--                    clearable-->
<!--                    v-model="cpUserImportParam.groupId"-->
<!--                    placeholder="请选择"-->
<!--                    size="mini"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="(item) in receiverGroups"-->
<!--                      :label="item.groupName"-->
<!--                      :value="item.id"-->
<!--                      :key="item.id"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryConfig, cpImportReceiver, queryGroup, listDepartment } from '@/api/rpush'
import {Message} from 'element-ui'
export default {
  name: 'cpUserImportDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cpUserImportParam: {},
      receiverGroups: [],
      configs: [],
      departments: [],
      importStyle: 1,
      model: {
        configId: null,
        groupId: -1,
        departmentStyle: "1",
        departmentIds: null,
        importStyle: 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async configChange (val) {
      if (!val) {
        return
      }
      let config = this.getConfig(val)
      let res = await listDepartment(config)
      this.departments = res.data
      this.departments.unshift({
        id: -1,
        name: "所有部门"
      })
      this.model.departmentIds = [-1]
    },
    async init () {
      let groupRes = await queryGroup(this.platform, {
        pageNum: 1,
        pageSize: 2147483647
      })
      this.receiverGroups = groupRes.data.dataList
      this.receiverGroups.unshift({
        id: -1,
        groupName: "默认分组"
      })

      this.queryConfig()
    },
    async handleSave () {
      if (!this.model.configId) {
        Message.warning("请选择配置")
        return
      }
      let config = this.getConfig(this.model.configId)
      let param = {
        corpId: config.corpId,
        secret: config.secret,
        agentId: config.agentId,
        importStyle: this.model.importStyle,
        groupId: this.model.groupId,
        departmentImportStyle: this.model.departmentStyle,
        departmentIds: this.model.departmentIds
      }
      cpImportReceiver(param)
      this.$emit('update:dialogVisible', false)
    },
    handleCancel () {
      this.$emit('update:dialogVisible', false)
    },
    async queryConfig () {
      let configRes = await queryConfig(this.platform, {
        pageSize: 2147483647
      });
      this.configs = configRes.data.pagination.dataList
    },
    getConfig (configId) {
      let config;
      this.configs.forEach((item) => {
        if (item.configId === configId) {
          config = item
        }
      })
      return config
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
