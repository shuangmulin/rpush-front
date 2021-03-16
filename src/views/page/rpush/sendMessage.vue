<template>
  <div class="taskManagement">
    <!-- 头部 -->
    <div class="taskManagement_header">
      <div class="title">发消息</div>
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
            <div class="features">
              <span class="title">{{ menuListActive.name }}</span>
            </div>
            <!-- 备注说明 -->
            <div class="remarks_box">
              {{ menuListActive.description }}
            </div>
            <!-- 表格 -->
            <div class="table_layout fixedLayer">
              <div class="setOfLayer">
                <el-row>
                  <el-col :span="24">
                    选择配置：
                    <el-select v-model="model.configIds" multiple placeholder="请选择配置...">
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
                    选择分组：
                    <el-select v-model="model.groupIds" multiple placeholder="请选择分组...">
                      <el-option
                        v-for="item in groups"
                        :key="item.id"
                        :label="item.groupName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-input
                      size="small"
                      clearable
                      v-model="inputReceiverId"
                      ref="inputReceiverId"
                      @keyup.enter.native="handleAddReceiverId"
                      placeholder="输入并回车补充接收人...">
                    </el-input>
                  </el-col>
                  <el-col :span="15">
                    <el-button type="text" size="small" @click="handleClearAddReceiverId">清空</el-button>
                  </el-col>
                  <el-col :span="24">
                    <el-tag
                      style="margin-bottom: 2px; margin-left: 2px"
                      v-for="item in addReceiverIds"
                      size="small"
                      :key="item"
                      @close="handleAddReceiverIdClose(item)"
                      closable
                      :type="'info'">
                      {{ item }}
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-input
                      size="small"
                      type="text"
                      clearable
                      v-model="sendMessageParam.title"
                      placeholder="输入消息标题...">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row style="border-bottom: 0">
                  <el-col :span="24">
                    <el-input
                      type="textarea"
                      clearable
                      :autosize="{ minRows: 15, maxRows: 100}"
                      v-model="sendMessageParam.content"
                      placeholder="输入消息正文...">
                    </el-input>
                  </el-col>
                </el-row>
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
  </div>
</template>
<script>
import {
  platformList,
  queryConfig,
  sendMessage,
  queryGroup
} from '@/api/rpush'

import {Message} from "element-ui";

export default {
  name: 'groupManagement',
  components: {
  },
  data() {
    return {
      keyword: '',
      menuListActive: {},
      menuList: [],
      configs: [],
      groups: [],
      inputReceiverId: '',// 当前新增的接收人
      addReceiverIds: [], // 新增的接收人
      model: {
        configIds: [],
        groupIds: [],
        sendTos: []
      },
      // 发送消息参数
      sendMessageParam: {
        platformParam: {
          /*
          EMAIL: {
            configIds: [],
            sendTos: [],
            param: {}
          }
          */
        },
        title: '',
        content: ''
      }
    }
  },
  async mounted () {
    await this.platformList()
  },
  methods: {
    handleAddReceiverId () {
      this.$nextTick(()=>{
        this.$refs.inputReceiverId.focus()
      })
      let reg = new RegExp(this.menuListActive.validateReg)
      let validate = reg.test(this.inputReceiverId)
      if (!validate) {
        Message.error("格式校验不正确")
      }
      if (!this.inputReceiverId || this.addReceiverIds.indexOf(this.inputReceiverId) >= 0 || !validate) {
        return;
      }
      this.addReceiverIds.push(this.inputReceiverId)
      this.inputReceiverId = ''
    },
    handleClearAddReceiverId () {
      this.$nextTick(()=>{
        this.$refs.inputReceiverId.focus()
      })
      this.addReceiverIds = []
    },
    handleAddReceiverIdClose (item) {
      this.$nextTick(()=>{
        this.$refs.inputReceiverId.focus()
      })
      this.addReceiverIds.splice(this.addReceiverIds.indexOf(item), 1);
    },
    routeTo (platform) {
      if (platform) {
        for (const m of this.menuList) {
          if (m.id === platform) {
            this.menuListActive = m
          }
        }
      } else {
        this.menuListActive = this.menuList[0] // 默认显示第一个平台的数据
      }
      this.queryConfig()
      this.queryGroup()
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
      this.model.configIds = []
      for (let i = 0; i < this.configs.length; i++) {
        if (this.configs[i].defaultFlag) {
          this.model.configIds.push(this.configs[i].configId)
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
      if (!this.model.configIds.length) {
        Message.error("请选择至少一个配置")
        return
      }
      this.model.sendTos.push.apply(this.model.sendTos, this.addReceiverIds);
      this.sendMessageParam.platformParam[this.menuListActive.id] = {
        ...this.model
      }
      let res = await sendMessage(this.sendMessageParam);
      Message({
        message: res.data || '服务器异常',
        type: 'success'
      })
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
            font-size:16px;
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
          padding: 10px 0;
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
.el-row {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px solid #c3c6cc;
}
</style>
<style scoped>
.el-row>>>.el-textarea__inner {
  border: 0;
  resize: none;
}
.el-row>>>.el-input__inner {
  border: 0;
}
</style>
