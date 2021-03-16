<template>
  <div class="taskManagement">
    <!-- 头部 -->
    <div class="taskManagement_header">
      <div class="title">接收人分组管理</div>
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
                <div class="el-icon-circle-plus-outline addTask" @click="handleGroupInfo">添加分组</div>
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
                                     width="60"/>
                    <el-table-column align="center"
                                     label='分组名称'
                                     show-overflow-tooltip
                                     prop="groupName"
                                     :rander-header="renderHeader"
                                     width="600"/>
                    <el-table-column
                      width="250"
                      label="操作">
                      <template slot-scope="scope">
                        <div class="optionIng">
                          <span class="operating" @click="toReceiverPage(scope.row)">管理接收人</span>
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
    <group-dialog :dialogVisible.sync="groupVisible" :platform="menuListActive.id" :groupId="groupId" v-if="isGroupDailog" @handleSave="handleSave"></group-dialog>
  </div>
</template>
<script>
import { platformList, queryGroup, deleteGroup } from '@/api/rpush'

export default {
  name: 'groupManagement',
  components: {
    groupDialog: () => import('./component/groupDialog.vue'),
    nfTypeFilterInput: () => import('@/components/nf-type-filter-input.vue')
  },
  data () {
    return {
      keyword: '',
      groupName: '',
      menuListActive: {},
      page: {
        pageNum: 1,
        pageSize: 25,
        total: 0
      },
      searchTypeList: [
        {label: '分组名称', id: 0}
      ],
      pageParam: {
        groupName: null
      },
      columnList: [],
      tableData: [],
      // 添加任务信息
      groupVisible: false,
      menuList: [],
      groupId: 0,
      isGroupDailog: false,
      deleteName: '',
      deleteDialogVisible: false,
      taskGroupIds: '',
      isGroup: true
    }
  },
  async mounted () {
    this.platformList()
  },
  methods: {
    doSearch () {
      this.queryGroup()
    },
    typeSearchChange (value) {
      this.searchTypeValue = value
      this.pageParam.groupName = this.searchTypeValue.keyword
    },
    toReceiverPage (row) {
      this.$router.push({name: "receiverManagement", query: {groupId: row.id, platform: this.menuListActive.id}})
    },
    routeTo (platform) {
      if (platform) {
        for (const m of this.menuList) {
          if (m.id === platform) {
            this.menuListActive = m
            this.queryGroup()
            return
          }
        }
      }
      this.menuListActive = this.menuList[0] // 默认显示第一个平台的数据
      this.queryGroup()
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
      this.queryGroup()
    },
    handleCurrentChange (val) {
      this.page.pageNum = val
      this.queryGroup()
    },
    handleSave () {
      this.queryGroup()
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定要删除分组【' + row.groupName + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id, function () {
          that.queryGroup()
        })
      }).catch(() => {
      })
    },
    handleGroupInfo (row) {
      this.groupId = row.id
      this.groupVisible = true
      this.isGroupDailog = true
    },
    handleMenuDelete (row) {
      this.deleteDialogVisible = true
      this.taskGroupIds = row.id
      this.deleteName = row.name
      this.isGroup = true
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
    async queryGroup () {
      let res = await queryGroup(this.menuListActive.id, {
        groupName: this.pageParam.groupName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
      this.page.total = res.data.total
      this.tableData = res.data.dataList
    }
  },
  watch: {
    groupVisible (val) {
      if (!val) {
        this.isGroupDailog = false
        this.groupId = ''
      }
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
</style>
