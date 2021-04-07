<template>
  <div class="taskManagement">
    <!-- 头部 -->
    <div class="taskManagement_header">
      <div class="title">
        <el-row>
          <el-col :span="22">发消息</el-col>
          <el-col :span="2"><el-button type="text" @click="doShowHisDetailDialog">查看消息日志</el-button></el-col>
        </el-row>
      </div>
    </div>
    <!-- 内容 -->
    <div class="taskManagement_container">
      <div class="tm_c_wrap">
        <!-- 左边导航 -->
        <div class="tm_c_menu">
          <div class="tm_c_menu_option">
            <div class="tm_c_menu_top">
              <div class="tm_c_menu_top_title">平台</div>
            </div>
            <!-- 搜索 -->
            <div class="tm_c_menu_search">
              <el-input size="mini" placeholder="请输入平台名称" v-model="keyword" clearable @keyup.enter.native="platformList">
                <el-button slot="append" size="mini" icon="el-icon-search" @click="platformList"></el-button>
              </el-input>
            </div>
          </div>
          <!-- 列表 -->
          <div class="tm_c_menu_list">
            <div class="item" v-for="(item, index) in menuList" :class="menuListActive.id === item.id ? 'itemActive' : ''" :key="index" @click="routeTo(item.id)">
              <div>{{item.name}}</div>
            </div>
          </div>
        </div>
        <!-- 右边表格 -->
        <div class="tm_c_table">
          <div class="setOfLayer">
            <div>
              <el-row>
                <el-col :span="16" style="padding: 12px 0">
                  <span style="font-size: 16px">{{ menuListActive.name }}</span>
                </el-col>
                <el-col :span="8" style="padding-top: 4px">
                  <el-dropdown @command="saveOrUpdateScheme">
                    <span class="el-dropdown-link">
                      <i class="el-icon-setting el-icon--left"></i>方案管理<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="saveOther">另存为新方案</el-dropdown-item>
                      <el-dropdown-item command="saveCurrent">保存当前方案</el-dropdown-item>
                      <el-dropdown-item command="manageScheme">管理方案</el-dropdown-item>
                    </el-dropdown-menu>
                    <!-- 管理方案弹窗 -->
                    <el-dialog title="管理方案" :visible.sync="dialogManageSchemeVisible">
                      <el-table :data="schemeList">
                        <el-table-column property="name" label="方案名称" width="200"></el-table-column>
                        <el-table-column
                          label="操作">
                          <template slot-scope="scope">
                            <el-popconfirm
                              confirm-button-text='确定'
                              cancel-button-text='取消'
                              icon="el-icon-info"
                              icon-color="red"
                              @onConfirm="deleteScheme(scope.row.id)"
                              title="确定要删除这个方案吗？"
                            >
                              <el-button type="danger" size="small" slot="reference">删除</el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-dialog>
                  </el-dropdown>
                  <el-select size="small" clearable placeholder="请选择方案..." @change="schemeChange" v-model="selectedScheme" value-key="id">
                    <el-option
                      v-for="item in schemeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </div>
            <!-- 备注说明 -->
            <div class="remarks_box">
              {{ menuListActive.description }}
            </div>
            <!-- 表格 -->
            <div class="table_layout fixedLayer">
              <div class="setOfLayer send-param">
                <el-row style="border-bottom: 0;padding-bottom: 0;">
                  <el-col :span="24">
                    <el-tabs v-model="selectedMessageType">
                      <el-tab-pane v-for="item in messageTypes" :label="item.name" :name="item.id" :key="item.id"></el-tab-pane>
                    </el-tabs>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    选择配置：
                    <el-select v-model="sendMessageParam.configIds" multiple placeholder="请选择配置...">
                      <el-option
                        v-for="item in configs"
                        :key="item.configId"
                        :label="item.configName"
                        :value="item.configId">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <multiInput :headers="headers"/>
                  </el-col>
                </el-row>
                <div v-for="item in selectedMessageTypeFields">
                  <el-row v-if="item.type === 'RECEIVER_GROUP'">
                    <el-col :span="24">
                      选择分组：
                      <el-select v-model="sendMessageParam.param[item.key]" multiple placeholder="请选择分组...">
                        <el-option
                          v-for="item in groups"
                          :key="item.id"
                          :label="item.groupName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.type === 'RECEIVER'">
                    <el-col :span="6">
                      <el-input
                        size="small"
                        clearable
                        v-model="inputReceiverId"
                        ref="inputReceiverId"
                        @keyup.enter.native="handleAddReceiverId(item)"
                        placeholder="输入并回车补充接收人...">
                      </el-input>
                    </el-col>
                    <el-col :span="15">
                      <el-button type="text" size="small" @click="handleClearAddReceiverId(item)">清空</el-button>
                      <span v-show="false">{{sendMessageParam.param[item.key]}}</span>
                    </el-col>
                    <el-col :span="24">
                      <el-tag
                        style="margin-bottom: 2px; margin-left: 2px"
                        v-for="addId in sendMessageParam.param[item.key]"
                        size="small"
                        :key="addId"
                        @close="handleAddReceiverIdClose(item, addId)"
                        closable
                        :type="'info'">
                        {{ addId }}
                      </el-tag>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.type === 'STRING'">
                    <el-col :span="24">
                      <el-input
                        size="small"
                        type="text"
                        clearable
                        v-model="sendMessageParam.param[item.key]"
                        :placeholder="item.description || item.name">
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row v-if="item.type === 'TEXTAREA'">
                    <el-col :span="24">
                      <el-input
                        type="textarea"
                        clearable
                        :autosize="{ minRows: 15, maxRows: 100}"
                        v-model="sendMessageParam.param[item.key]"
                        :placeholder="item.description || item.name">
                      </el-input>
                    </el-col>
                  </el-row>
                </div>
                <el-row style="border-bottom: 0;border-top: 1px solid #c3c6cc; position: -webkit-sticky;position: sticky;bottom: 0; background: white;">
                  <el-col :span="24">
                    <el-button size="small" type="primary" @click="sendMessage">发送</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hisDetailDialog
      :dialogVisible=showHisDetailDialog
      :requestNo="requestNo"
      :platform="menuListActive.id"
      @closed="closeHisDetail"
    />
  </div>
