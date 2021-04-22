<template>
  <div class="taskManagement">
    <!-- 头部 -->
    <cp-user-import-dialog :dialogVisible.sync="cpUserImportDialogVisible" :platform="menuListActive.id" v-if="cpUserImportDialogVisible"></cp-user-import-dialog>
    <div class="taskManagement_header">
      <div class="title">
        <el-row>
          <el-col :span="22">接收人管理</el-col>
          <el-col :span="2">
            <div>
              <el-dropdown trigger="click" size="small" style="line-height: 10px">
                <span class="el-dropdown-link">
                  导入接收人<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-s-release" @click.native="importDialog = true">从Excel导入</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-chat-round" v-if="menuListActive.id === 'WECHAT_WORK_AGENT'" type="text" @click.native="cpUserImportDialogVisible = true">从企业微信导入</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
        <el-dialog width="40%" :visible.sync="importDialog">
          <div class="importDialog-content">
            <el-upload ref="upload"
                       :limit="1"
                       :auto-upload="false"
                       drag
                       :http-request="importExcel"
                       accept='.xls,.xlsx'
                       action="customize">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </div>
          <span slot="footer" class="importDialog-footer">
            <span class="importDialog-template-download" @click="downloadTemplate">
              <i class="el-icon-download"></i><a>下载excel模板</a>
            </span>
            <span>
            <el-button size="small" @click="importDialog = false">取 消</el-button>
            <el-button type="primary" size="small" @click="submitImport">确定导入</el-button>
            </span>
          </span>
        </el-dialog>
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
            <div class="features">
              <span class="title">{{ menuListActive.name }}</span>
              <div class="features_right">
                <nfTypeFilterInput
                  :options="searchTypeList"
                  class="mgl6"
                  :value="this.searchTypeValue"
                  @change="typeSearchChange"
                  @search="doSearch"
                />
                <!-- 按钮 -->
                <div class="el-icon-circle-plus-outline addTask" @click="handleGroupInfo">添加接收人</div>
              </div>
            </div>
            <!-- 备注说明 -->
            <div class="remarks_box">
              {{ menuListActive.description }}
            </div>
            <!-- 表格 -->
            <div class="table_layout fixedLayer">
              <div class="setOfLayer">
                <div class="table_layout_content fixedLayer">
                  <el-table :data="tableData"
                            size="mini"
                            height="100%"
                            style="width: 100%">
                    <el-table-column type="index"
                                     align="center"
                                     label='序号'
                                     :index="index => index + (page.pageNum - 1) * page.pageSize + 1"
                                     width="50"/>
                    <el-table-column align="center"
                                     label='接收人名称'
                                     show-overflow-tooltip
                                     prop="receiverName"
                                     :rander-header="renderHeader"
                                     width="250"/>
                    <el-table-column align="center"
                                     label='接收人ID'
                                     show-overflow-tooltip
                                     prop="receiverId"
                                     :rander-header="renderHeader"
                                     width="300"/>
                    <el-table-column align="center"
                                     label='分组'
                                     show-overflow-tooltip
                                     prop="groupName"
                                     :rander-header="renderHeader"
                                     width="250"/>
                    <el-table-column
                      width="120"
                      label="操作">
                      <template slot-scope="scope">
                        <div class="optionIng">
                          <span class="operating" @click="handleGroupInfo(scope.row)">编辑</span>
                          <span class="danger operating" @click="handleDelete(scope.row)">删除</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!-- 分页 -->
                <div class="table_page">
                  <el-pagination @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="page.pageNum"
                                :page-sizes="[25, 50, 100, 150]"
                                :page-size="page.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page.total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <receiver-dialog :dialogVisible.sync="receiverVisible" :platform="menuListActive.id" :receiverId="receiverId" :groupId="$route.query.groupId" v-if="isReceiverDailog" @handleSave="handleSave"></receiver-dialog>
  </div>
</template>
<script>
import {
  platformList,
  queryReceiver,
  deleteReceiver,
  queryGroup,
  importReceiver,
  download
} from '@/api/rpush'
import {Message} from 'element-ui'

