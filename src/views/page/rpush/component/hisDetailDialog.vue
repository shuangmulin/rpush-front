<template>
  <el-dialog width="75%" title="消息记录详情" :visible.sync="dialogVisible" top="10vh" @close="doClose()">
    <div class="el-dialog-div">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="平台">
          <el-select size="small" placeholder="平台" multiple collapse-tags v-model="queryParam.platform">
            <el-option v-for="item in platforms" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求号">
          <el-input size="small" placeholder="请求号" clearable v-model="queryParam.requestNo"></el-input>
        </el-form-item>
        <el-form-item label="接收人ID">
          <el-input size="small" placeholder="接收人ID" clearable v-model="queryParam.receiverId"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" multiple collapse-tags placeholder="状态" v-model="queryParam.sendStatus">
            <el-option label="未开始" value="0"></el-option>
            <el-option label="成功" value="1"></el-option>
            <el-option label="失败" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateCreated"
            type="datetimerange"
            size="small"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="doQuery()">查询</el-button>
          <el-button size="small" type="primary" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridData">
        <el-table-column property="requestNo" label="请求号" width="200"></el-table-column>
        <el-table-column property="platformAlias" label="平台" width="130"></el-table-column>
        <el-table-column property="receiverId" label="接收人ID" width="150"></el-table-column>
        <el-table-column property="sendStatusName" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :type="scope.row.sendStatus === 1 ? 'success' : (scope.row.sendStatus === 0 ? 'warning' : 'danger')"
              disable-transitions>{{ scope.row.sendStatusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="dateCreated" label="时间" width="150"></el-table-column>
        <el-table-column property="configName" label="配置" width="100"></el-table-column>
        <el-table-column property="configId" label="配置ID" width="60"></el-table-column>
        <el-table-column label="错误信息" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.sendStatus === 2" type="text" @click="doErrorMsg(scope.row.errorMsg)">点击查看</el-button>
            <span v-if="scope.row.sendStatus !== 2">{{scope.row.errorMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求参数" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="doShowJson(scope.row.paramJson)">点击查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="table_page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page.pageNum"
                     :page-sizes="[10, 25, 50, 100, 150]"
                     :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>
    </div>
    <el-dialog
      width="30%"
      title="请求参数"
      :visible.sync="showJson"
      @closed="closedShowJson"
      append-to-body>
      <json-viewer :value="jsonStr" :expand-depth="5" copyable sort></json-viewer>
    </el-dialog>
    <el-dialog
      width="30%"
      title="错误信息"
      :visible.sync="showErrorMsg"
      @closed="closedErrorMsg"
      append-to-body>
      <span style="font-size: 14px; color: #111111; line-height: 25px">{{errorMsg}}</span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import {queryHisDetail, platformList} from '@/api/rpush'
import JsonViewer from "vue-json-viewer";

export default {
  name: 'hisDetailDialog',
  components: {
    JsonViewer,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    requestNo: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showErrorMsg: false,
      errorMsg: '',
      showJson: false,
      jsonStr: '',
      gridData: [],
      page: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      platforms: [],
      queryParam: {
        requestNo: '',
        receiverId: '',
        platform: [],
        sendStatus: []
      },
      dateCreated: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    requestNo () {
      this.initQueryParam()
      this.queryHisDetail()
    },
    platform () {
      this.initQueryParam()
      this.queryHisDetail()
    }
  },
  methods: {
    async init () {
      this.initQueryParam()
      await this.queryHisDetail()
      let platformRes = await platformList({pageNo: 1, pageSize: 999})
      this.platforms = platformRes.data
    },
    initQueryParam () {
      this.queryParam = {
        requestNo: '',
        receiverId: '',
        platform: [],
        sendStatus: []
      }
      this.dateCreated = []
      if (this.requestNo) {
        this.queryParam.requestNo = this.requestNo
      }
      if (this.platform) {
        this.queryParam.platform = [this.platform]
      }
    },
    handleSizeChange (val) { // 分页数 每页几条
      this.page.pageSize = val
      this.page.pageNum = 1
      this.queryHisDetail()
    },
    handleCurrentChange (val) {
      this.page.pageNum = val
      this.queryHisDetail()
    },
    doQuery () {
      this.queryHisDetail()
    },
    async queryHisDetail () {
      let res = await queryHisDetail({
        ...this.page,
        ...this.queryParam,
        dateCreatedStart: this.dateCreated && this.dateCreated.length ? this.dateCreated[0] : null,
        dateCreatedEnd: this.dateCreated && this.dateCreated.length ? this.dateCreated[1] : null
      })
      this.page.total = res.data.total
      this.gridData = res.data.dataList
    },
    resetForm () {
      this.initQueryParam()
    },
    doClose () {
      this.$emit("closed")
    },
    doShowJson (json) {
      this.showJson = true
      this.jsonStr = JSON.parse(json)
    },
    doErrorMsg (errorMsg) {
      this.showErrorMsg = true
      this.errorMsg = errorMsg
    },
    closedShowJson () {
      this.showJson = false
      this.jsonStr = ''
    },
    closedErrorMsg () {
      this.showErrorMsg = false
      this.errorMsg = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.table_page {
  text-align: center;
  padding-top: 10px;
}

.el-dialog-div {
  height: 60vh;
  overflow: auto;
}
</style>