</template>
<script>
import {
  platformList,
  queryConfig,
  sendMessage,
  queryGroup,
  listMessageType,
  listMessageTypeField,
  listScheme,
  schemeDetail,
  updateOrSaveScheme,
  deleteScheme
} from '@/api/rpush'

import {Message} from "element-ui";

export default {
  name: 'groupManagement',
  components: {
    hisDetailDialog: () => import('./component/hisDetailDialog.vue'),
    multiInput: () => import('./component/multiInput.vue'),
  },
  data() {
    return {
      headers: [
        {
          key: "title",
          label: "标题"
        },
        {
          key: "description",
          label: "描述"
        },
        {
          key: "url",
          label: "url"
        }
      ],
      keyword: '',
      menuListActive: {},
      menuList: [],
      configs: [],
      groups: [],
      inputReceiverId: '',// 当前新增的接收人
      addReceiverIds: [], // 新增的接收人
      // 发送消息参数
      sendMessageParam: {
        configIds: [],
        param: {}
      },
      selectedMessageType: null, // 选择的消息类型
      selectedMessageTypeFields: [], // 选择的消息类型的所有字段
      showHisDetailDialog: false,
      requestNo: '',
      messageTypes: [],
      schemeList: [],
      selectedScheme: null,
      dialogManageSchemeVisible: false,
    }
  },
  watch: {
    // 切换消息类型
    selectedMessageType (val) {
      if (!val || val === '0') {
        return
      }
      this.changeMessageType()
    }
  },
  async mounted () {
    await this.platformList()
  },
  methods: {
    closeHisDetail () {
      this.showHisDetailDialog = false
    },
    handleAddReceiverId (item) {
      let reg = new RegExp(this.menuListActive.validateReg)
      let validate = reg.test(this.inputReceiverId)
      if (!validate) {
        Message.error("格式校验不正确")
      }
      this.sendMessageParam.param[item.key] = this.sendMessageParam.param[item.key] || []
      if (!this.inputReceiverId || this.sendMessageParam.param[item.key].indexOf(this.inputReceiverId) >= 0 || !validate) {
        return;
      }
      this.sendMessageParam.param[item.key].push(this.inputReceiverId)
      this.inputReceiverId = ''
    },
    handleClearAddReceiverId (item) {
      this.sendMessageParam.param[item.key] = []
      this.$forceUpdate()
    },
    handleAddReceiverIdClose (item, addId) {
      this.sendMessageParam.param[item.key] = this.sendMessageParam.param[item.key] || []
      this.sendMessageParam.param[item.key].splice(this.sendMessageParam.param[item.key].indexOf(addId), 1)
      this.$forceUpdate()
    },
    async routeTo (platform) {
      if (platform) {
        for (const m of this.menuList) {
          if (m.id === platform) {
            this.menuListActive = m
          }
        }
      } else {
        this.menuListActive = this.menuList[0] // 默认显示第一个平台的数据
      }
      await this.queryConfig()
      await this.queryGroup()
      await this.initParam()
      let typeRes = await listMessageType(this.menuListActive.id)
      this.messageTypes = typeRes.data
      this.selectedMessageType = this.messageTypes[0].id // 默认选择第一个消息类型
      await this.changeMessageType()
    },
    // 刷新方案
    refreshScheme (success) {
      let that = this
      listScheme(this.selectedMessageType, (res) => {
        that.schemeList = res.data
        success && success()
      })
    },
    // 获取平台列表
    async platformList () {
      let res = await platformList({keyword: this.keyword, pageNo: 1, pageSize: 999})
      if (res.code === 0) {
        this.menuList = res.data
        this.routeTo(this.menuListActive.id || this.$route.query.platform)
      }
    },
    async queryConfig () {
      let configRes = await queryConfig(this.menuListActive.id, {
        pageSize: 2147483647
      });
      this.configs = configRes.data.pagination.dataList
      this.sendMessageParam.configIds = []
      for (let i = 0; i < this.configs.length; i++) {
        if (this.configs[i].defaultFlag) {
          this.sendMessageParam.configIds.push(this.configs[i].configId)
        }
      }
    },
    async queryGroup () {
      let groupRes = await queryGroup(this.menuListActive.id, {
        pageSize: 2147483647
      })
      this.groups = groupRes.data.dataList
    },
    async sendMessage () {
      if (!this.sendMessageParam.configIds.length) {
        Message.error('请选择至少一个配置')
        return
      }
      let param = {}
      param[this.selectedMessageType] = {
        ...this.sendMessageParam
      }
      let res = await sendMessage({
        messageParam: param
      })
      let that = this
      const h = this.$createElement
      this.$msgbox({
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
            this.showHisDetailDialog = true
          }
          done()
        }
      }).then(action => {
      })
    },
    doShowHisDetailDialog () {
      this.requestNo = ''
      this.showHisDetailDialog = true
    },
    initParam () {
      this.sendMessageParam.param = {}

      this.inputReceiverId = ''// 当前新增的接收人
      this.addReceiverIds = [] // 新增的接收人
    },
    // 切换消息类型
    async changeMessageType () {
      let fieldRes = await listMessageTypeField(this.selectedMessageType)
      this.selectedMessageTypeFields = fieldRes.data

      this.selectedScheme = null
      this.refreshScheme()
      this.initParam()
    },
    async schemeChange (scheme) {
      if (!scheme) {
        // 清空方案
        this.initParam()
        return
      }
      let res = await schemeDetail(scheme.id)
      let param = res.data.param
      if (param) {
        this.sendMessageParam = JSON.parse(param)
      }
    },
    // 删除方案
    async deleteScheme (schemeId) {
      debugger
      await deleteScheme(schemeId)
      if (this.selectedScheme && schemeId === this.selectedScheme.id) {
        // 刚好删了现在选择的方案
        this.selectedScheme = null
      }
      this.refreshScheme()
    },
    async saveOrUpdateScheme (command) {
      if (command === 'manageScheme') {
        this.dialogManageSchemeVisible = true
        return
      }
      let that = this
      this.$prompt('请输入方案名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: command === 'saveOther' || !this.selectedScheme ? null : this.selectedScheme.name
      }).then(({ value }) => {
        updateOrSaveScheme({
          id: command === 'saveOther' || !this.selectedScheme ? null : that.selectedScheme.id, // 如果是另存为，不传id给后台
          name: value,
          messageType: that.selectedMessageType,
          param: JSON.stringify(that.sendMessageParam)
        }, function (res) {
          that.refreshScheme(() => {
            that.selectedScheme = res.data
          })
        })
      }).catch(() => {
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.taskManagement {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .taskManagement_header {
    height: 64px;
    font-size:16px;
    font-weight:500;
    color:rgba(29,35,52,1);
    padding-left: 16px;
    box-sizing: border-box;
    line-height: 64px;
  }
  .taskManagement_container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(232, 236, 242, 1);
    .tm_c_wrap {
      width: 100%;
      height: 100%;
      display: flex;
      .tm_c_menu {
        width: 240px;
        border-radius: 4px;
        background-color: #fff;
        height: 100%;
        margin-right: 16px;
        padding: 10px 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .tm_c_menu_option {
          .tm_c_menu_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            .tm_c_menu_top_title {
              font-size:16px;
              font-weight:500;
              color:rgba(29,35,52,1);
            }
          }
        }
        .tm_c_menu_list {
          flex: 1;
          overflow-y: auto;
          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            width:calc(100% - 10px);
            height:32px;
            background:rgba(232,236,242,1);
            border-radius:4px;
            font-size:12px;
            margin: 5px;
            line-height: 32px;
            text-align: center;
            font-weight:400;
            color:#656975;
            box-sizing: border-box;
            cursor: pointer;
            div {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &:hover {
              background:rgba(0,120,255,1);
              color:rgba(255,255,255,1);
            }
          }
          .itemActive {
            width:calc(100% - 10px);
            height:32px;
            background:rgba(0,120,255,1);
            border-radius:4px;
            font-size:12px;
            font-weight:400;
            line-height: 32px;
            text-align: center;
            margin: 5px;
            color:rgba(255,255,255,1);
          }
        }
      }
      .tm_c_table {
        height: 100%;
        width: 100%;
        flex: 1;
        overflow-y: auto;
        padding: 10px 16px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        .features {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            font-size:20px;
            font-weight:500;
            color:rgba(29,35,52,1);
          }
          .features_right {
            display: flex;
            align-items: center;
            /deep/ .el-input-group {
              width: auto;
            }
            .addTask {
              flex-shrink: 0;
              margin-left: 10px;
              cursor: pointer;
              color: rgba(0,120,255,1);
              font-size: 16px;
              font-weight: 500;
            }
          }
        }
        .remarks_box {
          padding: 5px 0;
          font-size:12px;
          font-weight:400;
          color:rgba(101,105,117,1);
          display: flex;
          border-bottom: 1px solid rgba(195, 198, 204, 1);
          .item {
            border-right: 1px solid rgba(101,105,117,.5);
            margin-right: 20px;
            padding-right: 20px;
            &:last-child {
              border-right: none
            }
          }
        }
        .table_layout {
          flex: 1;
          margin-top: 15px;
          margin-left: 50px;
          margin-right: 50px;
          overflow-y: auto;
        }
      }
    }
  }
}
.setOfLayer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .fixedLayer {
    flex: 1;
    overflow-y: auto;
  }
}
.table_page {
  text-align: center;
  padding-top: 10px;
}
.preState {
  display: inline-block;
  padding-left: 10px;
}
.info{
  color: #909399;
}
.success{
  color: #67c23a;
}
.primary{
  color: #409eff;
}
.operating {
  font-size:12px;
  font-weight:400;
  color:rgba(0,120,255,1);
  display: inline-block;
  padding: 0 5px;
  cursor: pointer;
}
.danger{
  color: #f56c6c;
}
.optionIng {
  display: flex;
  span{
    margin-right: 15px;
  }
}
.el-table{
  overflow: auto;
}
.el-table__header-wrapper,.el-table__body-wrapper,.el-table__footer-wrapper{overflow:visible;}
.el-table__body-wrapper{
  overflow-x:visible !important;
}
.send-param .el-row {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px solid #c3c6cc;
}
</style>
<style scoped>
.send-param>>>.el-textarea__inner {
  border: 0;
  resize: none;
}
.send-param>>>.el-input__inner {
  border: 0;
}
</style>