export default {
  name: 'receiverManagement',
  components: {
    receiverDialog: () => import('./component/receiverDialog.vue'),
    cpUserImportDialog: () => import('./component/wechat/importDialog.vue'),
    nfTypeFilterInput: () => import('@/components/nf-type-filter-input.vue')
  },
  data () {
    return {
      keyword: '',
      receiverName: '',
      menuListActive: {},
      page: {
        pageNum: 1,
        pageSize: 25,
        total: 0
      },
      searchTypeList: [
        { label: '接收人名称', id: 0 },
        { label: '接收人ID', id: 1 },
        { label: '分组', id: 2, selectOptions: null}
      ],
      // 回显条件
      searchTypeValue: {
        keyword: '',
        selectedValue: '',
        option: null
      },
      pageParam: {
        groupId: null,
        receiverId: null,
        receiverName: ''
      },
      receiverGroups: [],
      columnList: [],
      tableData: [],
      // 添加任务信息
      receiverVisible: false,
      menuList: [],
      receiverId: 0,
      isReceiverDailog: false,
      deleteName: '',
      deleteDialogVisible: false,
      isReceiver: true,
      importDialog: false,
      cpUserImportDialogVisible: false
    }
  },
  async mounted () {
    await this.platformList()
  },
  methods: {
    downloadTemplate () {
      download('接收人导入模板.xlsx')
    },
    importExcel (params) {
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;

      // 通过 FormData 对象上传文件
      let formData = new FormData();
      formData.append("platform", this.menuListActive.id);
      formData.append("file", _file);

      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }

      // 发起请求
      importReceiver(formData, function (res) {
        Message({
          message: '导入成功',
          type: 'success'
        })
        this.importDialog = false
      })
    },
    submitImport() {
      this.$refs.upload.submit();
    },
    doSearch () {
      this.queryReceiver()
    },
    typeSearchChange (value) {
      this.searchTypeValue = value
      let type = this.searchTypeValue.option.id
      let keyword = this.searchTypeValue.keyword
      let selectedValue = this.searchTypeValue.selectedValue;
      this.pageParam.receiverName = ''
      this.pageParam.receiverId = ''
      this.pageParam.groupId = null
      switch (type) {
        case 0:
          // 接收人名称
          this.pageParam.receiverName = keyword
          break;
        case 1:
          // 接收人ID
          this.pageParam.receiverId = keyword
          break
        case 2:
          // 分组
          this.pageParam.groupId = selectedValue
          break;
      }
    },
    async routeTo (platform) {
      if (platform) {
        for (const m of this.menuList) {
          if (m.id === platform) {
            this.menuListActive = m
            await this.initGroup()
            await this.queryReceiver()
            return
          }
        }
      }
      this.menuListActive = this.menuList[0] // 默认显示第一个平台的数据
      await this.initGroup()
      await this.queryReceiver()
    },
    async initGroup () {
      // 初始化查询条件里的分组列表
      let groupRes = await queryGroup(this.menuListActive.id, {
        pageNum: 1,
        pageSize: 2147483647
      })
      let dataList = groupRes.data.dataList;
      this.searchTypeList[2].selectOptions = []
      for (let i = 0; i < dataList.length; i++) {
        this.searchTypeList[2].selectOptions.push({id: dataList[i].id, label: dataList[i].groupName})
      }
      let groupId = this.$route.query.groupId
      if (groupId) {
        this.searchTypeValue.selectedValue = Number(groupId)
        this.searchTypeValue.option = this.searchTypeList[2]
        this.pageParam.groupId = Number(groupId)
      }
    },
    renderHeader (h, { column }) {
      return (
        <el-tooltip
          class="item"
          effect="dark"
          content={column.label}
          placement="top"
        >
          <span>{column.label}</span>
        </el-tooltip>
      )
    },
    handleSizeChange (val) { // 分页数 每页几条
      this.page.pageSize = val
      this.page.pageNum = 1
      this.queryReceiver()
    },
    handleCurrentChange (val) {
      this.page.pageNum = val
      this.queryReceiver()
    },
    handleSave () {
      this.queryReceiver()
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定要删除接收人【' + row.receiverName + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteReceiver(row.id, function () {
          that.queryReceiver()
        })
      }).catch(() => {
      })
    },
    handleGroupInfo (row) {
      this.receiverId = row.id
      this.receiverVisible = true
      this.isReceiverDailog = true
    },
    handleMenuDelete (row) {
      this.deleteDialogVisible = true
      this.taskGroupIds = row.id
      this.deleteName = row.name
      this.isReceiver = true
    },
    // 获取平台列表
    async platformList () {
      let res = await platformList({keyword: this.keyword, pageNo: 1, pageSize: 999})
      if (res.code === 0) {
        this.menuList = res.data
        this.routeTo(this.menuListActive.id || this.$route.query.platform)
      }
    },
    /**
     * 查询
     * @returns {Promise<void>}
     */
    async queryReceiver () {
      let res = await queryReceiver(this.menuListActive.id, {
        ...this.pageParam,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      this.page.total = res.data.total
      this.tableData = res.data.dataList
    }
  },
  watch: {
    receiverVisible (val) {
      if (!val) {
        this.isReceiverDailog = false
        this.groupId = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
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

.importDialog-content {
  display: flex;
  justify-content: center;
}
.importDialog-footer {
  display: flex;
  justify-content: space-between;
}
.importDialog-template-download {
  font-size: 13px;
  color: #666666;
  cursor: pointer;
}
</style>
