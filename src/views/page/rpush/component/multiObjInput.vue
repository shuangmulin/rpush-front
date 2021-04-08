<template>
  <div class="multi-input">
    <el-card class="box-card">
      <div slot="header">
        <span>{{ title }}</span>
      </div>
      <el-table
        :data="inputTableData"
        height="34"
        border
        :show-header=false
        :row-style="{height: '0'}"
        :cell-style="{padding: '0'}"
        empty-text="请添加"
        style="width: 100%">
        <el-table-column align="center"
                         label='序号'
                         width="50"/>
        <el-table-column
          v-for="item in headers"
          width="130">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入..."
              v-model="inputData[item.key]"
              size="small"
              clearable>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="addItem" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="value"
        height="150"
        border
        stripe
        empty-text="请添加"
        :cell-style="{padding: '0'}"
        style="width: 100%">
        <el-table-column type="index"
                         align="center"
                         label='序号'
                         :index="index => index + 1"
                         width="50"/>
        <el-table-column
          v-for="item in headers"
          :prop="item.key"
          :label="item.label"
          show-overflow-tooltip
          width="130">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteItem(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { Message } from 'element-ui';

export default {
  name: 'multiObjInput',
  props: {
    title: {
      type: String,
      default: "多对象输入"
    },
    headers: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      inputData: {},
      inputTableData: []
    }
  },
  mounted () {
    let inputTableDataItem = {}
    for (let i = 0; i < this.headers.length; i++) {
      inputTableDataItem[this.headers[i].key] = this.headers[i].key
    }
    this.inputTableData.push(inputTableDataItem)
  },
  methods: {
    addItem () {
      if (Object.getOwnPropertyNames(this.inputData).length <= 1) {
        Message.closeAll()
        this.$message({
          showClose: true,
          message: '请输入后点击',
          type: 'warning'
        });
        return
      }
      if (this.indexOf(this.value, this.inputData) > -1) {
        Message.closeAll()
        this.$message({
          showClose: true,
          message: '不可添加重复项',
          type: 'warning'
        });
        return
      }
      this.value.push(this.inputData)
      this.inputData = {}
      this.onChange()
    },
    deleteItem (row) {
      let indexOf = this.indexOf(this.value, row)
      if (indexOf === -1) {
        return
      }
      this.value.splice(indexOf, 1)
      this.onChange()
    },
    indexOf (arr, obj) {
      out:for (let i = 0; i < arr.length; i++) {
        let arrItem = arr[i]
        if (Object.getOwnPropertyNames(arrItem).length !== Object.getOwnPropertyNames(obj).length) {
          continue
        }
        for (let key in obj) {
          if (obj[key] !== arrItem[key]) {
            continue out
          }
        }
        return i
      }
      return -1;
    },
    onChange () {
      this.$emit('change', this.value)
    }
  }
}
</script>
<style scoped>
.multi-input>>>.el-input__inner {
  border: 2px;
}
.multi-input>>>.el-card__header {
  padding: 12px;
}
</style>
<style lang="scss">

</style>
