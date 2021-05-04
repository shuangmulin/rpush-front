<template>
  <div class="taskManagement">
    <!-- 头部 -->
    <div class="taskManagement_header">
      <div class="title">定时任务</div>
    </div>
    <!-- 内容 -->
    <div class="taskManagement_container">
      <div class="tm_c_wrap">
        <!-- 右边表格 -->
        <div class="tm_c_table">
          <div class="setOfLayer">
            <div class="features">
              <span class="title">
                <el-form :inline="true">
                  <el-form-item label="任务名称">
                    <el-input size="mini" v-model="pageParam.jobName" clearable placeholder="任务名称"></el-input>
                  </el-form-item>
                  <el-form-item label="任务分组">
                    <el-input size="mini" v-model="pageParam.jobGroup" clearable placeholder="任务分组"></el-input>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-select size="mini" v-model="pageParam.enableFlag" clearable placeholder="是否启用">
                      <el-option label="已停用" value="false"></el-option>
                      <el-option label="已启用" value="true"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="mini" type="primary" @click="doSearch">查询</el-button>
                  </el-form-item>
                </el-form>
              </span>
              <div class="features_right">
                <div class="el-icon-circle-plus-outline addTask" @click="handleTaskInfo">添加任务</div>
              </div>
            </div>
            <!-- 备注说明 -->
            <div class="remarks_box">
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
                                     label='是否启用'
                                     :rander-header="renderHeader"
                                     width="100">
                      <template slot-scope="scope">
                        {{scope.row.enableFlag ? '已启用' : '已停用'}}
                      </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label='任务名称'
                                     show-overflow-tooltip
                                     prop="jobName"
                                     :rander-header="renderHeader"
                                     width="100"/>
                    <el-table-column align="center"
                                     label='任务分组'
                                     show-overflow-tooltip
                                     prop="jobGroup"
                                     :rander-header="renderHeader"
                                     width="100"/>
                    <el-table-column align="center"
                                     label='cron表达式'
                                     show-overflow-tooltip
                                     prop="cronExpression"
                                     :rander-header="renderHeader"
                                     width="100"/>
                    <el-table-column align="center"
                                     label='预设开始时间'
                                     show-overflow-tooltip
                                     prop="startAt"
                                     :rander-header="renderHeader"
                                     width="200"/>
                    <el-table-column align="center"
                                     label='预设结束时间'
                                     show-overflow-tooltip
                                     prop="endAt"
                                     :rander-header="renderHeader"
                                     width="200"/>
                    <el-table-column align="center"
                                     label='参数'
                                     show-overflow-tooltip
                                     prop="param"
                                     :rander-header="renderHeader"
                                     width="100">
                      <template slot-scope="scope">
                        <el-button type="text" @click="openShowParamJson(scope.row)">点击查看</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label='任务描述'
                                     show-overflow-tooltip
                                     prop="description"
                                     :rander-header="renderHeader"
                                     width="100"/>
                    <el-table-column align="center"
                                     label='创建时间'
                                     show-overflow-tooltip
                                     prop="dateCreated"
                                     :rander-header="renderHeader"
                                     width="200"/>
                    <el-table-column align="center"
                                     label='更新时间'
                                     show-overflow-tooltip
                                     prop="dateUpdated"
                                     :rander-header="renderHeader"
                                     width="200"/>
                    <el-table-column
                      width="120"
                      fixed="right"
                      label="操作">
                      <template slot-scope="scope">
                        <div class="optionIng">
                          <span class="operating" @click="handleTaskInfo(scope.row)">编辑</span>
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
    <task-dialog :dialogVisible.sync="taskVisible" :taskId="taskId" v-if="isTaskDailog" @handleSave="handleSave"></task-dialog>
    <el-dialog
      width="30%"
      title="请求参数"
      :visible.sync="showParamJson.show"
      @closed="closeShowParamJson"
      append-to-body>
      <json-viewer :value="showParamJson.json" :expand-depth="5" copyable sort></json-viewer>
    </el-dialog>
  </div>
</template>
<script>
import { queryTask, deleteTask } from '@/api/rpush'
import JsonViewer from "vue-json-viewer";

export default {
  name: 'taskManagement',
  components: {
    JsonViewer,
    taskDialog: () => import('./component/taskDialog.vue'),
    nfTypeFilterInput: () => import('@/components/nf-type-filter-input.vue')
  },
  data () {
    return {
      keyword: '',
      taskName: '',
      menuListActive: {},
      page: {
        pageNum: 1,
        pageSize: 25,
        total: 0
      },
      searchTypeList: [
        {label: '任务名称', id: 0}
      ],
      pageParam: {
        jobName: null,
        jobGroup: null,
        enableFlag: null
      },
      columnList: [],
      tableData: [],
      // 添加任务信息
      taskVisible: false,
      menuList: [],
      taskId: 0,
      isTaskDailog: false,
      deleteName: '',
      deleteDialogVisible: false,
      taskTaskIds: '',
      isTask: true,
      showParamJson: {
        show: false,
        json: null
      }
    }
  },
  async mounted () {
    this.queryTask()
  },
  methods: {
    doSearch () {
      this.queryTask()
    },
    handleSizeChange (val) { // 分页数 每页几条
      this.page.pageSize = val
      this.page.pageNum = 1
      this.queryTask()
    },
    handleCurrentChange (val) {
      this.page.pageNum = val
      this.queryTask()
    },
    handleSave () {
      this.queryTask()
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定要删除任务【' + row.jobName + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(row.id, function () {
          that.queryTask()
        })
      }).catch(() => {
      })
    },
    handleTaskInfo (row) {
      this.taskId = row.id
      this.taskVisible = true
      this.isTaskDailog = true
    },
    handleMenuDelete (row) {
      this.deleteDialogVisible = true
      this.taskTaskIds = row.id
      this.deleteName = row.name
      this.isTask = true
    },
    /**
     * 查询
     * @returns {Promise<void>}
     */
    async queryTask () {
      let res = await queryTask({
        ...this.pageParam,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      })
      this.page.total = res.data.total
      this.tableData = res.data.dataList
    },
    closeShowParamJson () {
      this.showParamJson.show = false
    },
    openShowParamJson (row) {
      this.showParamJson.json = JSON.parse(row.param)
      this.showParamJson.show = true
    }
  },
  watch: {
    taskVisible (val) {
      if (!val) {
        this.isTaskDailog = false
        this.taskId = ''
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
.el-form-item{
  margin-bottom: 0;
}
</style>
