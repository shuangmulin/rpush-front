<template>
  <div class="scheme_dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      width="720px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${taskId ? '编辑任务' : '新建任务'}`"
      :show-close="false"
    >
      <div class="container">
        <img class="c_img" src="../../../../assets/回形针@2x.png" width="48" height="48"/>
      </div>
      <div class="customize_wrap">
        <div class="customize_wrap_content">
          <div class="item itemDate is-required">
            <label>任务名称</label>
            <el-input :placeholder="`请输入任务名称`"is-required v-model="task.jobName" size="mini"></el-input>
          </div>
          <div class="item itemDate is-required">
            <label>任务分组</label>
            <el-input :placeholder="`请输入任务分组`" v-model="task.jobGroup" size="mini"></el-input>
          </div>
          <div class="item itemDate is-required">
            <label>cron表达式<el-link type="primary" @click="openCronUrl" style="font-size: xx-small; padding-left: 5px">在线生成cron表达式</el-link></label>
            <el-input :placeholder="`请输入cron表达式`" v-model="task.cronExpression" size="mini"></el-input>
          </div>
          <div class="item itemDate is-required">
            <label>预设开始时间</label>
            <el-date-picker
              v-model="task.startAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div class="item itemDate is-required">
            <label>预设结束时间</label>
            <el-date-picker
              v-model="task.endAt"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div class="item itemDate">
            <label>任务描述</label>
            <el-input :placeholder="`请输入任务描述`" v-model="task.description" size="mini"></el-input>
          </div>
          <div class="item itemDate">
            <el-checkbox size="mini" border v-model="task.enableFlag" :true-label="false" :false-label="true" class="task-dialog-label-param">是否启用</el-checkbox>
          </div>
        </div>
      </div>
      <div style="padding: 0 5px;">
        <span class="is-required">
          <label class="task-dialog-label">
            任务参数
          </label>
        </span>
        <el-button size="mini" type="text" @click="innerVisible = true">从消息方案添加参数</el-button>
        <div v-if="selectedMessageTypes && selectedMessageTypes.length" style="margin-bottom: 8px; padding: 3px; border: 1px solid #DCDFE6">
          <label class="task-dialog-label-param">已选择的消息类型：</label>
          <el-tag size="mini" type="info" v-for="item in selectedMessageTypes" closable @close="removeSelectedMessageType(item.id)" style="margin-right: 4px">{{ item.name }}</el-tag>
        </div>
        <vue-json-editor
          v-model="param"
          :showBtns="false"
          :mode="'code'"
          lang="zh"
          @input="onJsonParamChange"
          @has-error="onJsonErrorChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button type="warning" plain size="mini" @click="sendMessage">试一试</el-button>
        <el-button type="primary" size="mini" @click="handleSave">确 定</el-button>
      </span>
      <hisDetailDialog
        :dialogVisible=showHisDetailDialog
        :requestNo="requestNo"
        @closed="closeHisDetail"
      />
      <el-dialog
        width="40%"
        margin-top="30vh"
        title="从消息方案选择参数"
        :visible.sync="innerVisible"
        append-to-body>
        <div class="container">
          <div class="item">
            <label>选择平台</label>
            <el-select size="mini" v-model="platform" placeholder="请选择消息平台...">
              <el-option
                v-for="item in platforms"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <label>消息类型</label>
            <el-select size="mini" v-model="messageType" placeholder="请选择消息类型...">
              <el-option
                v-for="item in messageTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <label>消息方案</label>
            <el-select clearable size="mini" v-model="schemeId" placeholder="请选择消息发送方案...">
              <el-option
                v-for="item in schemes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleSchemeConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import {
  platformList,
  getTask,
  updateTask,
  addTask,
  listMessageTypeSync,
  listScheme,
  schemeDetail,
  messageTypeList,
  sendMessageSync
} from '@/api/rpush'
import vueJsonEditor from 'vue-json-editor'
import {Message} from 'element-ui'
export default {
  name: 'taskDialog',
  components: {
    hisDetailDialog: () => import('./hisDetailDialog.vue'),
    vueJsonEditor
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      default: null
    },
    paramProps: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      task: {},
      messageTypes: [],
      messageType: '',
      schemes: [],
      schemeId: null,
      platforms: [],
      platform: null,
      param: {},
      innerVisible: false,
      allMessageTypes: [],
      selectedMessageTypes: [],
      requestNo: null,
      showHisDetailDialog: false,
      isParamJsonError: false
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    platform(val) {
      if (!val) {
        return
      }
      let that = this
      listMessageTypeSync(val, function (res) {
        that.messageTypes = res.data
      })
    },
    messageType(val) {
      if (!val) {
        return
      }
      let that = this
      listScheme(val, function (res) {
        that.schemes = res.data
      })
    },
    paramProps(val) {
      if (!val) {
        return
      }
      this.param = val
      this.parseMessageType()
      this.isParamJsonError = false
    }
  },
  methods: {
    async init () {
      let platformRes = await platformList({pageNo: 1, pageSize: 999})
      this.platforms = platformRes.data

      let messageTypeRes = await messageTypeList()
      this.allMessageTypes = messageTypeRes.data

      if (this.taskId && this.taskId > 0) {
        let taskRes = await getTask(this.taskId)
        this.task = taskRes.data
        this.param = JSON.parse(this.task.param)
        this.isParamJsonError = false
        this.parseMessageType()
      }

      if (this.paramProps) {
        this.param = this.paramProps
        this.isParamJsonError = false
        this.parseMessageType()
      }
    },
    async handleSchemeConfirm () {
      let res = await schemeDetail(this.schemeId)
      this.param.messageParam = this.param.messageParam || {}
      this.param.messageParam[this.messageType] = JSON.parse(res.data.param)
      this.param = JSON.parse(JSON.stringify(this.param))
      this.innerVisible = false
      this.parseMessageType()
    },
    async handleSave () {
      if (this.isParamJsonError) {
        Message({
          message: '任务参数格式错误，无法提交',
          type: 'error'
        })
        return
      }
      this.task.param = JSON.stringify(this.param)
      if (this.taskId) {
        // 更新
        let res = await updateTask(this.task)
        if (res.code !== 0) {
          return
        }
      } else {
        // 新增
        let res = await addTask(this.task)
        if (res.code !== 0) {
          return
        }
      }
      Message({
        message: '任务' + (this.taskId ? '更新' : '新建') + '操作成功',
        type: 'success'
      })
      this.$emit('update:dialogVisible', false)
      this.$emit('handleSave', this.task)
    },
    parseMessageType () {
      if (!this.param.messageParam) {
        return
      }
      this.selectedMessageTypes = []
      for (let key in this.param.messageParam) {
        for (let i = 0; i < this.allMessageTypes.length; i++) {
          let messageType = this.allMessageTypes[i]
          if (messageType.id !== key) {
            continue
          }
          this.selectedMessageTypes.push(messageType)
        }
      }
    },
    removeSelectedMessageType (messageType) {
      if (!this.param.messageParam) {
        return
      }
      for (let key in this.param.messageParam) {
        if (messageType === key) {
          delete this.param.messageParam[key]
          break
        }
      }
      this.param = JSON.parse(JSON.stringify(this.param))
      this.parseMessageType()
    },
    handleCancel () {
      this.$emit('update:dialogVisible', false)
    },
    onJsonParamChange (val) {
      this.param = val
      this.isParamJsonError = false
    },
    onJsonErrorChange (val) {
      this.isParamJsonError = true
    },
    async sendMessage () {
      if (this.isParamJsonError) {
        Message({
          message: '任务参数格式错误，无法提交',
          type: 'error'
        })
        return
      }
      this.$confirm('确定要以现在的参数发送消息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let that = this
        const h = this.$createElement
        sendMessageSync(this.param, function (res) {
          if (res.code !== 0) {
            return
          }
          that.$msgbox({
            title: '结果',
            message: h('p', null, [
              h('span', null, '消息投递成功，请求号：' + res.data)
            ]),
            showCancelButton: true,
            confirmButtonText: '查看日志',
            cancelButtonText: '知道了',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                that.requestNo = res.data
                that.showHisDetailDialog = true
              }
              done()
            }
          }).then(action => {
          })
        })
      }).catch(() => {
      })
    },
    closeHisDetail () {
      this.showHisDetailDialog = false
    },
    openCronUrl () {
      window.open("http://cron.toulezu.com/")
    }
  }
}
</script>
<style lang="scss" scoped>
.task-dialog-label {
  font-size: 12px;
  font-weight: 400;
  color: #1d2334;
  margin-bottom: 8px;
  display: inline-block
}
.task-dialog-label-param {
  font-size: 12px;
  font-weight: 400;
  color: #1d2334;
  display: inline-block
}
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
.jsoneditor-poweredBy{
  display: none;
}
</style>
